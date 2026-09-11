import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { PartyFormData } from "../master/PartyTypes";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface SalesVoucherFormData {
  partyName: string;
  invoiceDate: Date;
  partyId: string;
  gstChoice: string;
  gstAmount: string;
  bankId: string;
  transMode: string;
}

// Define the structure of the body you expect for the SalesVoucher API (adjust based on your API's requirements)
interface SalesVoucherBody {
  org_id: number | null;
  sales_date: string;
  party_id: string;
  tot_amount: string | number;
  gst_rate: string;
  tot_cgst: number;
  tot_sgst: number;
  tot_igst: number;
  tot_round: string | number;
  tot_discount: string;
  year_id: number | null;
  is_credit: number | null;
  invoise_data: {
    design_id: string | number | null;
    qnty: string | null;
    wt: string | null;
    wt_rate: string | null;
    tot_wt: string | number | null;
    polish_rate: string | null;
    tot_polish: string | number | null;
    item_id: string | number | null;
    item_qnty: string | number | null;
    item_rate: string | null;
    item_tot: string | number | null;
    making_rate: string | number | null;
  }[];
  bank_id: string | null;
}

export interface SalesVoucherProps {
  loading: boolean;
  deleteInvoiceLoading: boolean;
  handleSalesVoucherProcess: () => void;
  form: UseFormReturn<SalesVoucherFormData>;
  tabSelected: string;
  setTabSelected: Dispatch<SetStateAction<string>>;
  parentSelected: boolean;
  setParentSelected: Dispatch<SetStateAction<boolean>>;
  selected: SalesVoucherTableData[];
  handleIsSelected: (data: SalesVoucherTableData) => void;
  partyId: string;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeleteInvoiceData: () => void;
  showInvoiceDialog: boolean;
  setShowInvoiceDialog: Dispatch<SetStateAction<boolean>>;
  handleShowInvoiceDialog: (id: number) => void;
  handleSearchOrderParty: () => void;
  handleScrollOrderParty: () => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  orderPartyInput: string;
  setOrderPartyInput: Dispatch<SetStateAction<string>>;
}

interface SalesVoucherFormProps {
  form: UseFormReturn<SalesVoucherFormData>;
  handleSalesVoucherProcess: () => void;
  parentSelected: boolean;
  setParentSelected: Dispatch<SetStateAction<boolean>>;
  selected: SalesVoucherTableData[];
  handleIsSelected: (data: SalesVoucherTableData) => void;
  partyId: string;
  handleSearchOrderParty: () => void;
  handleScrollOrderParty: () => void;
  orderPartyInput: string;
  setOrderPartyInput: Dispatch<SetStateAction<string>>;
}

export interface SalesVoucherProcessProps {
  addSalesVoucherLoading: boolean;
  form: UseFormReturn<SalesVoucherFormData>;
}

export interface SalesVoucherTableProps {
  parentSelected: boolean;
  setParentSelected: Dispatch<SetStateAction<boolean>>;
  selected: SalesVoucherTableData[];
  handleIsSelected: (data: SalesVoucherTableData) => void;
}

export interface InvoiceTableProps {
  loading: boolean;
  deleteInvoiceLoading: boolean;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeleteInvoiceData: () => void;
  showInvoiceDialog: boolean;
  setShowInvoiceDialog: Dispatch<SetStateAction<boolean>>;
  handleShowInvoiceDialog: (id: number) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
}

interface InvoiceModalProps {
  showInvoiceDialog: boolean;
  setShowInvoiceDialog: Dispatch<SetStateAction<boolean>>;
}

export interface SalesVoucherTableData {
  Id: number;
  Order_Date: string;
  Order_No: string;
  Party_Name: string;
  Party_Id: number;
  Total_Order: string;
  Order_Status: string;
  DesignRow: {
    Design_Id: number;
    Design_Name: string;
    Design_No: string;
    Order_Qnty: string;
    Design_Rate: string;
    Wt: string;
    Wt_Rate: string;
    Tot_Wt: string;
    Polish: string;
    Tot_Polish: string;
    Image: string;
    ItemRow: {
      Item_Id: number;
      Item_Name: string;
      Item_Qnty: string;
      Item_Rate: string;
      Making_Rate: string;
      Item_Tot: string;
    }[];
  }[];
}

export interface InvoiceTableData {
  Id: number;
  Sale_Date: string;
  Sale_No: string;
  Party_Name: string;
  Party_Id: number;
  Party_Add: string;
  Party_Mob: string;
  Party_GST: string;
  Tot_Amount: string;
  CGST_Rate: number;
  Tot_CGST: string;
  SGST_Rate: number;
  Tot_SGST: string;
  Tot_IGST: string;
  Tot_Round: string;
  Tot_Disc: string;
  DesignRow: {
    Design_Id: number;
    Design_Name: string;
    Design_No: string;
    Order_Qnty: string;
    Design_Rate: string;
    Wt: string;
    Wt_Rate: string;
    Tot_Wt: string;
    Polish: string;
    Tot_Polish: string;
    Image: string;
    ItemRow: {
      Item_Id: number;
      Item_Name: string;
      Item_Qnty: string;
      Item_Rate: string;
      Making_Rate: string;
      Item_Tot: string;
    }[];
  }[];
}

export interface InvoiceListData {
  Id: number;
  Sales_Date: string;
  Sales_No: string;
  Party_Name: string;
  Party_Add: string;
  Party_Gst: string;
  Party_Mob: string;
}
