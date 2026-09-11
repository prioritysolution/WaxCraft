import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface BankLedgerFormData {
  fromDate: Date;
  toDate: Date;
  bankId: string;
}

export interface BankLedgerProps {
  getBankLedgerLoading: boolean;
  form: UseFormReturn<BankLedgerFormData>;
  handleSubmit: SubmitHandler<BankLedgerFormData>;
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  fromDate: string;
  toDate: string;
  getBankAccountLoading: boolean;
}

export interface BankLedgerFormProps {
  getBankLedgerLoading: boolean;
  form: UseFormReturn<BankLedgerFormData>;
  handleSubmit: SubmitHandler<BankLedgerFormData>;
  bankLedgerData: BankLedgerTableData[];
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  getBankAccountLoading: boolean;
}

export interface BankLedgerTableProps {
  bankLedgerData: BankLedgerTableData[];
}

export interface PreviewModalProps {
  bankLedgerData: BankLedgerTableData[];
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  bankLedgerData: BankLedgerTableData[];
  fromDate: string;
  toDate: string;
}

export interface BankLedgerTableData {
  Id: number;
  Bank_Name: string;
  Branch_Name: string;
  Bank_IFSC: string;
  Account_No: string;
  Transaction_Data: {
    Trans_Date: string;
    Particular: string;
    Debit: string;
    Credit: string;
    Balance: string;
    Balance_Type: string;
  }[];
}
