import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { PartyFormData } from "../master/PartyTypes";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface BankTransferFormData {
  transferDate: Date;
  particular: string;
  manualVoucherNo: string;
  sendersBankId: string;
  receiversBankId: string;
  availableBalance: string;
  amount: string;
}

// Define the structure of the body you expect for the BankTransfer API (adjust based on your API's requirements)
interface BankTransferBody {
  org_id: number | null;
  year_id: number | null;
  trans_date: string;
  frm_bank: string;
  to_bank: string;
  particular: string;
  amount: string;
  ref_vouch: string;
}

export interface BankTransferProps {
  addBankTransferLoading: boolean;
  deleteBankTransferLoading: boolean;
  loading: boolean;
  form: UseFormReturn<BankTransferFormData>;
  handleSubmit: SubmitHandler<BankTransferFormData>;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeleteBankTransfer: () => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  getBankAccountLoading: boolean;
  fromDate?: Date | null;
  toDate?: Date | null;
  setFromDate: (value: Date | undefined) => void;
  setToDate: (value: Date | undefined) => void;
}

export interface BankTransferFormProps {
  getBankAccountLoading: boolean;
  addBankTransferLoading: boolean;
  form: UseFormReturn<BankTransferFormData>;
  handleSubmit: SubmitHandler<BankTransferFormData>;
}

export interface BankTransferTableProps {
  loading: boolean;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeleteBankTransfer: () => void;
  deleteBankTransferLoading: boolean;
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

export interface BankTransferTableData {
  Id: number;
  Trans_Date: string;
  Vouch_No: string;
  Ref_Vouch_No: string;
  Particular: string;
  Amount: string;
}
