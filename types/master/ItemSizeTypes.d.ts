import { Dispatch, SetStateAction } from "react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";

// Define the types for form data and API response
export interface ItemSizeFormData {
  categoryId: string;
  modelId: string;
  size: string;
}

// Define the structure of the body you expect for the ItemSize API (adjust based on your API's requirements)
interface ItemSizeBody {
  org_id: number | null;
  size_id?: number;
  cat_id: string;
  model_Id: string;
  size_name: string;
}

export interface ItemSizeProps {
  addItemSizeLoading: boolean;
  updateItemSizeLoading: boolean;
  loading: boolean;
  form: UseFormReturn<ItemSizeFormData>;
  handleSubmit: SubmitHandler<ItemSizeFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: ItemSizeTableData | null;
  handleEditData: (data: ItemSizeTableData) => void;
  categoryId: string;
  handleSearchCategory: () => void;
  handleScrollCategory: () => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  categoryInput: string;
  setCategoryInput: Dispatch<SetStateAction<string>>;
  getItemCategoryLoading: boolean;
  getItemModelLoading: boolean;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteItemSize: () => void;
  deleteItemSizeLoading: boolean;
  deleteWarning: string | null;
  totalCount: number;
}

export interface ItemSizeFormProps {
  addItemSizeLoading: boolean;
  updateItemSizeLoading: boolean;
  form: UseFormReturn<ItemSizeFormData>;
  handleSubmit: SubmitHandler<ItemSizeFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: ItemSizeTableData | null;
  categoryId: string;
  handleSearchCategory: () => void;
  handleScrollCategory: () => void;
  categoryInput: string;
  setCategoryInput: Dispatch<SetStateAction<string>>;
  getItemCategoryLoading: boolean;
  getItemModelLoading: boolean;
}

export interface ItemSizeTableProps {
  loading: boolean;
  handleEditData: (data: ItemSizeTableData) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteItemSize: () => void;
  deleteItemSizeLoading: boolean;
  deleteWarning: string | null;
}

export interface ItemSizeTableData {
  Id: number;
  Cat_Id: number;
  Mod_Id: number;
  Size_Name: string;
  Cat_Name: string;
  Model_Sh_Name: string;
}
