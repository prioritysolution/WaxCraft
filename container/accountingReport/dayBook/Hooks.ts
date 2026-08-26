import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import { DayBookFormData } from "@/types/accountingReport/DayBookTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { format } from "date-fns";
import { getDayBookAPI } from "./DayBookApis";
import { getDayBookData } from "./DayBookReducer";

export const useDayBook = () => {
  const dispatch = useDispatch();

  const [getDayBookLoading, setGetDayBookLoading] = useState(false);

  const [showPrintDialog, setShowPrintDialog] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);

  const [asOnDate, setAsOnDate] = useState("");

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    asOnDate: yup.date().required("As on date is required"),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<DayBookFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      asOnDate: undefined,
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<DayBookFormData> = (values) => {
    if (orgId) {
      getDayBookApiCall(values, orgId);
      setAsOnDate(format(values.asOnDate, "dd-MM-yyyy"));
    } else {
      toast.error("Something went wrong");
    }
  };

  const getDayBookApiCall = async (item: DayBookFormData, orgId: number) => {
    setGetDayBookLoading(true);

    const asOnDate = format(item.asOnDate, "yyyy-MM-dd");

    try {
      const res: ApiResponse = await getDayBookAPI(asOnDate, orgId);

      if (res.status === 200) {
        dispatch(getDayBookData(res.data.details));
      } else {
        dispatch(getDayBookData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getDayBookData([]));
    } finally {
      setGetDayBookLoading(false);
    }
  };

  return {
    getDayBookLoading,
    form,
    handleSubmit,
    showPrintDialog,
    setShowPrintDialog,
    asOnDate,
  };
};
