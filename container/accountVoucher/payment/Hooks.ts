import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch, useSelector } from "react-redux";
import { PaymentFormData } from "@/types/accountVoucher/PaymentTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { format } from "date-fns";
import {
  addPaymentAPI,
  deletePaymentAPI,
  getBankBalanceAPI,
  getPaymentAPI,
} from "./PaymentApis";
import { getPaymentData } from "./PaymentReducer";

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

export const usePayment = () => {
  const dispatch = useDispatch();

  const [addPaymentLoading, setAddPaymentLoading] = useState(false);
  const [deletePaymentLoading, setDeletePaymentLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);
  const [finId, setFinId] = useState<number | null>(null);

  const [receiptLedgerInput, setReceiptLedgerInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [selected, setSelected] = useState("form");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);

  const partyData: ReceiptPartyData[] = useSelector(
    (state: RootState) => state?.receipt?.receiptPartyData
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
      setFinId(getCookieData<number | null>("waxCraftClientFinId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    paymentDate: yup.date().required("Payment date is required"),
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
    amount: yup
      .string()
      .required("Amount is required")
      .test(
        "less-than-balance",
        "Amount must be less than available balance",
        function (value) {
          const { transMode, availableBalance } = this.parent;

          // Ensure value and availableBalance are numbers before comparison
          const amountValue = parseFloat(value || "0");
          const balanceValue = parseFloat(availableBalance || "0");

          if (transMode === "B" && amountValue > balanceValue) {
            return false; // Validation fails
          }
          return true; // Validation passes
        }
      ),
    transMode: yup.string().required("Trans mode is required"),
    bankId: yup.string().default(""),
    availableBalance: yup.string().default(""),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<PaymentFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      paymentDate: undefined,
      particular: "",
      manualVoucherNo: "",
      ledgerId: "",
      partyId: "",
      amount: "",
      transMode: "C",
      bankId: "",
      availableBalance: "",
    },
  });

  const { paymentDate, ledgerId, bankId, amount, availableBalance } =
    form.watch();

  // Handle form submission
  const handleSubmit: SubmitHandler<PaymentFormData> = (values) => {
    if (orgId && finId) {
      addPaymentApiCall(values);
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleShowDeleteDialog = (id: number) => {
    setShowDeleteDialog(true);
    setTempDeleteId(id);
  };

  const handleDeletePayment = () => {
    if (orgId && tempDeleteId) deletePaymentApiCall(orgId, tempDeleteId);
  };

  const addPaymentApiCall = async (item: PaymentFormData) => {
    setAddPaymentLoading(true);

    const data = {
      org_id: orgId,
      trans_date: format(item.paymentDate, "yyyy-MM-dd"),
      amount: item.amount,
      particular: item.particular,
      ledger_id: item.ledgerId,
      year_id: finId,
      manual_vouch: item.manualVoucherNo,
      party_id: item.partyId,
      bank_id: item.bankId,
    };

    try {
      const res: ApiResponse = await addPaymentAPI(data);

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
      setAddPaymentLoading(false);
    }
  };

  const deletePaymentApiCall = async (orgId: number, paymentId: number) => {
    setDeletePaymentLoading(true);

    const data = {
      org_id: orgId,
      trans_id: paymentId,
    };

    try {
      const res: ApiResponse = await deletePaymentAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        getPaymentApiCall(orgId, 1);
        setShowDeleteDialog(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeletePaymentLoading(false);
    }
  };

  const getPaymentApiCall = async (orgId: number, page: number) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getPaymentAPI(orgId, page);

      if (res.status === 200) {
        dispatch(getPaymentData(res.data.details));
        setLastPage(res.data.details?.pagination?.last_page);
      } else {
        dispatch(getPaymentData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getPaymentData([]));
    } finally {
      setLoading(false);
    }
  };

  const getBankBalanceApiCall = async (
    orgId: number,
    date: Date,
    bankId: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getBankBalanceAPI(
        orgId,
        bankId,
        format(date, "yyyy-MM-dd")
      );

      if (res.status === 200) {
        form.setValue("availableBalance", res.data.details);
      } else {
        toast.error(res.data.message);
        form.setValue("availableBalance", "");
      }
    } catch (err) {
      toast.error("Something went wrong");
      form.setValue("availableBalance", "");
    } finally {
      setLoading(false);
    }
  };

  const prevPaymentDate = useRef<Date>(paymentDate);
  const prevBankId = useRef(bankId);

  useEffect(() => {
    if (
      orgId &&
      bankId &&
      paymentDate &&
      (bankId !== prevBankId.current || paymentDate !== prevPaymentDate.current)
    ) {
      getBankBalanceApiCall(orgId, paymentDate, bankId);
    }
    prevPaymentDate.current = paymentDate;
    prevBankId.current = bankId;
  }, [paymentDate, bankId, orgId]);

  useEffect(() => {
    if (availableBalance && amount) form.trigger("amount");
  }, [availableBalance, amount]);

  return {
    getPaymentApiCall,
    addPaymentLoading,
    deletePaymentLoading,
    loading,
    form,
    handleSubmit,
    selected,
    setSelected,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeletePayment,
    ledgerId,
    currentPage,
    setCurrentPage,
    lastPage,
    receiptLedgerInput,
    setReceiptLedgerInput,
  };
};
