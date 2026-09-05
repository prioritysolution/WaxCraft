import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useListPerPage } from "@/lib/useListPerPage";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";
import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import {
  OrderProcessDesignRow,
  OrderProcessFormData,
  OrderProcessTableData,
  ProcessTableData,
} from "@/types/inventoryVoucher/OrderProcessTypes";
import { ApiResponse } from "@/types/ApiTypes";
import {
  addOrderFinalCloseAPI,
  addOrderProcessAPI,
  getWorkStatusAPI,
} from "./OrderProcessApis";
import { format } from "date-fns";
import { getOrderBookingAPI } from "../orderBooking/OrderBookingApis";
import { getOrderBookingData } from "../orderBooking/OrderBookingReducer";
import { resolveListLastPage } from "@/lib/listTotalCount";

const formatOrderDate = (value?: string | Date | null) => {
  if (!value) return "";
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) return trimmed;
    const isoDate = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoDate) return `${isoDate[3]}-${isoDate[2]}-${isoDate[1]}`;
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) return format(parsed, "dd-MM-yyyy");
    return trimmed;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return format(value, "dd-MM-yyyy");
  }
  return "";
};

const extractActiveOrderRows = (details: unknown): OrderProcessTableData[] => {
  if (Array.isArray(details)) return details as OrderProcessTableData[];
  if (details && typeof details === "object") {
    const record = details as {
      data?: OrderProcessTableData[];
      pagination?: { data?: OrderProcessTableData[] };
    };
    if (Array.isArray(record.data)) return record.data;
    if (Array.isArray(record.pagination?.data)) return record.pagination.data;
  }
  return [];
};

