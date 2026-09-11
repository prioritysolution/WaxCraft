import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";

import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import {
  SizeColourFormData,
  SizeColourTableData,
} from "@/types/master/SizeColourTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { getSizeColourData } from "./SizeColourReducer";
import {
  addSizeColourAPI,
  deleteSizeColourAPI,
  getColourUnderSizeAPI,
  getSizeColourAPI,
  updateSizeColourAPI,
} from "./SizeColourApis";
import { getItemColourAPI } from "../itemColour/ItemColourApis";
import {
  getMasterDeleteWarningMessage,
  isMasterDeleteDependencyResponse,
} from "@/lib/masterDelete";
import { resolveListTotalCount } from "@/lib/listTotalCount";
import { useListPerPage } from "@/lib/useListPerPage";

type ColourOption = {
  Id: string | number;
  Color_Name?: string;
  Colour_Name?: string;
};

const normalizeColourList = (payload: unknown): ColourOption[] => {
  const rawList = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { data?: unknown })?.data)
      ? ((payload as { data: unknown[] }).data)
      : [];

  return rawList
    .map((item: any) => ({
      ...item,
      Id: item?.Id ?? item?.Color_Id ?? item?.color_id ?? item?.Colour_Id,
      Color_Name:
        item?.Color_Name || item?.Colour_Name || item?.color_name || "",
    }))
    .filter((item) => item.Id != null && String(item.Id) !== "");
};

const resolveColourId = (
  row: SizeColourTableData | null,
  options: ColourOption[],
): string => {
  if (!row || !options.length) return "";

  const storedId = row.Color_Id ?? row.Colour_Id;
  const storedValue = String(row.Color_Name ?? row.Colour_Name ?? "").trim();

  if (storedId != null && String(storedId) !== "") {
    const byStoredId = options.find(
      (option) => String(option.Id) === String(storedId),
    );
    if (byStoredId) return String(byStoredId.Id);
  }

  if (storedValue) {
    const byId = options.find((option) => String(option.Id) === storedValue);
    if (byId) return String(byId.Id);

    const byName = options.find((option) => {
      const optionName = String(
        option.Color_Name || option.Colour_Name || "",
      ).trim();
      return optionName.toLowerCase() === storedValue.toLowerCase();
    });

    if (byName) return String(byName.Id);
  }

  return "";
};

