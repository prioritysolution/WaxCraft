import { Dispatch, SetStateAction } from "react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";

// Define the types for form data and API response
export interface ItemModelFormData {
  categoryId: string;
  modelName: string;
  modelShortName: string;
}

// Define the structure of the body you expect for the ItemModel API (adjust based on your API's requirements)
interface ItemModelBody {
  org_id: number | null;
  model_Id?: number;
  cat_id: string;
  model_name: string;
  model_sh_name: string;
}

export interface ItemModelProps {
  addItemModelLoading: boolean;
  updateItemModelLoading: boolean;
  loading: boolean;
  form: UseFormReturn<ItemModelFormData>;
  handleSubmit: SubmitHandler<ItemModelFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: ItemModelTableData | null;
  handleEditData: (data: ItemModelTableData) => void;
  handleSearchCategory: () => void;
  handleScrollCategory: () => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  getCategoryLoading: boolean;
  categoryInput: string;
  setCategoryInput: Dispatch<SetStateAction<string>>;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteItemModel: () => void;
  deleteItemModelLoading: boolean;
  deleteWarning: string | null;
  totalCount: number;
}

export interface ItemModelFormProps {
  addItemModelLoading: boolean;
  updateItemModelLoading: boolean;
  form: UseFormReturn<ItemModelFormData>;
  handleSubmit: SubmitHandler<ItemModelFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: ItemModelTableData | null;
  handleSearchCategory: () => void;
  handleScrollCategory: () => void;
  getCategoryLoading: boolean;
  categoryInput: string;
  setCategoryInput: Dispatch<SetStateAction<string>>;
}

export interface ItemModelTableProps {
  loading: boolean;
  handleEditData: (data: ItemModelTableData) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteItemModel: () => void;
  deleteItemModelLoading: boolean;
  deleteWarning: string | null;
}

export interface ItemModelTableData {
  Id: number;
  Cat_Id: number;
  Cat_Name: string;
  Model_Name: string;
  Model_Sh_Name: string;
}