export const useOrderProcess = () => {
  const dispatch = useDispatch();

  const [addOrderProcessLoading, setAddOrderProcessLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);

  const [employeeInput, setEmployeeInput] = useState("");

  const [isOpenProcess, setIsOpenProcess] = useState(false);

  const [showFormFields, setShowFormFields] = useState(false);

  const [processTableData, setProcessTableData] = useState<ProcessTableData[]>(
    []
  );

  const [processDesignRows, setProcessDesignRows] = useState<
    OrderProcessDesignRow[]
  >([]);

  const [selectedProcessOrder, setSelectedProcessOrder] =
    useState<OrderProcessTableData | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { perPage, handlePerPageChange } = useListPerPage(() =>
    setCurrentPage(1),
  );

  const [dialogType, setDialogType] = useState<"View" | "Process">("View");

  const [processPostType, setProcessPostType] = useState<
    "FurtherProcess" | "FinalClose"
  >("FurtherProcess");

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    orderId: yup.string().default(""),
    designId: yup.string().default(""),
    orderDate: yup.string().default(""),
    orderNo: yup.string().default(""),
    partyName: yup.string().default(""),
    totalOrder: yup.string().default(""),
    orderStatus: yup.string().default(""),
    designName: yup.string().default(""),
    designNo: yup.string().default(""),
    orderQuantity: yup.string().default(""),
    designRate: yup.string().default(""),
    wt: yup.string().default(""),
    wtRate: yup.string().default(""),
    totalWt: yup.string().default(""),
    polish: yup.string().default(""),
    totalPolish: yup.string().default(""),
    image: yup.string().default(""),
    closeDate: yup
      .date()
      .test("is-required", "Close date is required", function (value) {
        if (processPostType === "FinalClose" && !value) {
          return false;
        }
        return true;
      }),
    startDate: yup
      .date()
      .test("is-required", "Start date is required", function (value) {
        if (processPostType === "FurtherProcess" && !value) {
          return false;
        }
        return true;
      }),
    employeeId: yup
      .string()
      .default("")
      .test("is-required", "Employee is required", function (value) {
        if (processPostType === "FurtherProcess" && !value) {
          return false;
        }
        return true;
      }),
    workDetails: yup
      .string()
      .default("")
      .test("is-required", "Work details is required", function (value) {
        if (processPostType === "FurtherProcess" && !value) {
          return false;
        }
        return true;
      }),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<OrderProcessFormData>({
    // @ts-expect-error nodescription
    resolver: yupResolver(formSchema),
    defaultValues: {
      orderId: "",
      designId: "",
      orderDate: "",
      orderNo: "",
      partyName: "",
      totalOrder: "",
      orderStatus: "",
      designName: "",
      designNo: "",
      orderQuantity: "",
      designRate: "",
      wt: "",
      wtRate: "",
      totalWt: "",
      polish: "",
      totalPolish: "",
      image: "",
      closeDate: undefined,
      startDate: undefined,
      employeeId: "",
      workDetails: "",
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<OrderProcessFormData> = (values) => {
    if (orgId) {
      processPostType === "FurtherProcess"
        ? addOrderProcessApiCall(values, orgId)
        : addOrderFinalCloseApiCall(values, orgId);
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const applyOrderToModal = (
    data: OrderProcessTableData,
    fallback?: OrderProcessTableData | null,
    preserveProcessFields = false
  ) => {
    const merged: OrderProcessTableData = {
      Id: data?.Id ?? fallback?.Id,
      Party_Id: data?.Party_Id ?? fallback?.Party_Id,
      Order_Date: data?.Order_Date || fallback?.Order_Date || "",
      Order_No: data?.Order_No || fallback?.Order_No || "",
      Party_Name: data?.Party_Name || fallback?.Party_Name || "",
      Total_Order: data?.Total_Order || fallback?.Total_Order || "",
      Order_Status: data?.Order_Status || fallback?.Order_Status || "",
      DesignRow:
        Array.isArray(data?.DesignRow) && data.DesignRow.length
          ? data.DesignRow
          : Array.isArray(fallback?.DesignRow)
            ? fallback.DesignRow
            : [],
    };
    const designs = merged.DesignRow;
    const primaryDesign = designs[0];
    const orderDate = formatOrderDate(merged.Order_Date);
    const currentValues = preserveProcessFields ? form.getValues() : null;

    setSelectedProcessOrder(merged);
    setProcessDesignRows(designs);

    form.reset({
      orderId: merged.Id != null ? String(merged.Id) : "",
      designId:
        primaryDesign?.Design_Id != null
          ? String(primaryDesign.Design_Id)
          : "",
      orderDate,
      orderNo: merged.Order_No || "",
      partyName: merged.Party_Name || "",
      totalOrder: merged.Total_Order || "",
      orderStatus: merged.Order_Status || "",
      designName: primaryDesign?.Design_Name || "",
      designNo: primaryDesign?.Design_No || "",
      orderQuantity: primaryDesign?.Order_Qnty || "",
      designRate: primaryDesign?.Design_Rate || "",
      wt: primaryDesign?.Wt || "",
      wtRate: primaryDesign?.Wt_Rate || "",
      totalWt: primaryDesign?.Tot_Wt || "",
      polish: primaryDesign?.Polish || "",
      totalPolish: primaryDesign?.Tot_Polish || "",
      image: primaryDesign?.Image || "",
      closeDate: currentValues?.closeDate,
      startDate: currentValues?.startDate,
      employeeId: currentValues?.employeeId || "",
      workDetails: currentValues?.workDetails || "",
    });
  };

  const fetchActiveOrderForModal = async (
    orderId: number,
    fallback: OrderProcessTableData
  ) => {
    if (!orgId) return;

    try {
      const res: ApiResponse = await getOrderBookingAPI(
        orgId,
        currentPage,
        "",
        perPage
      );

      if (res.status !== 200) return;

      const rows = extractActiveOrderRows(res.data?.details);
      if (rows.length) {
        dispatch(getOrderBookingData(rows));
        setLastPage(resolveListLastPage(res.data.details, perPage));
      }

      const matched =
        rows.find((row) => Number(row?.Id) === Number(orderId)) || null;

      if (matched) {
        applyOrderToModal(matched, fallback, true);
      }
    } catch {
      // Keep optimistic row data already applied to the modal.
    }
  };

  const handleOpenProcessDialog = (
    data: OrderProcessTableData,
    type: "Process" | "View"
  ) => {
    setDialogType(type);
    setIsOpenProcess(true);

    applyOrderToModal(data);

    if (orgId && data?.Id) {
      getWorkStatusApiCall(orgId, data.Id);
      void fetchActiveOrderForModal(data.Id, data);
    }
  };

  const handleFurtherProcess = () => {
    setShowFormFields(!showFormFields);
    setProcessPostType("FurtherProcess");
  };

  const handleFinalClose = () => {
    setShowFormFields(!showFormFields);
    setProcessPostType("FinalClose");
  };

  const addOrderProcessApiCall = async (
    item: OrderProcessFormData,
    orgId: number
  ) => {
    setAddOrderProcessLoading(true);

    const data = {
      org_id: orgId,
      order_id: item.orderId,
      work_details: [
        {
          design_id: item.designId,
          start_date: format(item.startDate, "yyyy-MM-dd"),
          work_under: item.employeeId,
          work_details: item.workDetails,
        },
      ],
    };

    try {
      const res: ApiResponse = await addOrderProcessAPI(data);

      if (res.status === 200) {
        form.reset();
        setEmployeeInput("");
        setIsOpenProcess(false);
        getOrderBookingApiCall(orgId, currentPage, "", perPage);
        setDialogType("View");
        setProcessPostType("FurtherProcess");
        setProcessTableData([]);
        setShowFormFields(false);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddOrderProcessLoading(false);
    }
  };

  const addOrderFinalCloseApiCall = async (
    item: OrderProcessFormData,
    orgId: number
  ) => {
    setAddOrderProcessLoading(true);

    const data = {
      org_id: orgId,
      order_id: item.orderId,
      comp_date: format(item.closeDate, "yyyy-MM-dd"),
    };

    try {
      const res: ApiResponse = await addOrderFinalCloseAPI(data);

      if (res.status === 200) {
        form.reset();
        setEmployeeInput("");
        setIsOpenProcess(false);
        getOrderBookingApiCall(orgId, currentPage, "", perPage);
        setDialogType("View");
        setProcessPostType("FurtherProcess");
        setProcessTableData([]);
        setShowFormFields(false);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddOrderProcessLoading(false);
    }
  };

  const getWorkStatusApiCall = async (orgId: number, orderId: number) => {
    try {
      const res: ApiResponse = await getWorkStatusAPI(orgId, orderId);

      if (res.status === 200) {
        setShowFormFields(false);
        setProcessTableData(res.data.details[0].childrow);
      } else {
        setShowFormFields(true);
        setProcessTableData([]);
        setProcessPostType("FurtherProcess");
      }
    } catch (err) {
      setShowFormFields(true);
      toast.error("Something went wrong");
      setProcessTableData([]);
    }
  };

  const getOrderBookingApiCall = async (
    orgId: number,
    page: number,
    keyword: string,
    requestPerPage?: number
  ) => {
    setLoading(true);

    const pageSize = requestPerPage ?? perPage;

    try {
      const res: ApiResponse = await getOrderBookingAPI(
        orgId,
        page,
        keyword,
        pageSize
      );

      if (res.status === 200) {
        const details = res.data.details;
        const rows = extractActiveOrderRows(details);

        dispatch(getOrderBookingData(rows));
        setLastPage(resolveListLastPage(details, pageSize));
      } else {
        dispatch(getOrderBookingData([]));
        setLastPage(1);
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getOrderBookingData([]));
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  };

  useResetFormOnModalClose(isOpenProcess, () => {
    form.reset();
    setEmployeeInput("");
    setShowFormFields(false);
    setProcessTableData([]);
    setProcessPostType("FurtherProcess");
    // Keep selectedProcessOrder / processDesignRows until next open.
    // Clearing them here can race with reopen and blank order details.
  });

  return {
    addOrderProcessLoading,
    loading,
    form,
    handleSubmit,
    isOpenProcess,
    setIsOpenProcess,
    handleOpenProcessDialog,
    dialogType,
    showFormFields,
    processTableData,
    processDesignRows,
    selectedProcessOrder,
    handleFurtherProcess,
    handleFinalClose,
    processPostType,
    getOrderBookingApiCall,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    employeeInput,
    setEmployeeInput,
  };
};
