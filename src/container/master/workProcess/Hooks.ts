import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";

import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import {
  WorkProcessFormData,
  WorkProcessTableData,
} from "@/types/master/WorkProcessTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { getWorkProcessData } from "./WorkProcessReducer";
import {
  addWorkProcessAPI,
  deleteWorkProcessAPI,
  getWorkProcessAPI,
  updateWorkProcessAPI,
} from "./WorkProcessApis";
import {
  getMasterDeleteWarningMessage,
  isMasterDeleteDependencyResponse,
} from "@/lib/masterDelete";
import { resolveListTotalCount } from "@/lib/listTotalCount";

export const useWorkProcess = () => {
  const dispatch = useDispatch();

  const [addWorkProcessLoading, setAddWorkProcessLoading] = useState(false);
  const [updateWorkProcessLoading, setUpdateWorkProcessLoading] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [orgId, setOrgId] = useState<number | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<WorkProcessTableData | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);
  const [deleteWorkProcessLoading, setDeleteWorkProcessLoading] =
    useState(false);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    processName: yup.string().required("Process name is required"),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<WorkProcessFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      processName: "",
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<WorkProcessFormData> = (values) => {
    if (orgId) {
      if (editData && Object.keys(editData).length > 0) {
        updateWorkProcessApiCall(editData.Id, values, orgId);
      } else {
        addWorkProcessApiCall(values, orgId);
      }
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const handleEditData = (data: WorkProcessTableData) => {
    setEditData(data);
    setIsOpen(true);
  };

  const handleShowDeleteDialog = (id: number) => {
    setTempDeleteId(id);
    setDeleteWarning(null);
    setShowDeleteDialog(true);
  };

  const handleDeleteWorkProcess = () => {
    if (orgId && tempDeleteId) {
      deleteWorkProcessApiCall(orgId, tempDeleteId);
    }
  };

  const addWorkProcessApiCall = async (
    item: WorkProcessFormData,
    orgId: number
  ) => {
    setAddWorkProcessLoading(true);

    const data = {
      org_id: orgId,
      process_name: item.processName,
    };

    try {
      const res: ApiResponse = await addWorkProcessAPI(data);

      if (res.status === 200) {
        form.reset();
        setIsOpen(false);
        getWorkProcessApiCall(orgId);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddWorkProcessLoading(false);
    }
  };

  const updateWorkProcessApiCall = async (
    workId: number,
    item: WorkProcessFormData,
    orgId: number
  ) => {
    let data = {
      org_id: orgId,
      work_id: workId,
      process_name: item.processName,
    };
    setUpdateWorkProcessLoading(true);
    try {
      const res = await updateWorkProcessAPI(data);
      if (res.status === 200) {
        toast.success(res.data.message);
        form.reset();
        getWorkProcessApiCall(orgId);
        setIsOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdateWorkProcessLoading(false);
    }
  };

  const getWorkProcessApiCall = async (orgId: number) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getWorkProcessAPI(orgId);

      if (res.status === 200) {
        dispatch(getWorkProcessData(res.data.details));
        setTotalCount(resolveListTotalCount(res.data.details));
      } else {
        dispatch(getWorkProcessData([]));
        setTotalCount(0);
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getWorkProcessData([]));
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkProcessApiCall = async (
    orgId: number,
    workId: number) => {
    setDeleteWorkProcessLoading(true);

    const data = {
      org_id: orgId,
      work_id: workId,
    };

    try {
      const res: ApiResponse = await deleteWorkProcessAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        setShowDeleteDialog(false);
        setTempDeleteId(null);
        setDeleteWarning(null);
        getWorkProcessApiCall(orgId);
      } else if (isMasterDeleteDependencyResponse(res)) {
        setDeleteWarning(getMasterDeleteWarningMessage(res));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteWorkProcessLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        processName: editData.Process_Name || "",
      });
    } else {
      form.reset({ processName: "" });
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
    getWorkProcessApiCall,
    addWorkProcessLoading,
    updateWorkProcessLoading,
    loading,
    totalCount,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteWorkProcess,
    deleteWorkProcessLoading,
    deleteWarning,
  };
};
