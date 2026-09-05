import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { PartyFormData } from "../master/PartyTypes";
import { SetStateAction } from "react";
import { string } from "yup";

// Define the types for form data and API response
export interface OrderBookingFormData {
  orderDate: Date;
  partyId: string;
  address: string;
  mobileNo: string;
  gstin: string;
  designId: string;
  designName: string;
  designNo: string;
  wt: string;
  wtRate: string;
  polish: string;
  image: string;
  itemType: string;
  item: {
    designId: string;
    itemId: string;
    itemGl: string;
    itemName: string;
    itemShName: string;
    itemQuantity: string;
    itemRate: string;
    makingRate: string;
    itemTotal: string;
  }[]; // Add 'item' as an array of objects with 'rate' and 'total'
  totalRate: string;
  orderQuantity: string;
}

// Define the structure of the body you expect for the OrderBooking API (adjust based on your API's requirements)
interface OrderBookingBody {
  org_id: number | null;
  order_id?: number;
  ord_date: string;
  party_id: string;
  is_own: string;
  year_id: number | null;
  order_array: {
    design_id: string | number | null;
    qnty: string | null;
    wt_rate: string | null;
    tot_wt: string | number | null;
    polish_rate: string | null;
    tot_polish: string | number | null;
    qnty_rate: string | null;
    item_id: string | null;
    Item_Gl: number | string | null;
    item_qnty: string | number | null;
    item_rate: string | null;
    item_tot: string | number | null;
    wt: string | number | null;
    item_grand_tot: string | number | null;
    making_rate: string | null;
  }[];
}

export interface OrderBookingProps {
  addOrderBookingLoading: boolean;
  deleteOrderBookingLoading: boolean;
  loading: boolean;
  form: UseFormReturn<OrderBookingFormData>;
  handleSubmit: SubmitHandler<OrderBookingFormData>;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  addPartyLoading: boolean;
  partyForm: UseFormReturn<PartyFormData>;
  handlePartySubmit: SubmitHandler<PartyFormData>;
  handleShowPartyForm: () => void;
  showDesignDialog: boolean;
  setShowDesignDialog: Dispatch<SetStateAction<boolean>>;
  handleAddDesign: () => void;
  orderTableData: OrderTableData[];
  handleDeleteOrderTableData: (id: number) => void;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeleteOrder: () => void;
  handleSearchOrderParty: () => void;
  handleScrollOrderParty: () => void;
  handleSearchOrderDesign: () => void;
  handleScrollOrderDesign: () => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  orderPartyInput: string;
  setOrderPartyInput: Dispatch<SetStateAction<string>>;
  orderDesignInput: string;
  setOrderDesignInput: Dispatch<SetStateAction<string>>;
  getPartyLedgerLoading: boolean;
  getOrderPartyLoading: boolean;
  getOrderDesignLoading: boolean;
}

export interface OrderBookingFormProps {
  addOrderBookingLoading: boolean;
  isOpen: boolean;
  form: UseFormReturn<OrderBookingFormData>;
  handleSubmit: SubmitHandler<OrderBookingFormData>;
  handleShowPartyForm: () => void;
  orderTableData: OrderTableData[];
  handleDeleteOrderTableData: (id: number) => void;
  handleSearchOrderParty: () => void;
  handleScrollOrderParty: () => void;
  handleSearchOrderDesign: () => void;
  handleScrollOrderDesign: () => void;
  orderPartyInput: string;
  setOrderPartyInput: Dispatch<SetStateAction<string>>;
  orderDesignInput: string;
  setOrderDesignInput: Dispatch<SetStateAction<string>>;
  getOrderPartyLoading: boolean;
  getOrderDesignLoading: boolean;
}

export interface OrderBookingTableProps {
  loading: boolean;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeleteOrder: () => void;
  deleteOrderBookingLoading: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
}

export interface DesignModalProps {
  form: UseFormReturn<OrderBookingFormData>;
  showDesignDialog: boolean;
  setShowDesignDialog: Dispatch<SetStateAction<boolean>>;
  handleAddDesign: () => void;
  setDesignInput: Dispatch<SetStateAction<string>>;
}

export interface OrderBookingTableData {
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

export interface OrderTableData {
  designId: number;
  designName: string;
  designNo: string;
  orderQuantity: string;
  designRate: string;
  totalRate: string;
  wt: string;
  wtRate: string;
  polish: string;
  image: string;
}
