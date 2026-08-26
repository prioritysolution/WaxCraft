import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import { BankTransferFormData } from "@/types/accountVoucher/BankTransferTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { format } from "date-fns";
import {
  addBankTransferAPI,
  deleteBankTransferAPI,
  getBankTransferAPI,
} from "./BankTransferApis";
import { getBankTransferData } from "./BankTransferReducer";
import { getBankBalanceAPI } from "../payment/PaymentApis";

export const useBankTransfer = () => {
  const dispatch = useDispatch();

  const [addBankTransferLoading, setAddBankTransferLoading] = useState(false);
  const [deleteBankTransferLoading, setDeleteBankTransferLoading] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);
  const [finId, setFinId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [selected, setSelected] = useState("form");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
      setFinId(getCookieData<number | null>("waxCraftClientFinId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    transferDate: yup.date().required("Transfer date is required"),
    particular: yup.string().required("Particular is required"),
    manualVoucherNo: yup.string().default(""),
    sendersBankId: yup.string().required("Senders bank is required"),
    receiversBankId: yup.string().required("Receivers bank is required"),
    availableBalance: yup.string().default(""),
    amount: yup
      .string()
      .required("Amount is required")
      .test(
        "less-than-balance",
        "Amount must be less than available balance",
        function (value) {
          const { availableBalance } = this.parent;

          // Ensure value and availableBalance are numbers before comparison
          const amountValue = parseFloat(value || "0");
          const balanceValue = parseFloat(availableBalance || "0");

          if (amountValue > balanceValue) {
            return false; // Validation fails
          }
          return true; // Validation passes
        }
      ),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<BankTransferFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      transferDate: undefined,
      particular: "",
      manualVoucherNo: "",
      sendersBankId: "",
      receiversBankId: "",
      availableBalance: "",
      amount: "",
    },
  });

  const { transferDate, sendersBankId, availableBalance, amount } =
    form.watch();

  // Handle form submission
  const handleSubmit: SubmitHandler<BankTransferFormData> = (values) => {
    if (orgId && finId) {
      addBankTransferApiCall(values);
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleShowDeleteDialog = (id: number) => {
    setShowDeleteDialog(true);
    setTempDeleteId(id);
  };

  const handleDeleteBankTransfer = () => {
    if (orgId && tempDeleteId) deleteBankTransferApiCall(orgId, tempDeleteId);
  };

  const addBankTransferApiCall = async (item: BankTransferFormData) => {
    setAddBankTransferLoading(true);

    const data = {
      org_id: orgId,
      trans_date: format(item.transferDate, "yyyy-MM-dd"),
      frm_bank: item.sendersBankId,
      to_bank: item.receiversBankId,
      particular: item.particular,
      amount: item.amount,
      ref_vouch: item.manualVoucherNo,
      year_id: finId,
    };

    try {
      const res: ApiResponse = await addBankTransferAPI(data);

      if (res.status === 200) {
        form.reset();
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddBankTransferLoading(false);
    }
  };

  const deleteBankTransferApiCall = async (
    orgId: number,
    transferId: number
  ) => {
    setDeleteBankTransferLoading(true);

    const data = {
      org_id: orgId,
      trans_id: transferId,
    };

    try {
      const res: ApiResponse = await deleteBankTransferAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        getBankTransferApiCall(orgId, 1);
        setShowDeleteDialog(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteBankTransferLoading(false);
    }
  };

  const getBankTransferApiCall = async (orgId: number, page: number) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getBankTransferAPI(orgId, page);

      if (res.status === 200) {
        dispatch(getBankTransferData(res.data.details));
        setLastPage(res.data.details?.pagination?.last_page);
      } else {
        dispatch(getBankTransferData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getBankTransferData([]));
    } finally {
      setLoading(false);
    }
  };

  const getBankBalanceApiCall = async (
    orgId: number,
    date: Date,
    bankId: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getBankBalanceAPI(
        orgId,
        bankId,
        format(date, "yyyy-MM-dd")
      );

      if (res.status === 200) {
        form.setValue("availableBalance", res.data.details);
      } else {
        toast.error(res.data.message);
        form.setValue("availableBalance", "");
      }
    } catch (err) {
      toast.error("Something went wrong");
      form.setValue("availableBalance", "");
    } finally {
      setLoading(false);
    }
  };

  const prevTransferDate = useRef<Date>(transferDate);
  const prevBankId = useRef(sendersBankId);

  useEffect(() => {
    if (
      orgId &&
      sendersBankId &&
      transferDate &&
      (sendersBankId !== prevBankId.current ||
        transferDate !== prevTransferDate.current)
    ) {
      getBankBalanceApiCall(orgId, transferDate, sendersBankId);
    }
    prevTransferDate.current = transferDate;
    prevBankId.current = sendersBankId;
  }, [transferDate, sendersBankId, orgId]);

  useEffect(() => {
    if (availableBalance && amount) form.trigger("amount");
  }, [availableBalance, amount]);

  useEffect(() => {
    form.setValue("receiversBankId", "");
  }, [sendersBankId]);

  return {
    getBankTransferApiCall,
    addBankTransferLoading,
    deleteBankTransferLoading,
    loading,
    form,
    handleSubmit,
    selected,
    setSelected,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeleteBankTransfer,
    currentPage,
    setCurrentPage,
    lastPage,
  };
};
