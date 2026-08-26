import { yupResolver } from "@/lib/yupResolver";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";
import { ApiResponse } from "@/types/ApiTypes";
import {
  ItemColourFormData,
  ItemColourTableData,
} from "@/types/master/ItemColourTypes";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import {
  addItemColourAPI,
  deleteItemColourAPI,
  getItemColourAPI,
  updateItemColourAPI,
} from "./ItemColourApis";
import { getItemColourData } from "./ItemColourReducer";
import {
  getMasterDeleteWarningMessage,
  isMasterDeleteDependencyResponse,
} from "@/lib/masterDelete";
import { resolveListTotalCount } from "@/lib/listTotalCount";

export const useItemColour = () => {
  const dispatch = useDispatch();

  const [addItemColourLoading, setAddItemColourLoading] = useState(false);
  const [updateItemColourLoading, setUpdateItemColourLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [colourTableInput, setColourTableInput] = useState("");

  const [orgId, setOrgId] = useState<number | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<ItemColourTableData | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);
  const [deleteItemColourLoading, setDeleteItemColourLoading] =
    useState(false);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  const formSchema = yup.object({
    colourName: yup.string().required("Colour name is required"),
  });

  const form = useForm<ItemColourFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      colourName: "",
    },
  });

  const handleSubmit: SubmitHandler<ItemColourFormData> = (values) => {
    if (orgId) {
      if (editData && Object.keys(editData).length > 0) {
        updateItemColourApiCall(editData.Id, values, orgId);
      } else {
        addItemColourApiCall(values, orgId);
      }
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const handleEditData = (data: ItemColourTableData) => {
    setEditData(data);
    setIsOpen(true);
  };

  const handleShowDeleteDialog = (id: number) => {
    setTempDeleteId(id);
    setDeleteWarning(null);
    setShowDeleteDialog(true);
  };

  const handleDeleteItemColour = () => {
    if (orgId && tempDeleteId) {
      deleteItemColourApiCall(orgId, tempDeleteId);
    }
  };

  const handleFilterTableData = (value: string) => {
    setColourTableInput(value);
    setCurrentPage(1);
    if (orgId) getItemColourApiCall(orgId, 1, value);
  };

  const addItemColourApiCall = async (
    item: ItemColourFormData,
    orgIdValue: number,
  ) => {
    setAddItemColourLoading(true);

    const data = {
      org_id: orgIdValue,
      color_name: item.colourName,
    };

    try {
      const res: ApiResponse = await addItemColourAPI(data);

      if (res.status === 200) {
        form.reset();
        setIsOpen(false);
        setCurrentPage(1);
        setColourTableInput("");
        getItemColourApiCall(orgIdValue, 1, "");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddItemColourLoading(false);
    }
  };

  const updateItemColourApiCall = async (
    colourId: number,
    item: ItemColourFormData,
    orgIdValue: number,
  ) => {
    const data = {
      org_id: orgIdValue,
      color_id: colourId,
      color_name: item.colourName,
    };

    setUpdateItemColourLoading(true);
    try {
      const res = await updateItemColourAPI(data);
      if (res.status === 200) {
        toast.success(res.data.message);
        form.reset();
        setCurrentPage(1);
        setColourTableInput("");
        getItemColourApiCall(orgIdValue, 1, "");
        setIsOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdateItemColourLoading(false);
    }
  };

  const getItemColourApiCall = async (
    orgIdValue: number,
    page: number,
    keyword: string,
    perPage = 10,
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getItemColourAPI(
        orgIdValue,
        page,
        keyword,
        perPage,
      );

      if (res.status === 200 || res.status === 202) {
        const details = res.data.details;
        const newData = Array.isArray(details)
          ? details
          : Array.isArray(details?.data)
            ? details.data
            : [];
        dispatch(getItemColourData(newData));
        setLastPage(
          Array.isArray(details)
            ? 1
            : Number(details?.last_page) > 0
              ? Number(details.last_page)
              : 1,
        );
        if (!keyword) {
          setTotalCount(resolveListTotalCount(details));
        }
      } else {
        dispatch(getItemColourData([]));
        if (!keyword) {
          setTotalCount(0);
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getItemColourData([]));
      if (!keyword) {
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteItemColourApiCall = async (
    orgIdValue: number,
    colourId: number,
  ) => {
    setDeleteItemColourLoading(true);

    const data = {
      org_id: orgIdValue,
      color_id: colourId,
    };

    try {
      const res: ApiResponse = await deleteItemColourAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        setShowDeleteDialog(false);
        setTempDeleteId(null);
        setDeleteWarning(null);
        setCurrentPage(1);
        setColourTableInput("");
        getItemColourApiCall(orgIdValue, 1, "");
      } else if (isMasterDeleteDependencyResponse(res)) {
        setDeleteWarning(getMasterDeleteWarningMessage(res));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteItemColourLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        colourName: editData.Color_Name || editData.Colour_Name || "",
      });
    } else {
      form.reset({ colourName: "" });
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
    getItemColourApiCall,
    addItemColourLoading,
    updateItemColourLoading,
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
    colourTableInput,
    handleFilterTableData,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteItemColour,
    deleteItemColourLoading,
    deleteWarning,
  };
};
