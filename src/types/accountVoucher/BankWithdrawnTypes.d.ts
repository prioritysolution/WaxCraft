import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { PartyFormData } from "../master/PartyTypes";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface BankWithdrawnFormData {
  withdrawnDate: Date;
  particular: string;
  manualVoucherNo: string;
  bankId: string;
  availableBalance: string;
  amount: string;
}

// Define the structure of the body you expect for the BankWithdrawn API (adjust based on your API's requirements)
interface BankWithdrawnBody {
  org_id: number | null;
  year_id: number | null;
  trans_date: string;
  bank_id: string;
  particular: string;
  amount: string;
  ref_vouch: string;
}

export interface BankWithdrawnProps {
  addBankWithdrawnLoading: boolean;
  deleteBankWithdrawnLoading: boolean;
  loading: boolean;
  form: UseFormReturn<BankWithdrawnFormData>;
  handleSubmit: SubmitHandler<BankWithdrawnFormData>;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeleteBankWithdrawn: () => void;
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

export interface BankWithdrawnFormProps {
  getBankAccountLoading: boolean;
  addBankWithdrawnLoading: boolean;
  form: UseFormReturn<BankWithdrawnFormData>;
  handleSubmit: SubmitHandler<BankWithdrawnFormData>;
}

export interface BankWithdrawnTableProps {
  loading: boolean;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeleteBankWithdrawn: () => void;
  deleteBankWithdrawnLoading: boolean;
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

export interface BankWithdrawnTableData {
  Id: number;
  Trans_Date: string;
  Vouch_No: string;
  Ref_Vouch_No: string;
  Particular: string;
  Amount: string;
}
