import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import { SalesReportFormData } from "@/types/inventoryReport/SalesReportTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { format } from "date-fns";
import { getSalesReportAPI } from "./SalesReportApis";
import { getSalesReportData } from "./SalesReportReducer";

export const useSalesReport = () => {
  const dispatch = useDispatch();

  const [getSalesReportLoading, setGetSalesReportLoading] = useState(false);

  const [showPrintDialog, setShowPrintDialog] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);

  const [orderPartyInput, setOrderPartyInput] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    fromDate: yup.date().required("From date is required"),
    toDate: yup.date().required("To date is required"),
    partyId: yup.string().default(""),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<SalesReportFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fromDate: undefined,
      toDate: undefined,
      partyId: "",
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<SalesReportFormData> = (values) => {
    if (orgId) {
      getSalesReportApiCall(values, orgId);
      setFromDate(format(values.fromDate, "dd-MM-yyyy"));
      setToDate(format(values.toDate, "dd-MM-yyyy"));
    } else {
      toast.error("Something went wrong");
    }
  };

  const getSalesReportApiCall = async (
    item: SalesReportFormData,
    orgId: number
  ) => {
    setGetSalesReportLoading(true);

    const fromDate = format(item.fromDate, "yyyy-MM-dd");
    const toDate = format(item.toDate, "yyyy-MM-dd");
    const partyId = item.partyId;

    try {
      const res: ApiResponse = await getSalesReportAPI(
        fromDate,
        toDate,
        partyId,
        orgId
      );

      if (res.status === 200) {
        dispatch(getSalesReportData(res.data.details));
      } else {
        dispatch(getSalesReportData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getSalesReportData([]));
    } finally {
      setGetSalesReportLoading(false);
    }
  };

  return {
    getSalesReportLoading,
    form,
    handleSubmit,
    showPrintDialog,
    setShowPrintDialog,
    fromDate,
    toDate,
    orderPartyInput,
    setOrderPartyInput,
  };
};
