import { Dispatch, SetStateAction } from "react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";

// Define the types for form data and API response
export interface BankAccountFormData {
  bankName: string;
  branchName: string;
  ifsc: string;
  accountNo: string;
  ledgerId: string;
  openingDate: Date;
  openingBalance: string;
}

// Define the structure of the body you expect for the BankAccount API (adjust based on your API's requirements)
interface BankAccountBody {
  org_id: number | null;
  bank_id?: number;
  bank_name: string;
  branch_Name: string;
  bank_ifsc: string;
  account_no: string;
  ledger_id: string;
  opening_date: string;
  open_banalce: string;
}

export interface BankAccountProps {
  addBankAccountLoading: boolean;
  updateBankAccountLoading: boolean;
  loading: boolean;
  form: UseFormReturn<BankAccountFormData>;
  handleSubmit: SubmitHandler<BankAccountFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: BankAccountTableData | null;
  handleEditData: (data: BankAccountTableData) => void;
  getBankLedgerLoading: boolean;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteBankAccount: () => void;
  deleteBankAccountLoading: boolean;
  deleteWarning: string | null;
  totalCount: number;
}

export interface BankAccountFormProps {
  addBankAccountLoading: boolean;
  updateBankAccountLoading: boolean;
  form: UseFormReturn<BankAccountFormData>;
  handleSubmit: SubmitHandler<BankAccountFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: BankAccountTableData | null;
  getBankLedgerLoading: boolean;
}

export interface BankAccountTableProps {
  loading: boolean;
  handleEditData: (data: BankAccountTableData) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteBankAccount: () => void;
  deleteBankAccountLoading: boolean;
  deleteWarning: string | null;
}

export interface BankAccountTableData {
  Id: number;
  Bank_Name: string;
  Branch_Name: string;
  Bank_IFSC: string;
  Account_No: string;
  Under_Ledger: number;
  Opening_Date: string;
  Opening_Balance: string;
}
