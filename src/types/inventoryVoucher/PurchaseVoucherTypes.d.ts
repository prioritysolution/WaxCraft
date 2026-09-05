import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { PartyFormData } from "../master/PartyTypes";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface PurchaseVoucherFormData {
  purchaseType: string;
  orderPurchaseType: string;
  purchaseDate: Date;
  partyId: string;
  purchaseNo: string;
  itemId: string;
  quantity: string;
  rate: string;
  roundOff: string;
  discount: string;
  transMode: string;
  bankId: string;
}

// Define the structure of the body you expect for the PurchaseVoucher API (adjust based on your API's requirements)
export interface PurchaseVoucherBody {
  org_id: number | null;
  pur_date: string;
  pur_no: string;
  party_id: string;
  tot_amount: string | number;
  tot_cgst: number;
  tot_sgst: number;
  tot_igst: number | null;
  tot_round: string | number;
  tot_discount: string | number;
  year_id: number | null;
  is_credit: number | null;
  is_order: number;
  invoise_data: {
    item_id: string | number | null;
    item_gl: string | number | null;
    item_qnty: string | null;
    item_rate: string | number | null;
    item_tot: string | number | null;
    item_cgst: string | number | null;
    item_sgst: string | number | null;
    item_igst: string | number | null;
  }[];
  bank_id: string | null;
}

export interface PurchaseVoucherProps {
  addPurchaseVoucherLoading: boolean;
  deletePurchaseVoucherLoading: boolean;
  loading: boolean;
  form: UseFormReturn<PurchaseVoucherFormData>;
  handleSubmit: SubmitHandler<PurchaseVoucherFormData>;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  handleAddPurchase: () => void;
  purchaseTableData: PurchaseTableData[];
  handleDeletePurchaseTableData: (id: number) => void;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeletePurchase: () => void;
  purchaseType: string;
  handleSearchItem: () => void;
  handleScrollItem: () => void;
  handleSearchPurchaseParty: () => void;
  handleScrollPurchaseParty: () => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  purchasePartyInput: string;
  setPurchasePartyInput: Dispatch<SetStateAction<string>>;
  itemInput: string;
  setItemInput: Dispatch<SetStateAction<string>>;
  orderPurchaseType: string;
  handleOrderPurchaseTypeChange: (value: string) => void;
  showRequisitionModal: boolean;
  setShowRequisitionModal: Dispatch<SetStateAction<boolean>>;
  requisitionLoading: boolean;
  handleAddRequisitionItems: (rows: ItemRequisitionRow[]) => void;
}

export interface PurchaseVoucherFormProps {
  addPurchaseVoucherLoading: boolean;
  form: UseFormReturn<PurchaseVoucherFormData>;
  handleSubmit: SubmitHandler<PurchaseVoucherFormData>;
  purchaseTableData: PurchaseTableData[];
  handleDeletePurchaseTableData: (id: number) => void;
  purchaseType: string;
  handleAddPurchase: () => void;
  handleSearchItem: () => void;
  handleScrollItem: () => void;
  handleSearchPurchaseParty: () => void;
  handleScrollPurchaseParty: () => void;
  purchasePartyInput: string;
  setPurchasePartyInput: Dispatch<SetStateAction<string>>;
  itemInput: string;
  setItemInput: Dispatch<SetStateAction<string>>;
  orderPurchaseType: string;
  handleOrderPurchaseTypeChange: (value: string) => void;
  showRequisitionModal: boolean;
  setShowRequisitionModal: Dispatch<SetStateAction<boolean>>;
  requisitionLoading: boolean;
  handleAddRequisitionItems: (rows: ItemRequisitionRow[]) => void;
}

export interface PurchaseVoucherTableProps {
  loading: boolean;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeletePurchase: () => void;
  deletePurchaseVoucherLoading: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
}

export interface PurchaseTableData {
  purchaseDate: Date;
  partyId: string;
  partyName: string;
  purchaseNo: string;
  itemId: string;
  itemName: string;
  quantity: string;
  rate: string;
  taxableTotal: number;
  cgst: string | number;
  sgst: string | number;
  grandTotal: number;
  itemGl: string | number;
  orderPurchaseType: string;
}

export interface ItemRequisitionRow {
  Id: number | string;
  Item_Id?: number | string;
  Item_Name?: string;
  Item_Qnty?: string | number;
  Qnty?: string | number;
  Quantity?: string | number;
  Item_Rate?: string | number;
  Rate?: string | number;
  Pur_Rate?: string | number;
  Order_No?: string;
  Req_No?: string;
  Party_Name?: string;
  Req_Id?: number | string;
  Purchase_Gl?: string | number;
  Row_Key?: string;
  ItemRow?: ItemRequisitionRow[];
}

export interface RequisitionModalProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  onAddItems: (rows: ItemRequisitionRow[]) => void;
}

export interface PurchaseVoucherTableData {
  Id: number;
  Purchase_Date: string;
  Purchase_No: string;
  Party_Name: string;
  Party_Id: number;
  Total_Amount: string;
  Purchase_Type?: string | number;
  Pur_Type?: string | number;
  Is_Order?: string | number;
  ItemRow: {
    Item_Id: number;
    Item_Name: string;
    Item_Qnty: string;
    Item_Rate: string;
    Item_CGST: string;
    Item_SGST: string;
    Item_IGST: string | null;
  }[];
}
