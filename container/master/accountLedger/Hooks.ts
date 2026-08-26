import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";

import getCookieData from "@/utils/getCookieData";
import { useDispatch, useSelector } from "react-redux";
import {
  AccountLedgerFormData,
  AccountLedgerTableData,
} from "@/types/master/AccountLedgerTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { getAccountLedgerData } from "./AccountLedgerReducer";
import {
  addAccountLedgerAPI,
  deleteAccountLedgerAPI,
  getAccountLedgerAPI,
  updateAccountLedgerAPI,
} from "./AccountLedgerApis";
import { decimalRegex } from "@/utils/validationRegex";
import { toTwoDecimalString } from "@/utils/formatDecimal";
import {
  getMasterDeleteWarningMessage,
  isMasterDeleteDependencyResponse,
} from "@/lib/masterDelete";
import { resolveListTotalCount } from "@/lib/listTotalCount";

interface AccountLedgerState {
  accountLedgerData: AccountLedgerTableData[];
}

interface RootState {
  accountLedger: AccountLedgerState;
}

export const useAccountLedger = () => {
  const dispatch = useDispatch();

  const [addAccountLedgerLoading, setAddAccountLedgerLoading] = useState(false);
  const [updateAccountLedgerLoading, setUpdateAccountLedgerLoading] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);

  const [mainHeadInput, setMainHeadInput] = useState("");
  const [headInput, setHeadInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [ledgerTableInput, setLedgerTableInput] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<AccountLedgerTableData | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);
  const [deleteAccountLedgerLoading, setDeleteAccountLedgerLoading] =
    useState(false);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  const accountLedgerData: AccountLedgerTableData[] = useSelector(
    (state: RootState) => state?.accountLedger?.accountLedgerData
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    ledgerName: yup.string().required("Ledger name is required"),
    underMainHeadId: yup
      .string()
      .default("")
      .test("at-least-one-required", function (value) {
        const { underHeadId } = this.parent; // Access sibling field
        if (!value && !underHeadId) {
          return this.createError({
            message: "Either 'Main head' or 'Head' is required.",
          });
        }
        return true; // Validation passes if either field has a value
      }),
    underHeadId: yup
      .string()
      .default("")
      .test("at-least-one-required", function (value) {
        const { underMainHeadId } = this.parent; // Access sibling field
        if (!value && !underMainHeadId) {
          return this.createError({
            message: "Either 'Main head' or 'Head' is required.",
          });
        }
        return true; // Validation passes if either field has a value
      }),
    openingBalance: yup
      .string()
      .required("Opening balance is required")
      .test("is-valid-number", "Invalid opening balance", (value) => {
        if (!value) return false; // Ensure the field is not empty
        return decimalRegex.test(value); // Validate against the regex
      }),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<AccountLedgerFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      ledgerName: "",
      underMainHeadId: "",
      underHeadId: "",
      openingBalance: "",
    },
  });

  const { underMainHeadId, underHeadId } = form.watch();

  // Handle form submission
  const handleSubmit: SubmitHandler<AccountLedgerFormData> = (values) => {
    if (orgId) {
      if (editData && Object.keys(editData).length > 0) {
        updateAccountLedgerApiCall(editData.Id, values, orgId);
      } else {
        addAccountLedgerApiCall(values, orgId);
      }
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const handleEditData = (data: AccountLedgerTableData) => {
    setEditData(data);
    setIsOpen(true);
  };

  const handleShowDeleteDialog = (id: number) => {
    setTempDeleteId(id);
    setDeleteWarning(null);
    setShowDeleteDialog(true);
  };

  const handleDeleteAccountLedger = () => {
    if (orgId && tempDeleteId) {
      deleteAccountLedgerApiCall(orgId, tempDeleteId);
    }
  };

  const handleFilterTableData = (value: string) => {
    setLedgerTableInput(value);
    setCurrentPage(1);
    if (orgId) getAccountLedgerApiCall(orgId, 1, value, "TABLE");
  };

  const addAccountLedgerApiCall = async (
    item: AccountLedgerFormData,
    orgId: number
  ) => {
    setAddAccountLedgerLoading(true);

    const data = {
      org_id: orgId,
      ledger_name: item.ledgerName,
      head_id: item.underMainHeadId,
      sub_head: item.underHeadId,
      open_balance: toTwoDecimalString(item.openingBalance),
    };

    try {
      const res: ApiResponse = await addAccountLedgerAPI(data);

      if (res.status === 200) {
        form.reset();
        setMainHeadInput("");
        setHeadInput("");
        setIsOpen(false);
        setCurrentPage(1);
        setLedgerTableInput("");
        getAccountLedgerApiCall(orgId, 1, "", "TABLE");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddAccountLedgerLoading(false);
    }
  };

  const updateAccountLedgerApiCall = async (
    ledgerId: number,
    item: AccountLedgerFormData,
    orgId: number
  ) => {
    let data = {
      org_id: orgId,
      ledger_id: ledgerId,
      ledger_name: item.ledgerName,
      head_id: item.underMainHeadId,
      sub_head: item.underHeadId,
      open_balance: toTwoDecimalString(item.openingBalance),
    };
    setUpdateAccountLedgerLoading(true);
    try {
      const res = await updateAccountLedgerAPI(data);
      if (res.status === 200) {
        toast.success(res.data.message);
        form.reset();
        setMainHeadInput("");
        setHeadInput("");
        setCurrentPage(1);
        setLedgerTableInput("");
        getAccountLedgerApiCall(orgId, 1, "", "TABLE");
        setIsOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdateAccountLedgerLoading(false);
    }
  };

  const getAccountLedgerApiCall = async (
    orgId: number,
    page: number,
    keyword: string,
    type: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getAccountLedgerAPI(orgId, page, keyword);

      if (res.status === 200) {
        const newData =
          type === "TABLE" || page === 1
            ? res.data.details?.data
            : [...accountLedgerData, ...res.data.details?.data];
        dispatch(getAccountLedgerData(newData));
        setLastPage(res.data.details?.last_page);
        if (type === "TABLE" && !keyword) {
          setTotalCount(resolveListTotalCount(res.data.details));
        }
      } else {
        dispatch(getAccountLedgerData([]));
        if (type === "TABLE" && !keyword) {
          setTotalCount(0);
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getAccountLedgerData([]));
      if (type === "TABLE" && !keyword) {
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteAccountLedgerApiCall = async (
    orgId: number,
    ledgerId: number) => {
    setDeleteAccountLedgerLoading(true);

    const data = {
      org_id: orgId,
      ledger_id: ledgerId,
    };

    try {
      const res: ApiResponse = await deleteAccountLedgerAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        setShowDeleteDialog(false);
        setTempDeleteId(null);
        setDeleteWarning(null);
        setCurrentPage(1);
        setLedgerTableInput("");
        getAccountLedgerApiCall(orgId, 1, "", "TABLE");
      } else if (isMasterDeleteDependencyResponse(res)) {
        setDeleteWarning(getMasterDeleteWarningMessage(res));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteAccountLedgerLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        ledgerName: editData.Ledger_Name || "",
        underMainHeadId: editData.Head_Id?.toString() || "",
        underHeadId: editData.Sub_Head?.toString() || "",
        openingBalance: toTwoDecimalString(editData.Open_Balance) || "0.00",
      });
    } else {
      form.reset({
        ledgerName: "",
        underMainHeadId: "",
        underHeadId: "",
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
    setMainHeadInput("");
    setHeadInput("");
  });

  useEffect(() => {
    if (!isOpen) return;
    if (underHeadId || underMainHeadId)
      form.trigger(["underMainHeadId", "underHeadId"]);
  }, [isOpen, underMainHeadId, underHeadId]);

  return {
    getAccountLedgerApiCall,
    addAccountLedgerLoading,
    updateAccountLedgerLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    currentPage,
    setCurrentPage,
    lastPage,
    totalCount,
    ledgerTableInput,
    handleFilterTableData,
    mainHeadInput,
    setMainHeadInput,
    headInput,
    setHeadInput,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteAccountLedger,
    deleteAccountLedgerLoading,
    deleteWarning,
  };
};
