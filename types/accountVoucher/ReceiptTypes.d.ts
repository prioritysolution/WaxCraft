import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { PartyFormData } from "../master/PartyTypes";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface ReceiptFormData {
  receiptDate: Date;
  particular: string;
  manualVoucherNo: string;
  ledgerId: string;
  partyId: string;
  amount: string;
  transMode: string;
  bankId: string;
}

// Define the structure of the body you expect for the Receipt API (adjust based on your API's requirements)
interface ReceiptBody {
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

export interface ReceiptProps {
  addReceiptLoading: boolean;
  deleteReceiptLoading: boolean;
  loading: boolean;
  form: UseFormReturn<ReceiptFormData>;
  handleSubmit: SubmitHandler<ReceiptFormData>;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeleteReceipt: () => void;
  handleSearchReceiptLedger: () => void;
  handleScrollReceiptLedger: () => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  receiptLedgerInput: string;
  setReceiptLedgerInput: Dispatch<SetStateAction<string>>;
  getReceiptLedgerLoading: boolean;
  checkReceiptPartyLoading: boolean;
  getBankAccountLoading: boolean;
}

export interface ReceiptFormProps {
  addReceiptLoading: boolean;
  form: UseFormReturn<ReceiptFormData>;
  handleSubmit: SubmitHandler<ReceiptFormData>;
  handleSearchReceiptLedger: () => void;
  handleScrollReceiptLedger: () => void;
  receiptLedgerInput: string;
  setReceiptLedgerInput: Dispatch<SetStateAction<string>>;
  getReceiptLedgerLoading: boolean;
  checkReceiptPartyLoading: boolean;
  getBankAccountLoading: boolean;
}

export interface ReceiptTableProps {
  loading: boolean;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeleteReceipt: () => void;
  deleteReceiptLoading: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
}

export interface ReceiptTableData {
  Id: number;
  Trans_Date: string;
  Vouch_No: string;
  Ref_Vouch_No: string;
  Particular: string;
  Amount: string;
}
