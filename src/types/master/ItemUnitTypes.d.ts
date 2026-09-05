import { Dispatch, SetStateAction } from "react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";

// Define the types for form data and API response
export interface ItemUnitFormData {
  unitName: string;
}

// Define the structure of the body you expect for the ItemUnit API (adjust based on your API's requirements)
interface ItemUnitBody {
  org_id: number | null;
  unit_id?: number;
  unit_name: string;
}

export interface ItemUnitProps {
  addItemUnitLoading: boolean;
  updateItemUnitLoading: boolean;
  loading: boolean;
  form: UseFormReturn<ItemUnitFormData>;
  handleSubmit: SubmitHandler<ItemUnitFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: ItemUnitTableData | null;
  handleEditData: (data: ItemUnitTableData) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteItemUnit: () => void;
  deleteItemUnitLoading: boolean;
  deleteWarning: string | null;
  totalCount: number;
}

export interface ItemUnitFormProps {
  addItemUnitLoading: boolean;
  updateItemUnitLoading: boolean;
  form: UseFormReturn<ItemUnitFormData>;
  handleSubmit: SubmitHandler<ItemUnitFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: ItemUnitTableData | null;
}

export interface ItemUnitTableProps {
  loading: boolean;
  handleEditData: (data: ItemUnitTableData) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteItemUnit: () => void;
  deleteItemUnitLoading: boolean;
  deleteWarning: string | null;
}

export interface ItemUnitTableData {
  Id: number;
  Unit_Name: string;
}
