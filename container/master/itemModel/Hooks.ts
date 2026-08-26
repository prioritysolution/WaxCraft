import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";

import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import {
  ItemModelFormData,
  ItemModelTableData,
} from "@/types/master/ItemModelTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { getItemModelData } from "./ItemModelReducer";
import {
  addItemModelAPI,
  deleteItemModelAPI,
  getItemModelAPI,
  getItemModelUnderCategoryAPI,
  updateItemModelAPI,
} from "./ItemModelApis";
import {
  getMasterDeleteWarningMessage,
  isMasterDeleteDependencyResponse,
} from "@/lib/masterDelete";
import { resolveListTotalCount } from "@/lib/listTotalCount";

export const useItemModel = () => {
  const dispatch = useDispatch();

  const [addItemModelLoading, setAddItemModelLoading] = useState(false);
  const [updateItemModelLoading, setUpdateItemModelLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);

  const [categoryInput, setCategoryInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<ItemModelTableData | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);
  const [deleteItemModelLoading, setDeleteItemModelLoading] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    categoryId: yup.string().required("Category is required"),
    modelName: yup.string().required("Model name is required"),
    modelShortName: yup.string().required("Model short name is required"),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<ItemModelFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      categoryId: "",
      modelName: "",
      modelShortName: "",
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<ItemModelFormData> = (values) => {
    if (orgId) {
      if (editData && Object.keys(editData).length > 0) {
        updateItemModelApiCall(editData.Id, values, orgId);
      } else {
        addItemModelApiCall(values, orgId);
      }
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const handleEditData = (data: ItemModelTableData) => {
    setEditData(data);
    setIsOpen(true);
  };

  const handleShowDeleteDialog = (id: number) => {
    setTempDeleteId(id);
    setDeleteWarning(null);
    setShowDeleteDialog(true);
  };

  const handleDeleteItemModel = () => {
    if (orgId && tempDeleteId) {
      deleteItemModelApiCall(orgId, tempDeleteId);
    }
  };

  const addItemModelApiCall = async (
    item: ItemModelFormData,
    orgId: number
  ) => {
    setAddItemModelLoading(true);

    const data = {
      org_id: orgId,
      cat_id: item.categoryId,
      model_name: item.modelName,
      model_sh_name: item.modelShortName,
    };

    try {
      const res: ApiResponse = await addItemModelAPI(data);

      if (res.status === 200) {
        form.reset();
        setIsOpen(false);
        setCategoryInput("");
        setCurrentPage(1);
        getItemModelApiCall(orgId, 1);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddItemModelLoading(false);
    }
  };

  const updateItemModelApiCall = async (
    modelId: number,
    item: ItemModelFormData,
    orgId: number
  ) => {
    let data = {
      org_id: orgId,
      model_Id: modelId,
      cat_id: item.categoryId,
      model_name: item.modelName,
      model_sh_name: item.modelShortName,
    };
    setUpdateItemModelLoading(true);
    try {
      const res = await updateItemModelAPI(data);
      if (res.status === 200) {
        toast.success(res.data.message);
        form.reset();
        setCategoryInput("");
        setCurrentPage(1);
        getItemModelApiCall(orgId, 1);
        setIsOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdateItemModelLoading(false);
    }
  };

  const getItemModelApiCall = async (orgId: number, page: number) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getItemModelAPI(orgId, page);

      if (res.status === 200) {
        dispatch(getItemModelData(res.data.details?.data));
        setLastPage(res.data.details?.last_page);
        setTotalCount(resolveListTotalCount(res.data.details));
      } else {
        dispatch(getItemModelData([]));
        setTotalCount(0);
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getItemModelData([]));
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const getItemModelUnderCategoryApiCall = async (
    orgId: number,
    catId: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getItemModelUnderCategoryAPI(orgId, catId);

      if (res.status === 200) {
        // page === 1
        // ? res.data.details?.data
        // : [...itemModelData, ...res.data.details?.data];
        dispatch(getItemModelData(res.data.details));
      } else {
        dispatch(getItemModelData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getItemModelData([]));
    } finally {
      setLoading(false);
    }
  };

  const deleteItemModelApiCall = async (
    orgId: number,
    modelId: number) => {
    setDeleteItemModelLoading(true);

    const data = {
      org_id: orgId,
      model_Id: modelId,
    };

    try {
      const res: ApiResponse = await deleteItemModelAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        setShowDeleteDialog(false);
        setTempDeleteId(null);
        setDeleteWarning(null);
        setCurrentPage(1);
        getItemModelApiCall(orgId, 1);
      } else if (isMasterDeleteDependencyResponse(res)) {
        setDeleteWarning(getMasterDeleteWarningMessage(res));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteItemModelLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        categoryId: editData.Cat_Id.toString() || "",
        modelName: editData.Model_Name || "",
        modelShortName: editData.Model_Sh_Name || "",
      });
      setCategoryInput(editData.Cat_Name || "");
    } else {
      form.reset({ categoryId: "", modelName: "", modelShortName: "" });
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
    getItemModelApiCall,
    getItemModelUnderCategoryApiCall,
    addItemModelLoading,
    updateItemModelLoading,
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
    categoryInput,
    setCategoryInput,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteItemModel,
    deleteItemModelLoading,
    deleteWarning,
  };
};
