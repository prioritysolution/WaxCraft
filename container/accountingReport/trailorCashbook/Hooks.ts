import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import { TrailorCashbookFormData } from "@/types/accountingReport/TrailorCashbookTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { format } from "date-fns";
import { getTrailorCashbookAPI } from "./TrailorCashbookApis";
import { getTrailorCashbookData } from "./TrailorCashbookReducer";

export const useTrailorCashbook = () => {
  const dispatch = useDispatch();

  const [getTrailorCashbookLoading, setGetTrailorCashbookLoading] =
    useState(false);

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
    userId: yup.string().required("User is required"),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<TrailorCashbookFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      asOnDate: undefined,
      userId: "",
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<TrailorCashbookFormData> = (values) => {
    if (orgId) {
      getTrailorCashbookApiCall(values, orgId);
      setAsOnDate(format(values.asOnDate, "dd-MM-yyyy"));
    } else {
      toast.error("Something went wrong");
    }
  };

  const getTrailorCashbookApiCall = async (
    item: TrailorCashbookFormData,
    orgId: number
  ) => {
    setGetTrailorCashbookLoading(true);

    const asOnDate = format(item.asOnDate, "yyyy-MM-dd");

    try {
      const res: ApiResponse = await getTrailorCashbookAPI(
        asOnDate,
        item.userId,
        orgId
      );

      if (res.status === 200) {
        dispatch(getTrailorCashbookData(res.data.details));
      } else {
        dispatch(getTrailorCashbookData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getTrailorCashbookData([]));
    } finally {
      setGetTrailorCashbookLoading(false);
    }
  };

  return {
    getTrailorCashbookLoading,
    form,
    handleSubmit,
    showPrintDialog,
    setShowPrintDialog,
    asOnDate,
  };
};
