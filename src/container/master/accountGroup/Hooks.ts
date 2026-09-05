import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";

import getCookieData from "@/utils/getCookieData";
import { useDispatch, useSelector } from "react-redux";
import {
  AccountGroupFormData,
  AccountGroupTableData,
  AccountMainHeadData,
} from "@/types/master/AccountGroupTypes";
import { ApiResponse } from "@/types/ApiTypes";
import {
  getAccountGroupData,
  getAccountMainHeadData,
} from "./AccountGroupReducer";
import {
  addAccountGroupAPI,
  deleteAccountGroupAPI,
  getAccountGroupAPI,
  getAccountMainHeadAPI,
  updateAccountGroupAPI,
} from "./AccountGroupApis";
import {
  getMasterDeleteWarningMessage,
  isMasterDeleteDependencyResponse,
} from "@/lib/masterDelete";
import { resolveListTotalCount } from "@/lib/listTotalCount";
import { useListPerPage } from "@/lib/useListPerPage";

interface AccountGroupState {
  accountMainHeadData: AccountMainHeadData[];
  accountGroupData: AccountGroupTableData[];
}

interface RootState {
  accountGroup: AccountGroupState;
}

export const useAccountGroup = () => {
  const dispatch = useDispatch();

  const [addAccountGroupLoading, setAddAccountGroupLoading] = useState(false);
  const [updateAccountGroupLoading, setUpdateAccountGroupLoading] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);

  const [currentMainHeadPage, setCurrentMainHeadPage] = useState(1);
  const [lastMainHeadPage, setLastMainHeadPage] = useState(1);
  const [mainHeadInput, setMainHeadInput] = useState("");
  const [getMainHeadLoading, setGetMainHeadLoading] = useState(false);

  const [currentGroupPage, setCurrentGroupPage] = useState(1);
  const [lastGroupPage, setLastGroupPage] = useState(1);
  const { perPage, handlePerPageChange } = useListPerPage(() =>
    setCurrentGroupPage(1),
  );
  const [totalCount, setTotalCount] = useState(0);
  const [headInput, setHeadInput] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<AccountGroupTableData | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);
  const [deleteAccountGroupLoading, setDeleteAccountGroupLoading] =
    useState(false);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  const accountMainHeadData: AccountMainHeadData[] = useSelector(
    (state: RootState) => state?.accountGroup?.accountMainHeadData
  );

  const accountGroupData: AccountGroupTableData[] = useSelector(
    (state: RootState) => state?.accountGroup?.accountGroupData
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    headName: yup.string().required("Head name is required"),
    underHeadId: yup.string().required("Under head is required"),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<AccountGroupFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      headName: "",
      underHeadId: "",
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<AccountGroupFormData> = (values) => {
    if (orgId) {
      if (editData && Object.keys(editData).length > 0) {
        updateAccountGroupApiCall(editData.Id, values, orgId);
      } else {
        addAccountGroupApiCall(values, orgId);
      }
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const handleEditData = (data: AccountGroupTableData) => {
    setEditData(data);
    setIsOpen(true);
  };

  const handleShowDeleteDialog = (id: number) => {
    setTempDeleteId(id);
    setDeleteWarning(null);
    setShowDeleteDialog(true);
  };

  const handleDeleteAccountGroup = () => {
    if (orgId && tempDeleteId) {
      deleteAccountGroupApiCall(orgId, tempDeleteId);
    }
  };

  const addAccountGroupApiCall = async (
    item: AccountGroupFormData,
    orgId: number
  ) => {
    setAddAccountGroupLoading(true);

    const data = {
      org_id: orgId,
      head_name: item.headName,
      under_head: item.underHeadId,
    };

    try {
      const res: ApiResponse = await addAccountGroupAPI(data);

      if (res.status === 200) {
        form.reset();
        setIsOpen(false);
        setCurrentGroupPage(1);
        getAccountGroupApiCall(orgId, 1, "", "TABLE");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddAccountGroupLoading(false);
    }
  };

  const updateAccountGroupApiCall = async (
    headId: number,
    item: AccountGroupFormData,
    orgId: number
  ) => {
    let data = {
      org_id: orgId,
      head_id: headId,
      head_name: item.headName,
      under_head: item.underHeadId,
    };
    setUpdateAccountGroupLoading(true);
    try {
      const res = await updateAccountGroupAPI(data);
      if (res.status === 200) {
        toast.success(res.data.message);
        form.reset();
        setCurrentGroupPage(1);
        getAccountGroupApiCall(orgId, 1, "", "TABLE");
        setIsOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdateAccountGroupLoading(false);
    }
  };

  const getAccountGroupApiCall = async (
    orgId: number,
    page: number,
    keyword: string,
    type: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getAccountGroupAPI(
        orgId,
        page,
        keyword,
        type === "TABLE" ? perPage : undefined,
      );

      if (res.status === 200) {
        const newData =
          type === "TABLE" || page === 1
            ? res.data.details?.data
            : [...accountGroupData, ...res.data.details?.data];
        dispatch(getAccountGroupData(newData));
        setLastGroupPage(res.data.details?.last_page);
        if (type === "TABLE" && !keyword) {
          setTotalCount(resolveListTotalCount(res.data.details));
        }
      } else {
        dispatch(getAccountGroupData([]));
        if (type === "TABLE" && !keyword) {
          setTotalCount(0);
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getAccountGroupData([]));
      if (type === "TABLE" && !keyword) {
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const getAccountMainHeadApiCall = async (
    orgId: number,
    page: number,
    keyword: string
  ) => {
    setGetMainHeadLoading(true);

    try {
      const res: ApiResponse = await getAccountMainHeadAPI(
        orgId,
        page,
        keyword
      );

      if (res.status === 200) {
        const newData =
          page === 1
            ? res.data.details?.data
            : [...accountMainHeadData, ...res.data.details?.data];
        dispatch(getAccountMainHeadData(newData));
        setLastMainHeadPage(res.data.details?.last_page);
      } else {
        dispatch(getAccountMainHeadData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getAccountMainHeadData([]));
    } finally {
      setGetMainHeadLoading(false);
    }
  };

  const deleteAccountGroupApiCall = async (
    orgId: number,
    headId: number) => {
    setDeleteAccountGroupLoading(true);

    const data = {
      org_id: orgId,
      head_id: headId,
    };

    try {
      const res: ApiResponse = await deleteAccountGroupAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        setShowDeleteDialog(false);
        setTempDeleteId(null);
        setDeleteWarning(null);
        setCurrentGroupPage(1);
        getAccountGroupApiCall(orgId, 1, "", "TABLE");
      } else if (isMasterDeleteDependencyResponse(res)) {
        setDeleteWarning(getMasterDeleteWarningMessage(res));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteAccountGroupLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        underHeadId: editData.Main_Head.toString() || "",
        headName: editData.Sub_Head_Name || "",
      });
      setMainHeadInput(editData.Head_Name || "");
    } else {
      form.reset({ headName: "", underHeadId: "" });
      setMainHeadInput("");
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
  });

  return {
    getAccountGroupApiCall,
    getAccountMainHeadApiCall,
    addAccountGroupLoading,
    updateAccountGroupLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    currentMainHeadPage,
    setCurrentMainHeadPage,
    lastMainHeadPage,
    currentGroupPage,
    setCurrentGroupPage,
    lastGroupPage,
    perPage,
    handlePerPageChange,
    totalCount,
    mainHeadInput,
    setMainHeadInput,
    headInput,
    setHeadInput,
    getMainHeadLoading,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteAccountGroup,
    deleteAccountGroupLoading,
    deleteWarning,
  };
};
