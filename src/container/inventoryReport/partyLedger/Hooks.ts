import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import { PartyLedgerFormData } from "@/types/inventoryReport/PartyLedgerTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { format } from "date-fns";
import { getPartyLedgerAPI } from "./PartyLedgerApis";
import { getPartyLedgerData } from "./PartyLedgerReducer";

export const usePartyLedger = () => {
  const dispatch = useDispatch();

  const [getPartyLedgerLoading, setGetPartyLedgerLoading] = useState(false);

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
    partyId: yup.string().required("Party is required"),
    ledgerType: yup.string().required("Ledger type required"),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<PartyLedgerFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fromDate: undefined,
      toDate: undefined,
      partyId: "",
      ledgerType: "",
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<PartyLedgerFormData> = (values) => {
    if (orgId) {
      getPartyLedgerApiCall(values, orgId);
      setFromDate(format(values.fromDate, "dd-MM-yyyy"));
      setToDate(format(values.toDate, "dd-MM-yyyy"));
    } else {
      toast.error("Something went wrong");
    }
  };

  const getPartyLedgerApiCall = async (
    item: PartyLedgerFormData,
    orgId: number
  ) => {
    setGetPartyLedgerLoading(true);

    const fromDate = format(item.fromDate, "yyyy-MM-dd");
    const toDate = format(item.toDate, "yyyy-MM-dd");
    const partyId = item.partyId;
    const type = item.ledgerType;

    try {
      const res: ApiResponse = await getPartyLedgerAPI(
        fromDate,
        toDate,
        partyId,
        type,
        orgId
      );

      if (res.status === 200) {
        dispatch(getPartyLedgerData(res.data.details));
      } else {
        dispatch(getPartyLedgerData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getPartyLedgerData([]));
    } finally {
      setGetPartyLedgerLoading(false);
    }
  };

  return {
    getPartyLedgerLoading,
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
