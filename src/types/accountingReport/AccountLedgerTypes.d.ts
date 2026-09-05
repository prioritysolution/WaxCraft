import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface AccountLedgerFormData {
  fromDate: Date;
  toDate: Date;
  ledgerId: string;
}

export interface AccountLedgerProps {
  getAccountLedgerLoading: boolean;
  form: UseFormReturn<AccountLedgerFormData>;
  handleSubmit: SubmitHandler<AccountLedgerFormData>;
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  fromDate: string;
  toDate: string;
  ledgerId: string;
  handleSearchAccountLedger: () => void;
  handleScrollAccountLedger: () => void;
  accountLedgerInput: string;
  setAccountLedgerInput: Dispatch<SetStateAction<string>>;
  getAccountLedgerListLoading: boolean;
}

export interface AccountLedgerFormProps {
  getAccountLedgerLoading: boolean;
  form: UseFormReturn<AccountLedgerFormData>;
  handleSubmit: SubmitHandler<AccountLedgerFormData>;
  accountLedgerData: AccountLedgerTableData[];
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  handleSearchAccountLedger: () => void;
  handleScrollAccountLedger: () => void;
  accountLedgerInput: string;
  setAccountLedgerInput: Dispatch<SetStateAction<string>>;
  getAccountLedgerListLoading: boolean;
}

export interface AccountLedgerTableProps {
  accountLedgerData: AccountLedgerTableData[];
}

export interface PreviewModalProps {
  accountLedgerData: AccountLedgerTableData[];
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  accountLedgerData: AccountLedgerTableData[];
  fromDate: string;
  toDate: string;
  ledgerId: string;
}

export interface AccountLedgerTableData {
  Trans_Id: number;
  Trans_Date: string;
  Vouch_No: string;
  Particular: string;
  Debit: string;
  Credit: string;
  Balance: string;
  Balance_Type: string;
}
