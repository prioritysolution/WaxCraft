import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";

import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import {
  ItemSizeFormData,
  ItemSizeTableData,
} from "@/types/master/ItemSizeTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { getItemSizeData } from "./ItemSizeReducer";
import {
  addItemSizeAPI,
  deleteItemSizeAPI,
  getItemSizeAPI,
  getItemSizeUnderModelAPI,
  updateItemSizeAPI,
} from "./ItemSizeApis";
import {
  getMasterDeleteWarningMessage,
  isMasterDeleteDependencyResponse,
} from "@/lib/masterDelete";
import { resolveListTotalCount } from "@/lib/listTotalCount";

export const useItemSize = () => {
  const dispatch = useDispatch();

  const [addItemSizeLoading, setAddItemSizeLoading] = useState(false);
  const [updateItemSizeLoading, setUpdateItemSizeLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);

  const [categoryInput, setCategoryInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<ItemSizeTableData | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);
  const [deleteItemSizeLoading, setDeleteItemSizeLoading] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    categoryId: yup.string().required("Category is required"),
    modelId: yup.string().required("Model is required"),
    size: yup.string().required("Size is required"),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<ItemSizeFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      categoryId: "",
      modelId: "",
      size: "",
    },
  });

  const { categoryId } = form.watch();

  // Handle form submission
  const handleSubmit: SubmitHandler<ItemSizeFormData> = (values) => {
    if (orgId) {
      if (editData && Object.keys(editData).length > 0) {
        updateItemSizeApiCall(editData.Id, values, orgId);
      } else {
        addItemSizeApiCall(values, orgId);
      }
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const handleEditData = (data: ItemSizeTableData) => {
    setEditData(data);
    setIsOpen(true);
  };

  const handleShowDeleteDialog = (id: number) => {
    setTempDeleteId(id);
    setDeleteWarning(null);
    setShowDeleteDialog(true);
  };

  const handleDeleteItemSize = () => {
    if (orgId && tempDeleteId) {
      deleteItemSizeApiCall(orgId, tempDeleteId);
    }
  };

  const addItemSizeApiCall = async (item: ItemSizeFormData, orgId: number) => {
    setAddItemSizeLoading(true);

    const data = {
      org_id: orgId,
      cat_id: item.categoryId,
      model_Id: item.modelId,
      size_name: item.size,
    };

    try {
      const res: ApiResponse = await addItemSizeAPI(data);

      if (res.status === 200) {
        form.reset();
        setCategoryInput("");
        setIsOpen(false);
        setCurrentPage(1);
        getItemSizeApiCall(orgId, 1);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddItemSizeLoading(false);
    }
  };

  const updateItemSizeApiCall = async (
    sizeId: number,
    item: ItemSizeFormData,
    orgId: number
  ) => {
    let data = {
      org_id: orgId,
      size_id: sizeId,
      cat_id: item.categoryId,
      model_Id: item.modelId,
      size_name: item.size,
    };
    setUpdateItemSizeLoading(true);
    try {
      const res = await updateItemSizeAPI(data);
      if (res.status === 200) {
        toast.success(res.data.message);
        form.reset();
        setCategoryInput("");
        setCurrentPage(1);
        getItemSizeApiCall(orgId, 1);
        setIsOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdateItemSizeLoading(false);
    }
  };

  const getItemSizeApiCall = async (orgId: number, page: number) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getItemSizeAPI(orgId, page);

      if (res.status === 200) {
        dispatch(getItemSizeData(res.data.details?.data));
        setLastPage(res.data.details?.last_page);
        setTotalCount(resolveListTotalCount(res.data.details));
      } else {
        dispatch(getItemSizeData([]));
        setTotalCount(0);
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getItemSizeData([]));
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const getItemSizeUnderModelApiCall = async (orgId: number, modId: string) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getItemSizeUnderModelAPI(orgId, modId);

      if (res.status === 200) {
        dispatch(getItemSizeData(res.data.details));
      } else {
        dispatch(getItemSizeData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getItemSizeData([]));
    } finally {
      setLoading(false);
    }
  };

  const deleteItemSizeApiCall = async (
    orgId: number,
    sizeId: number) => {
    setDeleteItemSizeLoading(true);

    const data = {
      org_id: orgId,
      size_id: sizeId,
    };

    try {
      const res: ApiResponse = await deleteItemSizeAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        setShowDeleteDialog(false);
        setTempDeleteId(null);
        setDeleteWarning(null);
        setCurrentPage(1);
        getItemSizeApiCall(orgId, 1);
      } else if (isMasterDeleteDependencyResponse(res)) {
        setDeleteWarning(getMasterDeleteWarningMessage(res));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteItemSizeLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        categoryId: editData.Cat_Id.toString() || "",
        modelId: editData.Mod_Id.toString() || "",
        size: editData.Size_Name || "",
      });
      setCategoryInput(editData.Cat_Name || "");
    } else {
      form.reset({ categoryId: "", modelId: "", size: "" });
      setCategoryInput("");
    }
  }, [editData, form.reset]);

  useEffect(() => {
    if (editData && !isOpen) {
      setEditData(null);
    }
  }, [isOpen, editData]);

  useResetFormOnModalClose(isOpen, () => {
    form.reset();
    setCategoryInput("");
  });

  return {
    getItemSizeApiCall,
    getItemSizeUnderModelApiCall,
    addItemSizeLoading,
    updateItemSizeLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    categoryId,
    currentPage,
    setCurrentPage,
    lastPage,
    totalCount,
    categoryInput,
    setCategoryInput,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteItemSize,
    deleteItemSizeLoading,
    deleteWarning,
  };
};
