import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import { BankLedgerFormData } from "@/types/accountingReport/BankLedgerTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { format } from "date-fns";
import { getBankLedgerAPI } from "./BankLedgerApis";
import { getBankLedgerData } from "./BankLedgerReducer";

export const useBankLedger = () => {
  const dispatch = useDispatch();

  const [getBankLedgerLoading, setGetBankLedgerLoading] = useState(false);

  const [showPrintDialog, setShowPrintDialog] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);

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
    bankId: yup.string().required("Bank is required"),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<BankLedgerFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fromDate: undefined,
      toDate: undefined,
      bankId: "",
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<BankLedgerFormData> = (values) => {
    if (orgId) {
      getBankLedgerApiCall(values, orgId);
      setFromDate(format(values.fromDate, "dd-MM-yyyy"));
      setToDate(format(values.toDate, "dd-MM-yyyy"));
    } else {
      toast.error("Something went wrong");
    }
  };

  const getBankLedgerApiCall = async (
    item: BankLedgerFormData,
    orgId: number
  ) => {
    setGetBankLedgerLoading(true);

    const fromDate = format(item.fromDate, "yyyy-MM-dd");
    const toDate = format(item.toDate, "yyyy-MM-dd");
    const bankId = item.bankId;

    try {
      const res: ApiResponse = await getBankLedgerAPI(
        fromDate,
        toDate,
        bankId,
        orgId
      );

      if (res.status === 200) {
        dispatch(getBankLedgerData(res.data.details));
      } else {
        dispatch(getBankLedgerData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getBankLedgerData([]));
    } finally {
      setGetBankLedgerLoading(false);
    }
  };

  return {
    getBankLedgerLoading,
    form,
    handleSubmit,
    showPrintDialog,
    setShowPrintDialog,
    fromDate,
    toDate,
  };
};
