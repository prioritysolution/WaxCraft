import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useListPerPage } from "@/lib/useListPerPage";
import { useVoucherListDateFilter } from "@/lib/useVoucherListDateFilter";
import { normalizeVoucherListDetails } from "@/lib/voucherTableDate";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch, useSelector } from "react-redux";
import { ReceiptFormData } from "@/types/accountVoucher/ReceiptTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { format } from "date-fns";
import {
  addReceiptAPI,
  deleteReceiptAPI,
  getReceiptAPI,
  getReceiptLedgerAPI,
  getCheckReceiptPartyAPI,
} from "./ReceiptApis";
import {
  getReceiptPartyData,
  getReceiptData,
  getReceiptLedgerData,
} from "./ReceiptReducer";

interface ReceiptLedgerData {
  Id: number;
  Ledger_Name: string;
}

interface ReceiptPartyData {
  Id: number;
  Party_Name: string;
}

interface ReceiptState {
  receiptPartyData: ReceiptPartyData[];
  receiptLedgerData: ReceiptLedgerData[];
}

interface RootState {
  receipt: ReceiptState;
}

export const useReceipt = () => {
  const dispatch = useDispatch();

  const [addReceiptLoading, setAddReceiptLoading] = useState(false);
  const [deleteReceiptLoading, setDeleteReceiptLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [getReceiptLedgerLoading, setGetReceiptLedgerLoading] = useState(false);
  const [checkReceiptPartyLoading, setCheckReceiptPartyLoading] =
    useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);
  const [finId, setFinId] = useState<number | null>(null);

  const [currentReceiptLedgerPage, setCurrentReceiptLedgerPage] = useState(1);
  const [lastReceiptLedgerPage, setLastReceiptLedgerPage] = useState(1);
  const [receiptLedgerInput, setReceiptLedgerInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { perPage, handlePerPageChange } = useListPerPage(() =>
    setCurrentPage(1),
  );
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    fromDateApi,
    toDateApi,
  } = useVoucherListDateFilter();

  const [selected, setSelected] = useState("form");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);

  const partyData: ReceiptPartyData[] = useSelector(
    (state: RootState) => state?.receipt?.receiptPartyData
  );

  const ledgerData: ReceiptLedgerData[] = useSelector(
    (state: RootState) => state?.receipt?.receiptLedgerData
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
      setFinId(getCookieData<number | null>("waxCraftClientFinId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    receiptDate: yup.date().required("Receipt date is required"),
    particular: yup.string().required("Particular is required"),
    manualVoucherNo: yup.string().default(""),
    ledgerId: yup.string().required("Ledger is required"),
    partyId: yup
      .string()
      .test("party-required", "Party is required", function (value) {
        const { ledgerId } = this.parent;
        return !(ledgerId && partyData.length > 0 && !value);
      })
      .default(""),
    amount: yup.string().required("Amount is required"),
    transMode: yup.string().required("Trans mode is required"),
    bankId: yup.string().default(""),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<ReceiptFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      receiptDate: undefined,
      particular: "",
      manualVoucherNo: "",
      ledgerId: "",
      partyId: "",
      amount: "",
      transMode: "C",
      bankId: "",
    },
  });

  const { ledgerId } = form.watch();

  // Handle form submission
  const handleSubmit: SubmitHandler<ReceiptFormData> = (values) => {
    if (orgId && finId) {
      addReceiptApiCall(values);
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleShowDeleteDialog = (id: number) => {
    setShowDeleteDialog(true);
    setTempDeleteId(id);
  };

  const handleDeleteReceipt = () => {
    if (orgId && tempDeleteId) deleteReceiptApiCall(orgId, tempDeleteId);
  };

  const addReceiptApiCall = async (item: ReceiptFormData) => {
    setAddReceiptLoading(true);

    const data = {
      org_id: orgId,
      trans_date: format(item.receiptDate, "yyyy-MM-dd"),
      amount: item.amount,
      particular: item.particular,
      ledger_id: item.ledgerId,
      year_id: finId,
      manual_vouch: item.manualVoucherNo,
      party_id: item.partyId,
      bank_id: item.bankId,
    };

    try {
      const res: ApiResponse = await addReceiptAPI(data);

      if (res.status === 200) {
        form.reset();
        setReceiptLedgerInput("");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddReceiptLoading(false);
    }
  };

  const deleteReceiptApiCall = async (orgId: number, receiptId: number) => {
    setDeleteReceiptLoading(true);

    const data = {
      org_id: orgId,
      trans_id: receiptId,
    };

    try {
      const res: ApiResponse = await deleteReceiptAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        setCurrentPage(1);
        getReceiptApiCall(orgId, 1);
        setShowDeleteDialog(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteReceiptLoading(false);
    }
  };

  const getReceiptApiCall = async (orgId: number, page: number) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getReceiptAPI(
        orgId,
        page,
        perPage,
        fromDateApi,
        toDateApi,
      );

      if (res.status === 200) {
        const { rows, lastPage: pageCount } = normalizeVoucherListDetails(
          res.data.details,
        );
        dispatch(getReceiptData(rows));
        setLastPage(pageCount);
      } else {
        dispatch(getReceiptData([]));
        setLastPage(1);
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getReceiptData([]));
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  };

  const getReceiptLedgerApiCall = async (
    orgId: number,
    page: number,
    keyword: string
  ) => {
    setGetReceiptLedgerLoading(true);

    try {
      const res: ApiResponse = await getReceiptLedgerAPI(orgId, page, keyword);

      if (res.status === 200) {
        const newData =
          page === 1 ? res.data.details : [...ledgerData, ...res.data.details];
        dispatch(getReceiptLedgerData(newData));
        setLastReceiptLedgerPage(res.data.details?.pagination?.last_page);
      } else {
        dispatch(getReceiptLedgerData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getReceiptLedgerData([]));
    } finally {
      setGetReceiptLedgerLoading(false);
    }
  };

  const getCheckReceiptPartyApiCall = async (
    orgId: number,
    ledgerId: string
  ) => {
    setCheckReceiptPartyLoading(true);

    try {
      const res: ApiResponse = await getCheckReceiptPartyAPI(orgId, ledgerId);

      if (res.status === 200) {
        const details = res.data.details;
        const parties = Array.isArray(details)
          ? details
          : Array.isArray(details?.data)
            ? details.data
            : Array.isArray(details?.Party)
              ? details.Party
              : Array.isArray(details?.party)
                ? details.party
                : [];
        const normalized = parties
          .map((row: Record<string, unknown>) => ({
            Id: Number(row.Id ?? row.Party_Id ?? row.party_id ?? 0),
            Party_Name: String(
              row.Party_Name ?? row.party_name ?? row.Name ?? ""
            ),
          }))
          .filter((row: { Id: number; Party_Name: string }) => row.Id > 0);
        dispatch(getReceiptPartyData(normalized));
      } else {
        dispatch(getReceiptPartyData([]));
      }
    } catch (err) {
      dispatch(getReceiptPartyData([]));
      toast.error("Something went wrong");
    } finally {
      setCheckReceiptPartyLoading(false);
    }
  };

  return {
    getReceiptApiCall,
    getReceiptLedgerApiCall,
    getCheckReceiptPartyApiCall,
    addReceiptLoading,
    deleteReceiptLoading,
    loading,
    form,
    handleSubmit,
    selected,
    setSelected,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeleteReceipt,
    ledgerId,
    currentReceiptLedgerPage,
    setCurrentReceiptLedgerPage,
    lastReceiptLedgerPage,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    receiptLedgerInput,
    setReceiptLedgerInput,
    getReceiptLedgerLoading,
    checkReceiptPartyLoading,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
  };
};
