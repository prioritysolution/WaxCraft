import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";
import getCookieData from "@/utils/getCookieData";
import { useDispatch, useSelector } from "react-redux";
import { DesignFormData, DesignTableData } from "@/types/master/DesignTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { getDesignData } from "./DesignReducer";
import { addDesignAPI, deleteDesignAPI, getDesignAPI, updateDesignAPI } from "./DesignApis";
import { ItemTableData } from "@/types/master/ItemTypes";
import { decimalRegex } from "@/utils/validationRegex";
import { toTwoDecimalString } from "@/utils/formatDecimal";
import {
  getMasterDeleteWarningMessage,
  isMasterDeleteDependencyResponse,
} from "@/lib/masterDelete";
import { resolveListTotalCount } from "@/lib/listTotalCount";
import { useListPerPage } from "@/lib/useListPerPage";

interface ItemState {
  itemData: ItemTableData[];
}

interface RootState {
  item: ItemState;
}

const DESIGN_LIST_PER_PAGE = 50;

const DESIGN_IMAGE_MAX_BYTES = 2 * 1024 * 1024;
const DESIGN_IMAGE_ALLOWED_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
];
const DESIGN_IMAGE_ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
];

const validateDesignImageFile = (file: File): string | null => {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const isAllowedType =
    DESIGN_IMAGE_ALLOWED_MIME_TYPES.includes(file.type) ||
    DESIGN_IMAGE_ALLOWED_EXTENSIONS.includes(extension);

  if (!isAllowedType) {
    return "Only PNG, JPG, JPEG, WEBP, and GIF files are allowed";
  }

  if (file.size > DESIGN_IMAGE_MAX_BYTES) {
    return "Image size must be 2 MB or less";
  }

  return null;
};

const toScalarString = (value: unknown): string => {
  if (value == null || value === "") return "";

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;

    if ("wt_rate" in record) return toScalarString(record.wt_rate);
    if ("Wt_Rate" in record) return toScalarString(record.Wt_Rate);

    const firstValue = Object.values(record)[0];
    return toScalarString(firstValue);
  }

  return String(value);
};

const toToastMessage = (
  message: unknown,
  fallback = "Something went wrong",
): string => {
  if (typeof message === "string" && message.trim()) return message;
  if (typeof message === "number") return String(message);

  if (Array.isArray(message)) {
    const text = message
      .map((item) => toToastMessage(item, ""))
      .filter(Boolean)
      .join(", ");
    return text || fallback;
  }

  if (message && typeof message === "object") {
    const text = Object.values(message as Record<string, unknown>)
      .map((item) => toToastMessage(item, ""))
      .filter(Boolean)
      .join(", ");
    return text || fallback;
  }

  return fallback;
};

