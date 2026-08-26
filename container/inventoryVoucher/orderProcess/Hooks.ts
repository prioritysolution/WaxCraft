import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";
import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import {
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

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

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

  const handleOpenProcessDialog = (
    data: OrderProcessTableData,
    type: "Process" | "View"
  ) => {
    setIsOpenProcess(true);
    setDialogType(type);
    if (orgId && data.Id) getWorkStatusApiCall(orgId, data.Id);
    form.setValue("orderId", data.Id.toString());
    form.setValue("designId", data.DesignRow[0].Design_Id.toString());
    form.setValue(
      "orderDate",
      data.Order_Date ? format(data.Order_Date, "dd-MM-yyyy") : ""
    );
    form.setValue("orderNo", data.Order_No || "");
    form.setValue("partyName", data.Party_Name || "");
    form.setValue("totalOrder", data.Total_Order || "");
    form.setValue("orderStatus", data.Order_Status || "");
    form.setValue("designName", data.DesignRow[0].Design_Name || "");
    form.setValue("designNo", data.DesignRow[0].Design_No || "");
    form.setValue("orderQuantity", data.DesignRow[0].Order_Qnty || "");
    form.setValue("designRate", data.DesignRow[0].Design_Rate);
    form.setValue("wt", data.DesignRow[0].Wt || "");
    form.setValue("wtRate", data.DesignRow[0].Wt_Rate || "");
    form.setValue("totalWt", data.DesignRow[0].Tot_Wt || "");
    form.setValue("polish", data.DesignRow[0].Polish || "");
    form.setValue("totalPolish", data.DesignRow[0].Tot_Polish || "");
    form.setValue("image", data.DesignRow[0].Image || "");
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
        getOrderBookingApiCall(orgId, currentPage, "");
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
        getOrderBookingApiCall(orgId, currentPage, "");
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
    setLoading(true);

    try {
      const res: ApiResponse = await getWorkStatusAPI(orgId, orderId);

      if (res.status === 200) {
        setShowFormFields(false);
        setProcessTableData(res.data.details[0].childrow);
      } else {
        setShowFormFields(true);
        setProcessTableData([]);
        setProcessPostType("FurtherProcess");
        // toast.error(res.data.message || "No  data available");
      }
    } catch (err) {
      setShowFormFields(true);
      toast.error("Something went wrong");
      setProcessTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const getOrderBookingApiCall = async (
    orgId: number,
    page: number,
    keyword: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getOrderBookingAPI(orgId, page, keyword);

      if (res.status === 200) {
        dispatch(getOrderBookingData(res.data.details?.data));
        setLastPage(res.data.details?.pagination?.last_page);
      } else {
        dispatch(getOrderBookingData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getOrderBookingData([]));
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
    handleFurtherProcess,
    handleFinalClose,
    processPostType,
    getOrderBookingApiCall,
    currentPage,
    setCurrentPage,
    lastPage,
    employeeInput,
    setEmployeeInput,
  };
};