export const useSizeColour = () => {
  const dispatch = useDispatch();

  const [addSizeColourLoading, setAddSizeColourLoading] = useState(false);
  const [updateSizeColourLoading, setUpdateSizeColourLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);

  const [categoryInput, setCategoryInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { perPage, handlePerPageChange } = useListPerPage(() =>
    setCurrentPage(1),
  );
  const [totalCount, setTotalCount] = useState(0);
  const [sizeColourTableInput, setSizeColourTableInput] = useState("");
  const [colourOptions, setColourOptions] = useState<ColourOption[]>([]);
  const [getColourLoading, setGetColourLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<SizeColourTableData | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);
  const [deleteSizeColourLoading, setDeleteSizeColourLoading] =
    useState(false);
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
    sizeId: yup.string().required("Size is required"),
    colourId: yup.string().required("Colour is required"),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<SizeColourFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      categoryId: "",
      modelId: "",
      sizeId: "",
      colourId: "",
    },
  });

  const { categoryId, modelId } = form.watch();

  // Handle form submission
  const handleSubmit: SubmitHandler<SizeColourFormData> = (values) => {
    if (orgId) {
      if (editData && Object.keys(editData).length > 0) {
        updateSizeColourApiCall(editData.Id, values, orgId);
      } else {
        addSizeColourApiCall(values, orgId);
      }
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const handleEditData = (data: SizeColourTableData) => {
    setEditData(data);
    setIsOpen(true);
  };

  const handleShowDeleteDialog = (id: number) => {
    setTempDeleteId(id);
    setDeleteWarning(null);
    setShowDeleteDialog(true);
  };

  const handleDeleteSizeColour = () => {
    if (orgId && tempDeleteId) {
      deleteSizeColourApiCall(orgId, tempDeleteId);
    }
  };

  const handleFilterTableData = (value: string) => {
    setSizeColourTableInput(value);
    setCurrentPage(1);
    if (orgId) getSizeColourApiCall(orgId, 1, value);
  };

  const addSizeColourApiCall = async (
    item: SizeColourFormData,
    orgId: number
  ) => {
    setAddSizeColourLoading(true);

    const data = {
      org_id: orgId,
      cat_id: item.categoryId,
      mod_id: item.modelId,
      size_id: item.sizeId,
      color_name: item.colourId,
    };

    try {
      const res: ApiResponse = await addSizeColourAPI(data);

      if (res.status === 200) {
        form.reset();
        setCategoryInput("");
        setIsOpen(false);
        setCurrentPage(1);
        setSizeColourTableInput("");
        getSizeColourApiCall(orgId, 1, "");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddSizeColourLoading(false);
    }
  };

  const updateSizeColourApiCall = async (
    colourId: number,
    item: SizeColourFormData,
    orgId: number
  ) => {
    let data = {
      org_id: orgId,
      col_id: colourId,
      cat_id: item.categoryId,
      mod_id: item.modelId,
      size_id: item.sizeId,
      color_name: item.colourId,
    };
    setUpdateSizeColourLoading(true);
    try {
      const res = await updateSizeColourAPI(data);
      if (res.status === 200) {
        toast.success(res.data.message);
        form.reset();
        setCategoryInput("");
        setCurrentPage(1);
        setSizeColourTableInput("");
        getSizeColourApiCall(orgId, 1, "");
        setIsOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdateSizeColourLoading(false);
    }
  };

  const getSizeColourApiCall = async (
    orgId: number,
    page: number,
    keyword: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getSizeColourAPI(
        orgId,
        page,
        keyword,
        perPage,
      );

      if (res.status === 200) {
        const newData = res.data.details?.data;
        dispatch(getSizeColourData(newData));
        setLastPage(res.data.details?.last_page);
        if (!keyword) {
          setTotalCount(resolveListTotalCount(res.data.details));
        }
      } else {
        dispatch(getSizeColourData([]));
        if (!keyword) {
          setTotalCount(0);
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getSizeColourData([]));
      if (!keyword) {
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const getItemColourListApiCall = async (orgId: number) => {
    setGetColourLoading(true);
    try {
      const res: ApiResponse = await getItemColourAPI(orgId, 1, "", 500);
      if (res.status === 200) {
        setColourOptions(normalizeColourList(res.data.details));
      } else {
        setColourOptions([]);
      }
    } catch (error) {
      setColourOptions([]);
    } finally {
      setGetColourLoading(false);
    }
  };

  const getColourUnderSizeApiCall = async (orgId: number, sizeId: string) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getColourUnderSizeAPI(orgId, sizeId);

      if (res.status === 200) {
        dispatch(getSizeColourData(res.data.details));
      } else {
        dispatch(getSizeColourData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getSizeColourData([]));
    } finally {
      setLoading(false);
    }
  };

  const deleteSizeColourApiCall = async (
    orgId: number,
    colourId: number) => {
    setDeleteSizeColourLoading(true);

    const data = {
      org_id: orgId,
      col_id: colourId,
    };

    try {
      const res: ApiResponse = await deleteSizeColourAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        setShowDeleteDialog(false);
        setTempDeleteId(null);
        setDeleteWarning(null);
        setCurrentPage(1);
        setSizeColourTableInput("");
        getSizeColourApiCall(orgId, 1, "");
      } else if (isMasterDeleteDependencyResponse(res)) {
        setDeleteWarning(getMasterDeleteWarningMessage(res));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteSizeColourLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        categoryId: editData.Cat_Id.toString() || "",
        modelId: editData.Mod_Id.toString() || "",
        sizeId: editData.Size_Id.toString() || "",
        colourId: resolveColourId(editData, colourOptions),
      });
      setCategoryInput(editData.Cat_Name || "");
      return;
    }

    form.reset({ categoryId: "", modelId: "", sizeId: "", colourId: "" });
    setCategoryInput("");
  }, [editData, form.reset]);

  useEffect(() => {
    if (!editData || Object.keys(editData).length === 0) return;

    const colourId = resolveColourId(editData, colourOptions);
    if (colourId) {
      form.setValue("colourId", colourId, { shouldValidate: false });
    }
  }, [editData, colourOptions, form]);

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
    getSizeColourApiCall,
    getColourUnderSizeApiCall,
    getItemColourListApiCall,
    addSizeColourLoading,
    updateSizeColourLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    categoryId,
    modelId,
    categoryInput,
    setCategoryInput,
    colourOptions,
    getColourLoading,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    totalCount,
    sizeColourTableInput,
    handleFilterTableData,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteSizeColour,
    deleteSizeColourLoading,
    deleteWarning,
  };
};
