import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";

import getCookieData from "@/utils/getCookieData";
import { useDispatch, useSelector } from "react-redux";
import { ItemFormData, ItemTableData } from "@/types/master/ItemTypes";
import { ApiResponse } from "@/types/ApiTypes";
import {
  getItemData,
  getPurchaseLedgerData,
  getSalesLedgerData,
} from "./ItemReducer";
import {
  addItemAPI,
  deleteItemAPI,
  getItemAPI,
  getItemUnderCategoryAPI,
  getPurchaseLedgerAPI,
  getSalesLedgerAPI,
  updateItemAPI,
} from "./ItemApis";
import { uptoThreeDigitDecimalRegex } from "@/utils/validationRegex";
import { toTwoDecimalString } from "@/utils/formatDecimal";
import {
  getMasterDeleteWarningMessage,
  isMasterDeleteDependencyResponse,
} from "@/lib/masterDelete";
import { resolveListTotalCount } from "@/lib/listTotalCount";

interface LedgerData {
  Id: number;
  Ledger_Name: string;
}

interface ItemState {
  itemData: ItemTableData[];
  purchaseLedgerData: LedgerData[];
  salesLedgerData: LedgerData[];
}

interface RootState {
  item: ItemState;
}

export const useItem = () => {
  const dispatch = useDispatch();

  const [addItemLoading, setAddItemLoading] = useState(false);
  const [updateItemLoading, setUpdateItemLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [getPurchaseLedgerLoading, setGetPurchaseLedgerLoading] =
    useState(false);
  const [getSalesLedgerLoading, setGetSalesLedgerLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);
  const [finStatrDate, setFinStartDate] = useState<string | null>(null);

  const [categoryInput, setCategoryInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemInput, setItemInput] = useState("");

  const [currentPurchaseLedgerPage, setCurrentPurchaseLedgerPage] = useState(1);
  const [lastPurchaseLedgerPage, setLastPurchaseLedgerPage] = useState(1);
  const [purchaseLedgerInput, setPurchaseLedgerInput] = useState("");

  const [currentSalesLedgerPage, setCurrentSalesLedgerPage] = useState(1);
  const [lastSalesLedgerPage, setLastSalesLedgerPage] = useState(1);
  const [salesLedgerInput, setSalesLedgerInput] = useState("");

  const [itemTableInput, setItemTableInput] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<ItemTableData | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);
  const [deleteItemLoading, setDeleteItemLoading] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  const itemData: ItemTableData[] = useSelector(
    (state: RootState) => state?.item?.itemData
  );

  const purchaseLedgerData: LedgerData[] = useSelector(
    (state: RootState) => state?.item?.purchaseLedgerData
  );

  const salesLedgerData: LedgerData[] = useSelector(
    (state: RootState) => state?.item?.salesLedgerData
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
      setFinStartDate(
        getCookieData<string | null>("waxCraftClientFinStartDate")
      );
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    categoryId: yup.string().required("Category is required"),
    modelId: yup.string().required("Model is required"),
    sizeId: yup.string().required("Size is required"),
    colourId: yup.string().default(""),
    itemName: yup.string().required("Item name is required"),
    itemShortName: yup.string().required("Item short name is required"),
    unitId: yup.string().required("Unit is required"),
    purchaseLedgerId: yup.string().required("Purchase ledger is required"),
    salesLedgerId: yup.string().required("Sales ledger is required"),
    cgst: yup
      .string()
      .required("CGST is required")
      .test("is-valid-number", "Invalid CGST", (value) => {
        if (!value) return false; // Ensure the field is not empty
        return uptoThreeDigitDecimalRegex.test(value); // Validate against the regex
      }),
    sgst: yup
      .string()
      .required("SGST is required")
      .test("is-valid-number", "Invalid SGST", (value) => {
        if (!value) return false; // Ensure the field is not empty
        return uptoThreeDigitDecimalRegex.test(value); // Validate against the regex
      }),
    igst: yup
      .string()
      .required("IGST is required")
      .test("is-valid-number", "Invalid IGST", (value) => {
        if (!value) return false; // Ensure the field is not empty
        return uptoThreeDigitDecimalRegex.test(value); // Validate against the regex
      }),
    purchaseRate: yup
      .string()
      .required("Purchase rate is required")
      .test("is-valid-number", "Invalid purchase rate", (value) => {
        if (!value) return false; // Ensure the field is not empty
        return uptoThreeDigitDecimalRegex.test(value); // Validate against the regex
      }),
    salesRate: yup
      .string()
      .required("Sales rate is required")
      .test("is-valid-number", "Invalid sales rate", (value) => {
        if (!value) return false; // Ensure the field is not empty
        return uptoThreeDigitDecimalRegex.test(value); // Validate against the regex
      }),
    openingQuantity: yup
      .string()
      .required("Opening quantity is required")
      .test("is-valid-number", "Invalid opening quantity", (value) => {
        if (!value) return false; // Ensure the field is not empty
        return uptoThreeDigitDecimalRegex.test(value); // Validate against the regex
      }),
    openingRate: yup
      .string()
      .required("Opening rate is required")
      .test("is-valid-number", "Invalid opening rate", (value) => {
        if (!value) return false; // Ensure the field is not empty
        return uptoThreeDigitDecimalRegex.test(value); // Validate against the regex
      }),
    total: yup.string().default(""),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<ItemFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      categoryId: "",
      modelId: "",
      sizeId: "",
      colourId: "",
      itemName: "",
      itemShortName: "",
      unitId: "",
      purchaseLedgerId: "",
      salesLedgerId: "",
      cgst: "",
      sgst: "",
      igst: "",
      purchaseRate: "",
      salesRate: "",
      openingQuantity: "",
      openingRate: "",
      total: "",
    },
  });

  const {
    categoryId,
    modelId,
    sizeId,
    colourId,
    openingQuantity,
    openingRate,
  } = form.watch();

  // Handle form submission
  const handleSubmit: SubmitHandler<ItemFormData> = (values) => {
    if (orgId) {
      if (editData && Object.keys(editData).length > 0) {
        updateItemApiCall(editData.Id, values, orgId);
      } else {
        addItemApiCall(values, orgId);
      }
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const handleEditData = (data: ItemTableData) => {
    setEditData(data);
    setIsOpen(true);
  };

  const handleShowDeleteDialog = (id: number) => {
    setTempDeleteId(id);
    setDeleteWarning(null);
    setShowDeleteDialog(true);
  };

  const handleDeleteItem = () => {
    if (orgId && tempDeleteId) {
      deleteItemApiCall(orgId, tempDeleteId);
    }
  };

  const handleFilterTableData = (value: string) => {
    setItemTableInput(value);
    setCurrentPage(1);
    if (orgId) getItemApiCall(orgId, 1, value, "TABLE");
  };

  const addItemApiCall = async (item: ItemFormData, orgId: number) => {
    setAddItemLoading(true);

    const data = {
      org_id: orgId,
      open_date: finStatrDate || "",
      cat_id: item.categoryId,
      item_name: item.itemName,
      item_sh_name: item.itemShortName,
      item_unit: item.unitId,
      pur_ledg: item.purchaseLedgerId,
      sales_ledg: item.salesLedgerId,
      cgst: toTwoDecimalString(item.cgst),
      sgst: toTwoDecimalString(item.sgst),
      igst: toTwoDecimalString(item.igst),
      pur_rate: toTwoDecimalString(item.purchaseRate),
      sales_rate: toTwoDecimalString(item.salesRate),
      open_qnty: toTwoDecimalString(item.openingQuantity),
      item_rate: toTwoDecimalString(item.openingRate),
      item_mod: item.modelId || "",
      item_size: item.sizeId || "",
      item_color: item.colourId || "",
    };

    try {
      const res: ApiResponse = await addItemAPI(data);

      if (res.status === 200) {
        form.reset();
        setCategoryInput("");
        setPurchaseLedgerInput("");
        setSalesLedgerInput("");
        setIsOpen(false);
        setCurrentPage(1);
        setItemTableInput("");
        getItemApiCall(orgId, 1, "", "TABLE");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddItemLoading(false);
    }
  };

  const updateItemApiCall = async (
    itemId: number,
    item: ItemFormData,
    orgId: number
  ) => {
    let data = {
      org_id: orgId,
      item_id: itemId,
      open_date: finStatrDate || "",
      cat_id: item.categoryId,
      item_name: item.itemName,
      item_sh_name: item.itemShortName,
      item_unit: item.unitId,
      pur_ledg: item.purchaseLedgerId,
      sales_ledg: item.salesLedgerId,
      cgst: toTwoDecimalString(item.cgst),
      sgst: toTwoDecimalString(item.sgst),
      igst: toTwoDecimalString(item.igst),
      pur_rate: toTwoDecimalString(item.purchaseRate),
      sales_rate: toTwoDecimalString(item.salesRate),
      open_qnty: toTwoDecimalString(item.openingQuantity),
      item_rate: toTwoDecimalString(item.openingRate),
      item_mod: item.modelId || "",
      item_size: item.sizeId || "",
      item_color: item.colourId || "",
    };
    setUpdateItemLoading(true);
    try {
      const res = await updateItemAPI(data);
      if (res.status === 200) {
        toast.success(res.data.message);
        form.reset();
        setCategoryInput("");
        setPurchaseLedgerInput("");
        setSalesLedgerInput("");
        setCurrentPage(1);
        setItemTableInput("");
        getItemApiCall(orgId, 1, "", "TABLE");
        setIsOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdateItemLoading(false);
    }
  };

  const getItemApiCall = async (
    orgId: number,
    page: number,
    keyword: string,
    type: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getItemAPI(orgId, page, keyword);

      if (res.status === 200) {
        const newData =
          type === "TABLE" || page === 1
            ? res.data.details?.data
            : [...itemData, ...res.data.details?.data];
        dispatch(getItemData(newData));
        setLastPage(res.data.details?.last_page);
        if (type === "TABLE" && !keyword) {
          setTotalCount(resolveListTotalCount(res.data.details));
        }
      } else {
        dispatch(getItemData([]));
        if (type === "TABLE" && !keyword) {
          setTotalCount(0);
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getItemData([]));
      if (type === "TABLE" && !keyword) {
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const getItemUnderCategoryApiCall = async (orgId: number, catId: string) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getItemUnderCategoryAPI(orgId, catId);

      if (res.status === 200) {
        dispatch(getItemData(res.data.details));
      } else {
        dispatch(getItemData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getItemData([]));
    } finally {
      setLoading(false);
    }
  };

  const getPurchaseLedgerApiCall = async (
    orgId: number,
    page: number,
    keyword: string
  ) => {
    setGetPurchaseLedgerLoading(true);

    try {
      const res: ApiResponse = await getPurchaseLedgerAPI(orgId, page, keyword);

      if (res.status === 200) {
        const newData =
          page === 1
            ? res.data.details?.data
            : [...purchaseLedgerData, ...res.data.details?.data];
        dispatch(getPurchaseLedgerData(newData));
        setLastPurchaseLedgerPage(res.data.details?.last_page);
      } else {
        dispatch(getPurchaseLedgerData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getPurchaseLedgerData([]));
    } finally {
      setGetPurchaseLedgerLoading(false);
    }
  };

  const getSalesLedgerApiCall = async (
    orgId: number,
    page: number,
    keyword: string
  ) => {
    setGetSalesLedgerLoading(true);

    try {
      const res: ApiResponse = await getSalesLedgerAPI(orgId, page, keyword);

      if (res.status === 200) {
        const newData =
          page === 1
            ? res.data.details?.data
            : [...salesLedgerData, ...res.data.details?.data];
        dispatch(getSalesLedgerData(newData));
        setLastSalesLedgerPage(res.data.details?.last_page);
      } else {
        dispatch(getSalesLedgerData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getSalesLedgerData([]));
    } finally {
      setGetSalesLedgerLoading(false);
    }
  };

  const deleteItemApiCall = async (
    orgId: number,
    itemId: number) => {
    setDeleteItemLoading(true);

    const data = {
      org_id: orgId,
      item_id: itemId,
    };

    try {
      const res: ApiResponse = await deleteItemAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        setShowDeleteDialog(false);
        setTempDeleteId(null);
        setDeleteWarning(null);
        setCurrentPage(1);
        setItemTableInput("");
        getItemApiCall(orgId, 1, "", "TABLE");
      } else if (isMasterDeleteDependencyResponse(res)) {
        setDeleteWarning(getMasterDeleteWarningMessage(res));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteItemLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        categoryId: editData.Cat_Id.toString() || "",
        modelId: editData.Model_Id?.toString() || "",
        sizeId: editData.Size_Id?.toString() || "",
        colourId: editData.Color_Id?.toString() || "",
        itemName: editData.Item_Name || "",
        itemShortName: editData.Item_Sh_Name || "",
        unitId: editData.Unit_Id.toString() || "",
        purchaseLedgerId: editData.Purchase_Gl.toString() || "",
        salesLedgerId: editData.Sales_Gl.toString() || "",
        cgst: toTwoDecimalString(editData.CGST),
        sgst: toTwoDecimalString(editData.SGST),
        igst: toTwoDecimalString(editData.IGST),
        purchaseRate: toTwoDecimalString(editData.Pur_Rate),
        salesRate: toTwoDecimalString(editData.Sale_Rate),
        openingQuantity: toTwoDecimalString(editData.Open_Qnty),
        openingRate: toTwoDecimalString(editData.Item_Rate),
      });
      setCategoryInput(editData.Cat_Name || "");
    } else {
      form.reset({
        categoryId: "",
        modelId: "",
        sizeId: "",
        colourId: "",
        itemName: "",
        itemShortName: "",
        unitId: "",
        purchaseLedgerId: "",
        salesLedgerId: "",
        cgst: "",
        sgst: "",
        igst: "",
        purchaseRate: "",
        salesRate: "",
        openingQuantity: "",
        openingRate: "",
      });
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
    setPurchaseLedgerInput("");
    setSalesLedgerInput("");
  });

  useEffect(() => {
    const newTotal =
      openingQuantity && openingRate
        ? toTwoDecimalString(Number(openingQuantity) * Number(openingRate))
        : "";

    form.setValue("total", newTotal.toString());
  }, [openingQuantity, openingRate]);

  return {
    getItemApiCall,
    getItemUnderCategoryApiCall,
    getPurchaseLedgerApiCall,
    getSalesLedgerApiCall,
    addItemLoading,
    updateItemLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    categoryId,
    modelId,
    sizeId,
    colourId,
    currentPage,
    setCurrentPage,
    lastPage,
    totalCount,
    currentPurchaseLedgerPage,
    setCurrentPurchaseLedgerPage,
    lastPurchaseLedgerPage,
    currentSalesLedgerPage,
    setCurrentSalesLedgerPage,
    lastSalesLedgerPage,
    itemTableInput,
    handleFilterTableData,
    itemInput,
    setItemInput,
    purchaseLedgerInput,
    setPurchaseLedgerInput,
    salesLedgerInput,
    setSalesLedgerInput,
    categoryInput,
    setCategoryInput,
    getPurchaseLedgerLoading,
    getSalesLedgerLoading,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteItem,
    deleteItemLoading,
    deleteWarning,
  };
};
