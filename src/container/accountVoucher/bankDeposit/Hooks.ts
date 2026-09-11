import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useListPerPage } from "@/lib/useListPerPage";
import { useVoucherListDateFilter } from "@/lib/useVoucherListDateFilter";
import { normalizeVoucherListDetails } from "@/lib/voucherTableDate";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import { BankDepositFormData } from "@/types/accountVoucher/BankDepositTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { format } from "date-fns";
import {
  addBankDepositAPI,
  deleteBankDepositAPI,
  getBankDepositAPI,
} from "./BankDepositApis";
import { getBankDepositData } from "./BankDepositReducer";
import { getBankBalanceAPI } from "../payment/PaymentApis";

export const useBankDeposit = () => {
  const dispatch = useDispatch();

  const [addBankDepositLoading, setAddBankDepositLoading] = useState(false);
  const [deleteBankDepositLoading, setDeleteBankDepositLoading] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);
  const [finId, setFinId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { perPage, handlePerPageChange } = useListPerPage(() =>
    setCurrentPage(1),
  );
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    fromDateApi,
    toDateApi,
  } = useVoucherListDateFilter();

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
    depositDate: yup.date().required("Deposit date is required"),
    particular: yup.string().required("Particular is required"),
    manualVoucherNo: yup.string().default(""),
    bankId: yup.string().required("Bank is required"),
    availableBalance: yup.string().default(""),
    amount: yup.string().required("Amount is required"),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<BankDepositFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      depositDate: undefined,
      particular: "",
      manualVoucherNo: "",
      bankId: "",
      availableBalance: "",
      amount: "",
    },
  });

  const { depositDate, bankId } = form.watch();

  // Handle form submission
  const handleSubmit: SubmitHandler<BankDepositFormData> = (values) => {
    if (orgId && finId) {
      addBankDepositApiCall(values);
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleShowDeleteDialog = (id: number) => {
    setShowDeleteDialog(true);
    setTempDeleteId(id);
  };

  const handleDeleteBankDeposit = () => {
    if (orgId && tempDeleteId) deleteBankDepositApiCall(orgId, tempDeleteId);
  };

  const addBankDepositApiCall = async (item: BankDepositFormData) => {
    setAddBankDepositLoading(true);

    const data = {
      org_id: orgId,
      trans_date: format(item.depositDate, "yyyy-MM-dd"),
      bank_id: item.bankId,
      particular: item.particular,
      amount: item.amount,
      ref_vouch: item.manualVoucherNo,
      year_id: finId,
    };

    try {
      const res: ApiResponse = await addBankDepositAPI(data);

      if (res.status === 200) {
        form.reset();
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddBankDepositLoading(false);
    }
  };

  const deleteBankDepositApiCall = async (orgId: number, depositId: number) => {
    setDeleteBankDepositLoading(true);

    const data = {
      org_id: orgId,
      trans_id: depositId,
    };

    try {
      const res: ApiResponse = await deleteBankDepositAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        getBankDepositApiCall(orgId, 1);
        setShowDeleteDialog(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteBankDepositLoading(false);
    }
  };

  const getBankDepositApiCall = async (orgId: number, page: number) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getBankDepositAPI(
        orgId,
        page,
        perPage,
        fromDateApi,
        toDateApi,
      );

      if (res.status === 200) {
        const { rows, lastPage: pageCount } = normalizeVoucherListDetails(
          res.data.details,
        );
        dispatch(getBankDepositData(rows));
        setLastPage(pageCount);
      } else {
        dispatch(getBankDepositData([]));
        setLastPage(1);
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getBankDepositData([]));
      setLastPage(1);
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

  const prevDepositDate = useRef<Date>(depositDate);
  const prevBankId = useRef(bankId);

  useEffect(() => {
    if (
      orgId &&
      bankId &&
      depositDate &&
      (bankId !== prevBankId.current || depositDate !== prevDepositDate.current)
    ) {
      getBankBalanceApiCall(orgId, depositDate, bankId);
    }
    prevDepositDate.current = depositDate;
    prevBankId.current = bankId;
  }, [depositDate, bankId, orgId]);

  return {
    getBankDepositApiCall,
    addBankDepositLoading,
    deleteBankDepositLoading,
    loading,
    form,
    handleSubmit,
    selected,
    setSelected,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeleteBankDeposit,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
  };
};
