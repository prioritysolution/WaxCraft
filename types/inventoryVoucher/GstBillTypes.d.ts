import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { SetStateAction } from "react";
import { string } from "yup";

// Define the types for form data and API response
export interface GstBillFormData {
  date: Date;
  billNo: string;
  partyId: string;
  address: string;
  mobileNo: string;
  gstin: string;
  gstRate: string;
  itemName: string;
  itemUnit: string;
  itemQuantity: string;
  itemRate: string;
  itemHsn: string;
  discount: string;
}

// Define the structure of the body you expect for the GstBill API (adjust based on your API's requirements)
interface GstBillBody {
  org_id: number | null;
  year_id: number | null;
  trans_date: string;
  bill_no: string;
  party_id: string;
  tot_amt: string;
  gst_rate: string;
  cgst_amt: string;
  sgst_amt: string;
  igst_amt: string;
  round_amt: string;
  disc_amt: string;
  invoise_data: ItemData[];
}

interface ItemData {
  item_name: string;
  item_qnty: string;
  item_unit: string;
  item_hsn: string;
  item_rate: string;
  item_tot: string;
}

export interface GstBillProps {
  addGstBillLoading: boolean;
  deleteGstBillLoading: boolean;
  loading: boolean;
  form: UseFormReturn<GstBillFormData>;
  handleSubmit: SubmitHandler<GstBillFormData>;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  itemTableData: ItemTableData[];
  handleDeleteItemTableData: (id: number) => void;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeleteGst: () => void;
  handleSearchOrderParty: () => void;
  handleScrollOrderParty: () => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  orderPartyInput: string;
  setOrderPartyInput: Dispatch<SetStateAction<string>>;
  itemGrandTotal: string;
  itemGst: string;
  itemRoundOff: string;
  handleAddGstBill: () => void;
  showInvoice: boolean;
  setShowInvoice: Dispatch<SetStateAction<boolean>>;
  invoiceData: InvoiceData | null;
  setInvoiceData: Dispatch<SetStateAction<InvoiceData | null>>;
  getOrderPartyLoading: boolean;
  getUnitLoading: boolean;
}

export interface GstBillFormProps {
  addGstBillLoading: boolean;
  form: UseFormReturn<GstBillFormData>;
  handleSubmit: SubmitHandler<GstBillFormData>;
  itemTableData: ItemTableData[];
  handleDeleteItemTableData: (id: number) => void;
  handleSearchOrderParty: () => void;
  handleScrollOrderParty: () => void;
  orderPartyInput: string;
  setOrderPartyInput: Dispatch<SetStateAction<string>>;
  itemGrandTotal: string;
  itemGst: string;
  handleAddGstBill: () => void;
  itemRoundOff: string;
  getOrderPartyLoading: boolean;
  getUnitLoading: boolean;
}

export interface GstBillTableProps {
  loading: boolean;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeleteGst: () => void;
  deleteGstBillLoading: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
}

export interface InvoiceModalProps {
  showInvoice: boolean;
  setShowInvoice: Dispatch<SetStateAction<boolean>>;
  invoiceData: InvoiceData | null;
  setInvoiceData: Dispatch<SetStateAction<InvoiceData | null>>;
}

export interface InvoiceData {
  Sales_Id: 6;
  Sales_Date: string;
  Sales_No: string;
  Party_Name: string;
  Gross_Amt: number;
  Cgst_Rate: number;
  Cgst_Amt: number;
  Sgst_Rate: number;
  Sgst_Amt: number;
  Igst_Amt: number;
  Round_Amt: number;
  Discount: number;
  ItemData: {
    Item_Name: string;
    Item_Qnty: number;
    Item_Unit: string;
    Item_Rate: number;
    Item_Hsn: number;
    Item_Tot: number;
  }[];
}

export interface GstBillTableData {
  Id: number;
}

export interface ItemTableData {
  itemName: string;
  itemUnit: string;
  itemQuantity: string;
  itemRate: string;
  itemHsn: string;
  itemTotal: string;
}
