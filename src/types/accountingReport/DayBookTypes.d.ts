import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface DayBookFormData {
  asOnDate: Date;
}

export interface DayBookProps {
  getDayBookLoading: boolean;
  form: UseFormReturn<DayBookFormData>;
  handleSubmit: SubmitHandler<DayBookFormData>;
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  asOnDate: string;
}

export interface DayBookFormProps {
  getDayBookLoading: boolean;
  form: UseFormReturn<DayBookFormData>;
  handleSubmit: SubmitHandler<DayBookFormData>;
  dayBookData: DayBookTableData[];
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
}

export interface DayBookTableProps {
  dayBookData: DayBookTableData[];
  totalReceiptCash: number;
  totalReceiptTransfer: number;
  totalReceiptTotal: number;
  totalPaymentCash: number;
  totalPaymentTransfer: number;
  totalPaymentTotal: number;
}

export interface PreviewModalProps {
  dayBookData: DayBookTableData[];
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  dayBookData: DayBookTableData[];
  asOnDate: string;
  totalReceiptCash: number;
  totalReceiptTransfer: number;
  totalReceiptTotal: number;
  totalPaymentCash: number;
  totalPaymentTransfer: number;
  totalPaymentTotal: number;
}

export interface DayBookTableData {
  Id: number;
  Opening_Cash: string;
  Receipt_Data: {
    Vouch_No: number;
    Ledger_Name: string;
    Cash_Amt: string;
    Trf_Amt: string;
    Tot_Amt: string;
  }[];
  Payment_Data: {
    Vouch_No: number;
    Ledger_Name: string;
    Cash_Amt: string;
    Trf_Amt: string;
    Tot_Amt: string;
  }[];
  Closing_Cash: string;
}
