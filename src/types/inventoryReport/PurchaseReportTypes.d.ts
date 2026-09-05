import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface PurchaseReportFormData {
  fromDate: Date;
  toDate: Date;
  partyId: string;
}

export interface PurchaseReportProps {
  getPurchaseReportLoading: boolean;
  form: UseFormReturn<PurchaseReportFormData>;
  handleSubmit: SubmitHandler<PurchaseReportFormData>;
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

export interface PurchaseReportFormProps {
  getPurchaseReportLoading: boolean;
  form: UseFormReturn<PurchaseReportFormData>;
  handleSubmit: SubmitHandler<PurchaseReportFormData>;
  purchaseReportData: PurchaseReportTableData[];
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  handleSearchOrderParty: () => void;
  handleScrollOrderParty: () => void;
  orderPartyInput: string;
  setOrderPartyInput: Dispatch<SetStateAction<string>>;
  getOrderPartyLoading: boolean;
}

export interface PurchaseReportTableProps {
  loading: boolean;
  purchaseReportData: PurchaseReportTableData[];
}

export interface PreviewModalProps {
  purchaseReportData: PurchaseReportTableData[];
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  purchaseReportData: PurchaseReportTableData[];
  fromDate: string;
  toDate: string;
}

export interface PurchaseReportTableData {
  Id: number;
  Purchase_Date: string;
  Purchase_No: string;
  Party_Name: string;
  Amount: string;
  Item_Data: {
    Item_Id: number;
    Item_Name: string;
    Qnty: string;
    Item_Rate: string;
  }[];
}
