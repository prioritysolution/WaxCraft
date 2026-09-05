import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";

import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import {
  BankAccountFormData,
  BankAccountTableData,
} from "@/types/master/BankAccountTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { getBankAccountData, getBankLedgerData } from "./BankAccountReducer";
import {
  addBankAccountAPI,
  deleteBankAccountAPI,
  getBankAccountAPI,
  getBankLedgerAPI,
  updateBankAccountAPI,
} from "./BankAccountApis";
import { format } from "date-fns";
import { toTwoDecimalString } from "@/utils/formatDecimal";
import {
  getMasterDeleteWarningMessage,
  isMasterDeleteDependencyResponse,
} from "@/lib/masterDelete";
import { resolveListTotalCount } from "@/lib/listTotalCount";
export const useBankAccount = () => {
  const dispatch = useDispatch();

  const [addBankAccountLoading, setAddBankAccountLoading] = useState(false);
  const [updateBankAccountLoading, setUpdateBankAccountLoading] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [orgId, setOrgId] = useState<number | null>(null);

  const [getBankLedgerLoading, setGetBankLedgerLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<BankAccountTableData | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);
  const [deleteBankAccountLoading, setDeleteBankAccountLoading] =
    useState(false);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    bankName: yup.string().required("Bank name is required"),
    branchName: yup.string().required("Branch name is required"),
    ifsc: yup.string().required("IFSC is required"),
    accountNo: yup.string().required("Account no. is required"),
    ledgerId: yup.string().required("Ledger is required"),
    openingDate: yup.date().required("Opening date is required"),
    openingBalance: yup.string().required("Opening balance is required"),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<BankAccountFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      bankName: "",
      branchName: "",
      ifsc: "",
      accountNo: "",
      ledgerId: "",
      openingDate: undefined,
      openingBalance: "",
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<BankAccountFormData> = (values) => {
    if (orgId) {
      if (editData && Object.keys(editData).length > 0) {
        updateBankAccountApiCall(editData.Id, values, orgId);
      } else {
        addBankAccountApiCall(values, orgId);
      }
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const handleEditData = (data: BankAccountTableData) => {
    setEditData(data);
    setIsOpen(true);
  };

  const handleShowDeleteDialog = (id: number) => {
    setTempDeleteId(id);
    setDeleteWarning(null);
    setShowDeleteDialog(true);
  };

  const handleDeleteBankAccount = () => {
    if (orgId && tempDeleteId) {
      deleteBankAccountApiCall(orgId, tempDeleteId);
    }
  };

  const addBankAccountApiCall = async (
    item: BankAccountFormData,
    orgId: number
  ) => {
    setAddBankAccountLoading(true);

    const data = {
      org_id: orgId,
      bank_name: item.bankName,
      branch_Name: item.branchName,
      bank_ifsc: item.ifsc,
      account_no: item.accountNo,
      ledger_id: item.ledgerId,
      opening_date: format(item.openingDate, "yyyyy-MM-dd"),
      open_banalce: toTwoDecimalString(item.openingBalance),
    };

    try {
      const res: ApiResponse = await addBankAccountAPI(data);

      if (res.status === 200) {
        form.reset();
        setIsOpen(false);
        getBankAccountApiCall(orgId);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddBankAccountLoading(false);
    }
  };

  const updateBankAccountApiCall = async (
    bankId: number,
    item: BankAccountFormData,
    orgId: number
  ) => {
    let data = {
      org_id: orgId,
      bank_id: bankId,
      bank_name: item.bankName,
      branch_Name: item.branchName,
      bank_ifsc: item.ifsc,
      account_no: item.accountNo,
      ledger_id: item.ledgerId,
      opening_date: format(item.openingDate, "yyyyy-MM-dd"),
      open_banalce: toTwoDecimalString(item.openingBalance),
    };
    setUpdateBankAccountLoading(true);
    try {
      const res = await updateBankAccountAPI(data);
      if (res.status === 200) {
        toast.success(res.data.message);
        form.reset();
        getBankAccountApiCall(orgId);
        setIsOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdateBankAccountLoading(false);
    }
  };

  const getBankAccountApiCall = async (orgId: number) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getBankAccountAPI(orgId);

      if (res.status === 200) {
        dispatch(getBankAccountData(res.data.details));
        setTotalCount(resolveListTotalCount(res.data.details));
      } else {
        dispatch(getBankAccountData([]));
        setTotalCount(0);
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getBankAccountData([]));
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const getBankLedgerApiCall = async (orgId: number) => {
    setGetBankLedgerLoading(true);

    try {
      const res: ApiResponse = await getBankLedgerAPI(orgId);

      if (res.status === 200) {
        dispatch(getBankLedgerData(res.data.details));
      } else {
        dispatch(getBankLedgerData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getBankLedgerData([]));
    } finally {
      setGetBankLedgerLoading(false);
    }
  };

  const deleteBankAccountApiCall = async (
    orgId: number,
    bankId: number) => {
    setDeleteBankAccountLoading(true);

    const data = {
      org_id: orgId,
      bank_id: bankId,
    };

    try {
      const res: ApiResponse = await deleteBankAccountAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        setShowDeleteDialog(false);
        setTempDeleteId(null);
        setDeleteWarning(null);
        getBankAccountApiCall(orgId);
      } else if (isMasterDeleteDependencyResponse(res)) {
        setDeleteWarning(getMasterDeleteWarningMessage(res));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteBankAccountLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        bankName: editData.Bank_Name || "",
        branchName: editData.Branch_Name || "",
        ifsc: editData.Bank_IFSC || "",
        accountNo: editData.Account_No || "",
        ledgerId: editData.Under_Ledger.toString() || "",
        openingDate: new Date(editData.Opening_Date) || undefined,
        openingBalance: toTwoDecimalString(editData.Opening_Balance),
      });
    } else {
      form.reset({
        bankName: "",
        branchName: "",
        ifsc: "",
        accountNo: "",
        ledgerId: "",
        openingDate: undefined,
        openingBalance: "",
      });
    }
  }, [editData, form.reset]);

  useEffect(() => {
    if (editData && !isOpen) {
      setEditData(null);
    }
  }, [isOpen, editData]);

  useResetFormOnModalClose(isOpen, () => {
    form.reset();
  });

  return {
    getBankAccountApiCall,
    getBankLedgerApiCall,
    addBankAccountLoading,
    updateBankAccountLoading,
    loading,
    totalCount,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    getBankLedgerLoading,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteBankAccount,
    deleteBankAccountLoading,
    deleteWarning,
  };
};
