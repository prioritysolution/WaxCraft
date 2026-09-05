import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface TrailorCashbookFormData {
  asOnDate: Date;
  userId: string;
}

export interface TrailorCashbookProps {
  getTrailorCashbookLoading: boolean;
  form: UseFormReturn<TrailorCashbookFormData>;
  handleSubmit: SubmitHandler<TrailorCashbookFormData>;
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  asOnDate: string;
}

export interface TrailorCashbookFormProps {
  getTrailorCashbookLoading: boolean;
  form: UseFormReturn<TrailorCashbookFormData>;
  handleSubmit: SubmitHandler<TrailorCashbookFormData>;
  trailorCashbookData: TrailorCashbookTableData[];
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
}

export interface TrailorCashbookTableProps {
  trailorCashbookData: TrailorCashbookTableData[];
  totalReceiptAmount: number;
  totalPaymentAmount: number;
}

export interface PreviewModalProps {
  trailorCashbookData: TrailorCashbookTableData[];
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  trailorCashbookData: TrailorCashbookTableData[];
  asOnDate: string;
  totalReceiptAmount: number;
  totalPaymentAmount: number;
}

export interface TrailorCashbookTableData {
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
