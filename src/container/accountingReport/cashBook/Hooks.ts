import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import { CashBookFormData } from "@/types/accountingReport/CashBookTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { format } from "date-fns";
import { getCashBookAPI } from "./CashBookApis";
import { getCashBookData } from "./CashBookReducer";

export const useCashBook = () => {
  const dispatch = useDispatch();

  const [getCashBookLoading, setGetCashBookLoading] = useState(false);

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
  const form = useForm<CashBookFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      asOnDate: undefined,
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<CashBookFormData> = (values) => {
    if (orgId) {
      getCashBookApiCall(values, orgId);
      setAsOnDate(format(values.asOnDate, "dd-MM-yyyy"));
    } else {
      toast.error("Something went wrong");
    }
  };

  const getCashBookApiCall = async (item: CashBookFormData, orgId: number) => {
    setGetCashBookLoading(true);

    const asOnDate = format(item.asOnDate, "yyyy-MM-dd");

    try {
      const res: ApiResponse = await getCashBookAPI(asOnDate, orgId);

      if (res.status === 200) {
        dispatch(getCashBookData(res.data.details));
      } else {
        dispatch(getCashBookData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getCashBookData([]));
    } finally {
      setGetCashBookLoading(false);
    }
  };

  return {
    getCashBookLoading,
    form,
    handleSubmit,
    showPrintDialog,
    setShowPrintDialog,
    asOnDate,
  };
};