export const useDesign = () => {
  const dispatch = useDispatch();

  const [addDesignLoading, setAddDesignLoading] = useState(false);
  const [updateDesignLoading, setUpdateDesignLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);

  const [categoryInput, setCategoryInput] = useState("");
  const [itemInput, setItemInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { perPage, handlePerPageChange } = useListPerPage(
    () => setCurrentPage(1),
    DESIGN_LIST_PER_PAGE,
  );
  const [totalCount, setTotalCount] = useState(0);

  const [designTableInput, setDesignTableInput] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<DesignTableData | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);
  const [deleteDesignLoading, setDeleteDesignLoading] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  const [designFormTableData, setDesignFormTableData] = useState<any[]>([]);

  const [photoPreview, setPhotoPreview] = useState<string | undefined>();

  const itemData: ItemTableData[] = useSelector(
    (state: RootState) => state?.item?.itemData,
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  const formSchema = yup.object({
    designName: yup.string().required("Design name is required"),
    designNo: yup.string().required("Design no is required"),
    wt: yup.string().required("WT is required"),
    wtRate: yup
      .string()
      .required("WT rate is required")
      .test("is-valid-number", "Invalid WT rate", (value) => {
        if (!value) return false;
        return decimalRegex.test(value);
      }),
    polish: yup.string().required("Polish is required"),
    designImage: yup
      .mixed()
      .default("")
      .test("required", "Design image is required", function (value) {
        if (value instanceof File) return true;
        if (typeof value === "string" && value.trim() !== "") return true;
        return false;
      })
      .test("design-image", function (value) {
        if (!(value instanceof File)) return true;

        const error = validateDesignImageFile(value);
        if (error) {
          return this.createError({ message: error });
        }

        return true;
      }),
    categoryId: yup.string().required("Category is required"),
    itemId: yup.string().required("Item is required"),
    quantity: yup.string().required("Quantity is required"),
    makingRate: yup
      .string()
      .required("Making rate is required")
      .test("is-valid-number", "Invalid making rate", (value) => {
        if (!value) return false;
        return decimalRegex.test(value);
      }),
  });

  // Initialize the form
  const form = useForm<DesignFormData>({
    resolver: yupResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      designName: "",
      designNo: "",
      wt: "",
      wtRate: "",
      polish: "",
      designImage: "",
      categoryId: "",
      itemId: "",
      quantity: "",
      makingRate: "",
    },
  });

  const { categoryId } = form.watch();

  // Handle form submission
  const handleSubmit: SubmitHandler<DesignFormData> = (values) => {
    const newDesignFormTableData = {
      itemId: values.itemId,
      itemName: itemData.find((item) => item.Id.toString() === values.itemId)
        ?.Item_Name,
      quantity: values.quantity,
      makingRate: toTwoDecimalString(values.makingRate),
    };

    setDesignFormTableData([...designFormTableData, newDesignFormTableData]);

    form.reset({
      designName: values.designName,
      designNo: values.designNo,
      wt: toTwoDecimalString(values.wt),
      wtRate: toTwoDecimalString(values.wtRate),
      polish: toTwoDecimalString(values.polish),
      designImage: values.designImage,
      categoryId: "",
      itemId: "",
      quantity: "",
      makingRate: "",
    });
    setCategoryInput("");
    setItemInput("");
  };

  const handleFilterTableData = (value: string) => {
    setDesignTableInput(value);
    setCurrentPage(1);
    if (orgId) getDesignApiCall(orgId, 1, value);
  };

  const handleAddDesign = () => {
    if (orgId) {
      if (designFormTableData.length > 0) {
        if (editData && Object.keys(editData).length > 0) {
          updateDesignApiCall(editData.Id, orgId);
        } else {
          addDesignApiCall(orgId);
        }
      } else {
        toast.error("Add atleast one value in table");
      }
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const handleDeleteFormTableData = (id: number) => {
    const newFormTableData = designFormTableData.filter((_, i) => id !== i);
    setDesignFormTableData(newFormTableData);
  };

  const handleEditData = (data: DesignTableData) => {
    setEditData(data);
    setIsOpen(true);
  };

  const handleShowDeleteDialog = (id: number) => {
    setTempDeleteId(id);
    setDeleteWarning(null);
    setShowDeleteDialog(true);
  };

  const handleDeleteDesign = () => {
    if (orgId && tempDeleteId) {
      deleteDesignApiCall(orgId, tempDeleteId);
    }
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const validationError = validateDesignImageFile(file);
    if (validationError) {
      toast.error(validationError);
      e.target.value = "";
      form.setValue(
        "designImage",
        editData?.File_Name ? editData.File_Name : "",
      );
      form.setError("designImage", { message: validationError });
      setPhotoPreview(editData?.image || undefined);
      return;
    }

    form.clearErrors("designImage");
    form.setValue("designImage", file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
  };

  const addDesignApiCall = async (orgId: number) => {
    setAddDesignLoading(true);

    const formData = new FormData();

    // Append non-file fields to FormData
    formData.append("org_id", orgId.toString());
    formData.append("design_name", toScalarString(form.getValues("designName")));
    formData.append("design_no", toScalarString(form.getValues("designNo")));
    formData.append("wt", toTwoDecimalString(form.getValues("wt")));
    formData.append("wt_rate", toTwoDecimalString(form.getValues("wtRate")));
    formData.append("polish", toTwoDecimalString(form.getValues("polish")));

    const designImage = form.getValues("designImage");
    if (designImage instanceof File) {
      formData.append("deg_img", designImage);
    } else if (designImage) {
      formData.append("deg_img", designImage);
    }

    // Append design_array (complex object) as JSON string
    const designArray = designFormTableData.map((data) => ({
      item_id: String(data.itemId ?? ""),
      qnty: String(data.quantity ?? ""),
      making_rate: toTwoDecimalString(data.makingRate),
    }));
    formData.append("design_array", JSON.stringify(designArray));

    try {
      const res: ApiResponse = await addDesignAPI(formData);

      if (res.status === 200) {
        form.reset({
          designName: "",
          designNo: "",
          wt: "",
          wtRate: "",
          polish: "",
          designImage: "",
          categoryId: "",
          itemId: "",
          quantity: "",
          makingRate: "",
        });
        setIsOpen(false);
        setCurrentPage(1);
        setCategoryInput("");
        setDesignTableInput("");
        getDesignApiCall(orgId, 1, "");
        setDesignFormTableData([]);
        setPhotoPreview(undefined);
        toast.success(toToastMessage(res.data.message, "Design added successfully"));
      } else {
        toast.error(toToastMessage(res.data.message));
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddDesignLoading(false);
    }
  };

  const updateDesignApiCall = async (designId: number, orgId: number) => {
    const formData = new FormData();

    // Append non-file fields to FormData
    formData.append("org_id", orgId.toString());
    formData.append("design_id", designId.toString());
    formData.append("design_name", toScalarString(form.getValues("designName")));
    formData.append("design_no", toScalarString(form.getValues("designNo")));
    formData.append("wt", toTwoDecimalString(form.getValues("wt")));
    formData.append("wt_rate", toTwoDecimalString(form.getValues("wtRate")));
    formData.append("polish", toTwoDecimalString(form.getValues("polish")));

    const designImage = form.getValues("designImage");
    if (designImage instanceof File) {
      formData.append("deg_img", designImage);
    } else if (designImage) {
      formData.append("deg_img", designImage);
    }

    // Append design_array (complex object) as JSON string
    const designArray = designFormTableData.map((data) => ({
      item_id: String(data.itemId ?? ""),
      qnty: String(data.quantity ?? ""),
      making_rate: toTwoDecimalString(data.makingRate),
    }));
    formData.append("design_array", JSON.stringify(designArray));

    setUpdateDesignLoading(true);
    try {
      const res = await updateDesignAPI(formData);
      if (res.status === 200) {
        toast.success(toToastMessage(res.data.message, "Design updated successfully"));
        form.reset();
        setCurrentPage(1);
        setCategoryInput("");
        setDesignTableInput("");
        getDesignApiCall(orgId, 1, "");
        setIsOpen(false);
        setPhotoPreview(undefined);
        setDesignFormTableData([]);
      } else {
        toast.error(toToastMessage(res.data.message));
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdateDesignLoading(false);
    }
  };

  const getDesignApiCall = async (
    orgId: number,
    page: number,
    keyword: string,
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getDesignAPI(
        orgId,
        page,
        keyword,
        perPage,
      );

      if (res.status === 200) {
        const details = res.data.details;
        const rows = Array.isArray(details)
          ? details
          : Array.isArray(details?.data)
            ? details.data
            : [];

        dispatch(getDesignData(rows));
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
        dispatch(getDesignData([]));
        setLastPage(1);
        if (!keyword) {
          setTotalCount(0);
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getDesignData([]));
      setLastPage(1);
      if (!keyword) {
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteDesignApiCall = async (
    orgId: number,
    designId: number,
  ) => {
    setDeleteDesignLoading(true);

    const data = {
      org_id: orgId,
      design_id: designId,
    };

    try {
      const res: ApiResponse = await deleteDesignAPI(data);

      if (res.status === 200) {
        toast.success(toToastMessage(res.data.message, "Design deleted successfully"));
        setShowDeleteDialog(false);
        setTempDeleteId(null);
        setDeleteWarning(null);
        setCurrentPage(1);
        setDesignTableInput("");
        getDesignApiCall(orgId, 1, "");
      } else if (isMasterDeleteDependencyResponse(res)) {
        setDeleteWarning(getMasterDeleteWarningMessage(res));
      } else {
        toast.error(toToastMessage(res.data.message));
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteDesignLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      const editRecord = editData as DesignTableData & {
        wt_rate?: unknown;
      };

      form.reset({
        designName: toScalarString(editData.Design_Name),
        designNo: toScalarString(editData.Design_No),
        wt: toTwoDecimalString(editData.WT),
        wtRate: toTwoDecimalString(editData.Wt_Rate ?? editRecord.wt_rate),
        polish: toTwoDecimalString(editData.Polish),
        designImage: editData.File_Name || editData.image || "",
        categoryId: "",
        itemId: "",
        quantity: "",
        makingRate: "",
      });
      setDesignFormTableData(
        (editData.childrow || []).map((child) => ({
          itemId: String(child.Item_Id ?? ""),
          itemName: toScalarString(child.Item_Name || child.Item_Sh_Name),
          quantity: toScalarString(child.Qnty),
          makingRate: toTwoDecimalString(child.Making_Rate),
        })),
      );
      setPhotoPreview(editData.image);
    } else {
      form.reset({
        designName: "",
        designNo: "",
        wt: "",
        wtRate: "",
        polish: "",
        designImage: undefined,
      });
      setPhotoPreview("");
      setDesignFormTableData([]);
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
    setItemInput("");
    setPhotoPreview("");
    setDesignFormTableData([]);
  });

  return {
    getDesignApiCall,
    addDesignLoading,
    updateDesignLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    handleDeleteFormTableData,
    designFormTableData,
    categoryId,
    handleAddDesign,
    photoPreview,
    handlePhotoChange,
    designTableInput,
    handleFilterTableData,
    currentPage,
    setCurrentPage,
    lastPage,
    totalCount,
    perPage,
    handlePerPageChange,
    categoryInput,
    setCategoryInput,
    itemInput,
    setItemInput,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteDesign,
    deleteDesignLoading,
    deleteWarning,
  };
};
