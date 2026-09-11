import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface CashBookFormData {
  asOnDate: Date;
}

export interface CashBookProps {
  getCashBookLoading: boolean;
  form: UseFormReturn<CashBookFormData>;
  handleSubmit: SubmitHandler<CashBookFormData>;
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  asOnDate: string;
}

export interface CashBookFormProps {
  getCashBookLoading: boolean;
  form: UseFormReturn<CashBookFormData>;
  handleSubmit: SubmitHandler<CashBookFormData>;
  cashBookData: CashBookTableData[];
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
}

export interface CashBookTableProps {
  cashBookData: CashBookTableData[];
  totalReceiptAmount: number;
  totalPaymentAmount: number;
}

export interface PreviewModalProps {
  cashBookData: CashBookTableData[];
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  cashBookData: CashBookTableData[];
  asOnDate: string;
  totalReceiptAmount: number;
  totalPaymentAmount: number;
}

export interface CashBookTableData {
  Id: number;
  Opening_Cash: string;
  Receipt_Data: {
    Vouch_No: string;
    Manual_Voucher: string;
    Ledger_Name: string;
    Particular: string;
    Amount: string;
  }[];
  Payment_Data: {
    Vouch_No: string;
    Manual_Voucher: string;
    Ledger_Name: string;
    Particular: string;
    Amount: string;
  }[];
  Closing_Cash: string;
}
