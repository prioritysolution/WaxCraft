import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { PartyFormData } from "../master/PartyTypes";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface BankDepositFormData {
  depositDate: Date;
  particular: string;
  manualVoucherNo: string;
  bankId: string;
  availableBalance: string;
  amount: string;
}

// Define the structure of the body you expect for the BankDeposit API (adjust based on your API's requirements)
interface BankDepositBody {
  org_id: number | null;
  year_id: number | null;
  trans_date: string;
  bank_id: string;
  particular: string;
  amount: string;
  ref_vouch: string;
}

export interface BankDepositProps {
  addBankDepositLoading: boolean;
  deleteBankDepositLoading: boolean;
  loading: boolean;
  form: UseFormReturn<BankDepositFormData>;
  handleSubmit: SubmitHandler<BankDepositFormData>;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeleteBankDeposit: () => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  getBankAccountLoading: boolean;
}

export interface BankDepositFormProps {
  addBankDepositLoading: boolean;
  form: UseFormReturn<BankDepositFormData>;
  handleSubmit: SubmitHandler<BankDepositFormData>;
  getBankAccountLoading: boolean;
}

export interface BankDepositTableProps {
  loading: boolean;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeleteBankDeposit: () => void;
  deleteBankDepositLoading: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
}

export interface BankDepositTableData {
  Id: number;
  Trans_Date: string;
  Vouch_No: string;
  Ref_Vouch_No: string;
  Particular: string;
  Amount: string;
}
