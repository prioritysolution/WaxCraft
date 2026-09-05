import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface SalesReportFormData {
  fromDate: Date;
  toDate: Date;
  partyId: string;
}

export interface SalesReportProps {
  getSalesReportLoading: boolean;
  form: UseFormReturn<SalesReportFormData>;
  handleSubmit: SubmitHandler<SalesReportFormData>;
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  fromDate: string;
  toDate: string;
  handleSearchOrderParty: () => void;
  handleScrollOrderParty: () => void;
  orderPartyInput: string;
  setOrderPartyInput: Dispatch<SetStateAction<string>>;
  getOrderPartyLoading: boolean;
}

export interface SalesReportFormProps {
  getSalesReportLoading: boolean;
  form: UseFormReturn<SalesReportFormData>;
  handleSubmit: SubmitHandler<SalesReportFormData>;
  salesReportData: SalesReportTableData[];
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  handleSearchOrderParty: () => void;
  handleScrollOrderParty: () => void;
  orderPartyInput: string;
  setOrderPartyInput: Dispatch<SetStateAction<string>>;
  getOrderPartyLoading: boolean;
}

export interface SalesReportTableProps {
  loading: boolean;
  salesReportData: SalesReportTableData[];
}

export interface PreviewModalProps {
  salesReportData: SalesReportTableData[];
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  salesReportData: SalesReportTableData[];
  fromDate: string;
  toDate: string;
}

export interface SalesReportTableData {
  Id: number;
  Sales_Date: string;
  Sale_No: string;
  Party_Name: string;
  Amount: string;
  Design_Data: {
    Design_Id: number;
    Design_Name: string;
    Qnty: string;
  }[];
}
