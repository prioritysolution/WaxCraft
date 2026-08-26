import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import { BankWithdrawnFormData } from "@/types/accountVoucher/BankWithdrawnTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { format } from "date-fns";
import {
  addBankWithdrawnAPI,
  deleteBankWithdrawnAPI,
  getBankWithdrawnAPI,
} from "./BankWithdrawnApis";
import { getBankWithdrawnData } from "./BankWithdrawnReducer";
import { getBankBalanceAPI } from "../payment/PaymentApis";

export const useBankWithdrawn = () => {
  const dispatch = useDispatch();

  const [addBankWithdrawnLoading, setAddBankWithdrawnLoading] = useState(false);
  const [deleteBankWithdrawnLoading, setDeleteBankWithdrawnLoading] =
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
    withdrawnDate: yup.date().required("Withdrawn date is required"),
    particular: yup.string().required("Particular is required"),
    manualVoucherNo: yup.string().default(""),
    bankId: yup.string().required("Bank is required"),
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
  const form = useForm<BankWithdrawnFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      withdrawnDate: undefined,
      particular: "",
      manualVoucherNo: "",
      bankId: "",
      availableBalance: "",
      amount: "",
    },
  });

  const { withdrawnDate, bankId, availableBalance, amount } = form.watch();

  // Handle form submission
  const handleSubmit: SubmitHandler<BankWithdrawnFormData> = (values) => {
    if (orgId && finId) {
      addBankWithdrawnApiCall(values);
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleShowDeleteDialog = (id: number) => {
    setShowDeleteDialog(true);
    setTempDeleteId(id);
  };

  const handleDeleteBankWithdrawn = () => {
    if (orgId && tempDeleteId) deleteBankWithdrawnApiCall(orgId, tempDeleteId);
  };

  const addBankWithdrawnApiCall = async (item: BankWithdrawnFormData) => {
    setAddBankWithdrawnLoading(true);

    const data = {
      org_id: orgId,
      trans_date: format(item.withdrawnDate, "yyyy-MM-dd"),
      bank_id: item.bankId,
      particular: item.particular,
      amount: item.amount,
      ref_vouch: item.manualVoucherNo,
      year_id: finId,
    };

    try {
      const res: ApiResponse = await addBankWithdrawnAPI(data);

      if (res.status === 200) {
        form.reset();
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddBankWithdrawnLoading(false);
    }
  };

  const deleteBankWithdrawnApiCall = async (
    orgId: number,
    withdrawnId: number
  ) => {
    setDeleteBankWithdrawnLoading(true);

    const data = {
      org_id: orgId,
      trans_id: withdrawnId,
    };

    try {
      const res: ApiResponse = await deleteBankWithdrawnAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        getBankWithdrawnApiCall(orgId, 1);
        setShowDeleteDialog(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteBankWithdrawnLoading(false);
    }
  };

  const getBankWithdrawnApiCall = async (orgId: number, page: number) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getBankWithdrawnAPI(orgId, page);

      if (res.status === 200) {
        dispatch(getBankWithdrawnData(res.data.details));
        setLastPage(res.data.details?.pagination?.last_page);
      } else {
        dispatch(getBankWithdrawnData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getBankWithdrawnData([]));
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

  const prevWithdrawnDate = useRef<Date>(withdrawnDate);
  const prevBankId = useRef(bankId);

  useEffect(() => {
    if (
      orgId &&
      bankId &&
      withdrawnDate &&
      (bankId !== prevBankId.current ||
        withdrawnDate !== prevWithdrawnDate.current)
    ) {
      getBankBalanceApiCall(orgId, withdrawnDate, bankId);
    }
    prevWithdrawnDate.current = withdrawnDate;
    prevBankId.current = bankId;
  }, [withdrawnDate, bankId, orgId]);

  useEffect(() => {
    if (availableBalance && amount) form.trigger("amount");
  }, [availableBalance, amount]);

  return {
    getBankWithdrawnApiCall,
    addBankWithdrawnLoading,
    deleteBankWithdrawnLoading,
    loading,
    form,
    handleSubmit,
    selected,
    setSelected,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeleteBankWithdrawn,
    currentPage,
    setCurrentPage,
    lastPage,
  };
};
