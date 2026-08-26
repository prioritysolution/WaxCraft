import { Dispatch, SetStateAction } from "react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";

// Define the types for form data and API response
export interface ItemFormData {
  categoryId: string;
  modelId: string;
  sizeId: string;
  colourId: string;
  itemName: string;
  itemShortName: string;
  unitId: string;
  purchaseLedgerId: string;
  salesLedgerId: string;
  cgst: string;
  sgst: string;
  igst: string;
  purchaseRate: string;
  salesRate: string;
  openingQuantity: string;
  openingRate: string;
  total: string;
}

// Define the structure of the body you expect for the Item API (adjust based on your API's requirements)
interface ItemBody {
  org_id: number | null;
  item_id?: number;
  open_date: string;
  cat_id: string;
  item_name: string;
  item_sh_name: string;
  item_unit: string;
  pur_ledg: string;
  sales_ledg: string;
  cgst: string;
  sgst: string;
  igst: string;
  pur_rate: string;
  sales_rate: string;
  open_qnty: string;
  item_rate: string;
  item_mod: string;
  item_size: string;
  item_color: string;
}

export interface ItemProps {
  addItemLoading: boolean;
  updateItemLoading: boolean;
  loading: boolean;
  form: UseFormReturn<ItemFormData>;
  handleSubmit: SubmitHandler<ItemFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: ItemTableData | null;
  handleEditData: (data: ItemTableData) => void;
  categoryId: string;
  modelId: string;
  sizeId: string;
  colourId: string;
  itemTableInput: string;
  handleFilterTableData: (value: string) => void;
  handleSearchCategory: () => void;
  handleScrollCategory: () => void;
  handleSearchPurchaseLedger: () => void;
  handleScrollPurchaseLedger: () => void;
  handleSearchSalesLedger: () => void;
  handleScrollSalesLedger: () => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  categoryInput: string;
  setCategoryInput: Dispatch<SetStateAction<string>>;
  purchaseLedgerInput: string;
  setPurchaseLedgerInput: Dispatch<SetStateAction<string>>;
  salesLedgerInput: string;
  setSalesLedgerInput: Dispatch<SetStateAction<string>>;
  getPurchaseLedgerLoading: boolean;
  getSalesLedgerLoading: boolean;
  getCategoryLoading: boolean;
  getModelLoading: boolean;
  getSizeLoading: boolean;
  getColourLoading: boolean;
  getUnitLoading: boolean;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteItem: () => void;
  deleteItemLoading: boolean;
  deleteWarning: string | null;
  totalCount: number;
}

export interface ItemFormProps {
  addItemLoading: boolean;
  updateItemLoading: boolean;
  form: UseFormReturn<ItemFormData>;
  handleSubmit: SubmitHandler<ItemFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: ItemTableData | null;
  categoryId: string;
  modelId: string;
  sizeId: string;
  colourId: string;
  handleSearchCategory: () => void;
  handleScrollCategory: () => void;
  handleSearchPurchaseLedger: () => void;
  handleScrollPurchaseLedger: () => void;
  handleSearchSalesLedger: () => void;
  handleScrollSalesLedger: () => void;
  categoryInput: string;
  setCategoryInput: Dispatch<SetStateAction<string>>;
  purchaseLedgerInput: string;
  setPurchaseLedgerInput: Dispatch<SetStateAction<string>>;
  salesLedgerInput: string;
  setSalesLedgerInput: Dispatch<SetStateAction<string>>;
  getPurchaseLedgerLoading: boolean;
  getSalesLedgerLoading: boolean;
  getCategoryLoading: boolean;
  getModelLoading: boolean;
  getSizeLoading: boolean;
  getColourLoading: boolean;
  getUnitLoading: boolean;
}

export interface ItemTableProps {
  loading: boolean;
  handleEditData: (data: ItemTableData) => void;
  itemTableInput: string;
  handleFilterTableData: (value: string) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteItem: () => void;
  deleteItemLoading: boolean;
  deleteWarning: string | null;
}

export interface ItemTableData {
  Id: number;
  Cat_Id: numberl;
  Model_Id: number | null;
  Size_Id: number | null;
  Color_Id: number | null;
  Item_Name: string;
  Item_Sh_Name: string;
  Unit_Id: number;
  Purchase_Gl: number;
  Sales_Gl: number;
  CGST: string;
  SGST: string;
  IGST: string;
  Pur_Rate: string;
  Sale_Rate: string;
  Cat_Name: string;
  Open_Qnty: string;
  Item_Rate: string;
}
