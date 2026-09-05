import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";

import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import {
  ItemUnitFormData,
  ItemUnitTableData,
} from "@/types/master/ItemUnitTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { getItemUnitData } from "./ItemUnitReducer";
import {
  addItemUnitAPI,
  deleteItemUnitAPI,
  getItemUnitAPI,
  updateItemUnitAPI,
} from "./ItemUnitApis";
import {
  getMasterDeleteWarningMessage,
  isMasterDeleteDependencyResponse,
} from "@/lib/masterDelete";
import { resolveListTotalCount } from "@/lib/listTotalCount";

export const useItemUnit = () => {
  const dispatch = useDispatch();

  const [addItemUnitLoading, setAddItemUnitLoading] = useState(false);
  const [updateItemUnitLoading, setUpdateItemUnitLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [orgId, setOrgId] = useState<number | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<ItemUnitTableData | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);
  const [deleteItemUnitLoading, setDeleteItemUnitLoading] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    unitName: yup.string().required("Unit name is required"),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<ItemUnitFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      unitName: "",
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<ItemUnitFormData> = (values) => {
    if (orgId) {
      if (editData && Object.keys(editData).length > 0) {
        updateItemUnitApiCall(editData.Id, values, orgId);
      } else {
        addItemUnitApiCall(values, orgId);
      }
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const handleEditData = (data: ItemUnitTableData) => {
    setEditData(data);
    setIsOpen(true);
  };

  const handleShowDeleteDialog = (id: number) => {
    setTempDeleteId(id);
    setDeleteWarning(null);
    setShowDeleteDialog(true);
  };

  const handleDeleteItemUnit = () => {
    if (orgId && tempDeleteId) {
      deleteItemUnitApiCall(orgId, tempDeleteId);
    }
  };

  const addItemUnitApiCall = async (item: ItemUnitFormData, orgId: number) => {
    setAddItemUnitLoading(true);

    const data = {
      org_id: orgId,
      unit_name: item.unitName,
    };

    try {
      const res: ApiResponse = await addItemUnitAPI(data);

      if (res.status === 200) {
        form.reset();
        setIsOpen(false);
        getItemUnitApiCall(orgId);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddItemUnitLoading(false);
    }
  };

  const updateItemUnitApiCall = async (
    unitId: number,
    item: ItemUnitFormData,
    orgId: number
  ) => {
    let data = {
      org_id: orgId,
      unit_id: unitId,
      unit_name: item.unitName,
    };
    setUpdateItemUnitLoading(true);
    try {
      const res = await updateItemUnitAPI(data);
      if (res.status === 200) {
        toast.success(res.data.message);
        form.reset();
        getItemUnitApiCall(orgId);
        setIsOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdateItemUnitLoading(false);
    }
  };

  const getItemUnitApiCall = async (orgId: number) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getItemUnitAPI(orgId);

      if (res.status === 200) {
        dispatch(getItemUnitData(res.data.details));
        setTotalCount(resolveListTotalCount(res.data.details));
      } else {
        dispatch(getItemUnitData([]));
        setTotalCount(0);
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getItemUnitData([]));
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const deleteItemUnitApiCall = async (
    orgId: number,
    unitId: number) => {
    setDeleteItemUnitLoading(true);

    const data = {
      org_id: orgId,
      unit_id: unitId,
    };

    try {
      const res: ApiResponse = await deleteItemUnitAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        setShowDeleteDialog(false);
        setTempDeleteId(null);
        setDeleteWarning(null);
        getItemUnitApiCall(orgId);
      } else if (isMasterDeleteDependencyResponse(res)) {
        setDeleteWarning(getMasterDeleteWarningMessage(res));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteItemUnitLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        unitName: editData.Unit_Name || "",
      });
    } else {
      form.reset({ unitName: "" });
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
    getItemUnitApiCall,
    addItemUnitLoading,
    updateItemUnitLoading,
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
    handleDeleteItemUnit,
    deleteItemUnitLoading,
    deleteWarning,
  };
};
