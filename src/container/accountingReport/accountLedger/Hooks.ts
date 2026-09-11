import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch, useSelector } from "react-redux";
import { AccountLedgerFormData } from "@/types/accountingReport/AccountLedgerTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { format } from "date-fns";
import {
  getAccountLedgerAPI,
  getReportLedgerListDataAPI,
} from "./AccountLedgerApis";
import {
  getAccountLedgerData,
  getAccountLedgerListData,
} from "./AccountLedgerReducer";

interface LedgerData {
  Id: number;
  Ledger_Name: string;
}

interface AccountLedgerReportState {
  accountLedgerListData: LedgerData[];
}

interface RootState {
  accountLedgerReport: AccountLedgerReportState;
}

export const useAccountLedger = () => {
  const dispatch = useDispatch();

  const [getAccountLedgerLoading, setGetAccountLedgerLoading] = useState(false);
  const [getAccountLedgerListLoading, setGetAccountLedgerListLoading] =
    useState(false);

  const [showPrintDialog, setShowPrintDialog] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);

  const [currentAccountLedgerPage, setCurrentAccountLedgerPage] = useState(1);
  const [lastAccountLedgerPage, setLastAccountLedgerPage] = useState(1);
  const [accountLedgerInput, setAccountLedgerInput] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [ledgerId, setLedgerId] = useState("");

  const legderData: LedgerData[] = useSelector(
    (state: RootState) => state?.accountLedgerReport?.accountLedgerListData
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    fromDate: yup.date().required("From date is required"),
    toDate: yup.date().required("To date is required"),
    ledgerId: yup.string().required("Ledger is required"),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<AccountLedgerFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fromDate: undefined,
      toDate: undefined,
      ledgerId: "",
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<AccountLedgerFormData> = (values) => {
    if (orgId) {
      getAccountLedgerApiCall(values, orgId);
      setFromDate(format(values.fromDate, "dd-MM-yyyy"));
      setToDate(format(values.toDate, "dd-MM-yyyy"));
      setLedgerId(values.ledgerId);
    } else {
      toast.error("Something went wrong");
    }
  };

  const getAccountLedgerApiCall = async (
    item: AccountLedgerFormData,
    orgId: number
  ) => {
    setGetAccountLedgerLoading(true);

    const fromDate = format(item.fromDate, "yyyy-MM-dd");
    const toDate = format(item.toDate, "yyyy-MM-dd");
    const ledgerId = item.ledgerId;

    try {
      const res: ApiResponse = await getAccountLedgerAPI(
        fromDate,
        toDate,
        ledgerId,
        orgId
      );

      if (res.status === 200) {
        dispatch(getAccountLedgerData(res.data.details));
      } else {
        dispatch(getAccountLedgerData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getAccountLedgerData([]));
    } finally {
      setGetAccountLedgerLoading(false);
    }
  };

  const getAccountLedgerListDataApiCall = async (
    orgId: number,
    page: number,
    keyword: string
  ) => {
    setGetAccountLedgerListLoading(true);

    try {
      const res: ApiResponse = await getReportLedgerListDataAPI(
        orgId,
        page,
        keyword
      );

      if (res.status === 200) {
        const newData =
          page === 1 ? res.data.details : [...legderData, ...res.data.details];
        dispatch(getAccountLedgerListData(newData));
        setLastAccountLedgerPage(res.data.details?.last_page);
      } else {
        dispatch(getAccountLedgerListData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getAccountLedgerListData([]));
    } finally {
      setGetAccountLedgerListLoading(false);
    }
  };

  return {
    getAccountLedgerLoading,
    getAccountLedgerListDataApiCall,
    form,
    handleSubmit,
    showPrintDialog,
    setShowPrintDialog,
    fromDate,
    toDate,
    ledgerId,
    currentAccountLedgerPage,
    setCurrentAccountLedgerPage,
    lastAccountLedgerPage,
    accountLedgerInput,
    setAccountLedgerInput,
    getAccountLedgerListLoading,
  };
};
