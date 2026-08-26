import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface OrderBookFormData {
  fromDate: Date;
  toDate: Date;
  partyId: string;
}

export interface OrderBookProps {
  getOrderBookLoading: boolean;
  form: UseFormReturn<OrderBookFormData>;
  handleSubmit: SubmitHandler<OrderBookFormData>;
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

export interface OrderBookFormProps {
  getOrderBookLoading: boolean;
  form: UseFormReturn<OrderBookFormData>;
  handleSubmit: SubmitHandler<OrderBookFormData>;
  orderBookData: OrderBookTableData[];
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  handleSearchOrderParty: () => void;
  handleScrollOrderParty: () => void;
  orderPartyInput: string;
  setOrderPartyInput: Dispatch<SetStateAction<string>>;
  getOrderPartyLoading: boolean;
}

export interface OrderBookTableProps {
  loading: boolean;
  orderBookData: OrderBookTableData[];
}

export interface PreviewModalProps {
  orderBookData: OrderBookTableData[];
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  orderBookData: OrderBookTableData[];
  fromDate: string;
  toDate: string;
}

export interface OrderBookTableData {
  Id: number;
  Order_Date: string;
  Order_No: string;
  Party_Name: string;
  Design_Name: string;
  Order_Qnty: string;
  Order_Amount: string;
  Order_Type: string;
}
