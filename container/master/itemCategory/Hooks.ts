import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";

import getCookieData from "@/utils/getCookieData";
import { useDispatch, useSelector } from "react-redux";
import {
  ItemCategoryFormData,
  ItemCategoryTableData,
} from "@/types/master/ItemCategoryTypes";
import { ApiResponse } from "@/types/ApiTypes";
import {
  addItemCategoryAPI,
  deleteItemCategoryAPI,
  getItemCategoryAPI,
  updateItemCategoryAPI,
} from "./ItemCategoryApis";
import { getItemCategoryData } from "./ItemCategoryReducer";
import {
  getMasterDeleteWarningMessage,
  isMasterDeleteDependencyResponse,
} from "@/lib/masterDelete";
import { resolveListTotalCount } from "@/lib/listTotalCount";

interface ItemCategoryState {
  itemCategoryData: ItemCategoryTableData[];
}

interface RootState {
  itemCategory: ItemCategoryState;
}

export const useItemCategory = () => {
  const dispatch = useDispatch();

  const [addItemCategoryLoading, setAddItemCategoryLoading] = useState(false);
  const [updateItemCategoryLoading, setUpdateItemCategoryLoading] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [input, setInput] = useState("");

  const [orgId, setOrgId] = useState<number | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<ItemCategoryTableData | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);
  const [deleteItemCategoryLoading, setDeleteItemCategoryLoading] =
    useState(false);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  const itemCategoryData: ItemCategoryTableData[] = useSelector(
    (state: RootState) => state?.itemCategory?.itemCategoryData
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    categoryName: yup.string().required("Category name is required"),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<ItemCategoryFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      categoryName: "",
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<ItemCategoryFormData> = (values) => {
    if (orgId) {
      if (editData && Object.keys(editData).length > 0) {
        updateItemCategoryApiCall(editData.Id, values, orgId);
      } else {
        addItemCategoryApiCall(values, orgId);
      }
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const handleEditData = (data: ItemCategoryTableData) => {
    setEditData(data);
    setIsOpen(true);
  };

  const handleShowDeleteDialog = (id: number) => {
    setTempDeleteId(id);
    setDeleteWarning(null);
    setShowDeleteDialog(true);
  };

  const handleDeleteItemCategory = () => {
    if (orgId && tempDeleteId) {
      deleteItemCategoryApiCall(orgId, tempDeleteId);
    }
  };

  // Function to call the login API
  const addItemCategoryApiCall = async (
    item: ItemCategoryFormData,
    orgId: number
  ) => {
    setAddItemCategoryLoading(true);

    const data = {
      org_id: orgId,
      cat_name: item.categoryName,
    };

    try {
      const res: ApiResponse = await addItemCategoryAPI(data);

      if (res.status === 200) {
        form.reset();
        setIsOpen(false);
        setCurrentPage(1);
        getItemCategoryApiCall(orgId, 1, "", "TABLE");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddItemCategoryLoading(false);
    }
  };

  const updateItemCategoryApiCall = async (
    categoryId: number,
    item: ItemCategoryFormData,
    orgId: number
  ) => {
    let data = {
      org_id: orgId,
      cat_id: categoryId,
      cat_name: item.categoryName,
    };
    setUpdateItemCategoryLoading(true);
    try {
      const res = await updateItemCategoryAPI(data);
      if (res.status === 200) {
        toast.success(res.data.message);
        form.reset();
        setCurrentPage(1);
        getItemCategoryApiCall(orgId, 1, "", "TABLE");
        setIsOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdateItemCategoryLoading(false);
    }
  };

  // Function to call the login API
  const getItemCategoryApiCall = async (
    orgId: number,
    page: number,
    keyword: string,
    type: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getItemCategoryAPI(orgId, page, keyword);

      if (res.status === 200) {
        const newData =
          type === "TABLE" || page === 1
            ? res.data.details?.data
            : [...itemCategoryData, ...res.data.details?.data];
        dispatch(getItemCategoryData(newData));
        setLastPage(res.data.details?.last_page);
        if (type === "TABLE" && !keyword) {
          setTotalCount(resolveListTotalCount(res.data.details));
        }
      } else {
        dispatch(getItemCategoryData([]));
        if (type === "TABLE" && !keyword) {
          setTotalCount(0);
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getItemCategoryData([]));
      if (type === "TABLE" && !keyword) {
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteItemCategoryApiCall = async (
    orgId: number,
    categoryId: number) => {
    setDeleteItemCategoryLoading(true);

    const data = {
      org_id: orgId,
      cat_id: categoryId,
    };

    try {
      const res: ApiResponse = await deleteItemCategoryAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        setShowDeleteDialog(false);
        setTempDeleteId(null);
        setDeleteWarning(null);
        setCurrentPage(1);
        getItemCategoryApiCall(orgId, 1, "", "TABLE");
      } else if (isMasterDeleteDependencyResponse(res)) {
        setDeleteWarning(getMasterDeleteWarningMessage(res));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteItemCategoryLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        categoryName: editData.Cat_Name || "",
      });
    } else {
      form.reset({ categoryName: "" });
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
    getItemCategoryApiCall,
    addItemCategoryLoading,
    updateItemCategoryLoading,
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
    input,
    setInput,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteItemCategory,
    deleteItemCategoryLoading,
    deleteWarning,
  };
};
