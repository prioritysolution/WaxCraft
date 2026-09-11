import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { PartyFormData } from "../master/PartyTypes";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface PaymentFormData {
  paymentDate: Date;
  particular: string;
  manualVoucherNo: string;
  ledgerId: string;
  partyId: string;
  amount: string;
  transMode: string;
  bankId: string;
  availableBalance: string;
}

// Define the structure of the body you expect for the Payment API (adjust based on your API's requirements)
interface PaymentBody {
  org_id: number | null;
  year_id: number | null;
  trans_date: string;
  amount: string;
  particular: string;
  ledger_id: string;
  manual_vouch: string;
  party_id: string;
  bank_id: string;
}

export interface PaymentProps {
  addPaymentLoading: boolean;
  deletePaymentLoading: boolean;
  loading: boolean;
  form: UseFormReturn<PaymentFormData>;
  handleSubmit: SubmitHandler<PaymentFormData>;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeletePayment: () => void;
  handleSearchReceiptLedger: () => void;
  handleScrollReceiptLedger: () => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  receiptLedgerInput: string;
  setReceiptLedgerInput: Dispatch<SetStateAction<string>>;
  getReceiptLedgerLoading: boolean;
  checkReceiptPartyLoading: boolean;
  getBankAccountLoading: boolean;
  fromDate?: Date | null;
  toDate?: Date | null;
  setFromDate: (value: Date | undefined) => void;
  setToDate: (value: Date | undefined) => void;
}

export interface PaymentFormProps {
  addPaymentLoading: boolean;
  form: UseFormReturn<PaymentFormData>;
  handleSubmit: SubmitHandler<PaymentFormData>;
  handleSearchReceiptLedger: () => void;
  handleScrollReceiptLedger: () => void;
  receiptLedgerInput: string;
  setReceiptLedgerInput: Dispatch<SetStateAction<string>>;
  getReceiptLedgerLoading: boolean;
  checkReceiptPartyLoading: boolean;
  getBankAccountLoading: boolean;
}

export interface PaymentTableProps {
  loading: boolean;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeletePayment: () => void;
  deletePaymentLoading: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  fromDate?: Date | null;
  toDate?: Date | null;
  setFromDate: (value: Date | undefined) => void;
  setToDate: (value: Date | undefined) => void;
}

export interface PaymentTableData {
  Id: number;
  Trans_Date: string;
  Vouch_No: string;
  Ref_Vouch_No: string;
  Particular: string;
  Amount: string;
}
