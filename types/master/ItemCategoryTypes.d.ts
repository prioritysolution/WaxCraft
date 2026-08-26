import { Dispatch, SetStateAction } from "react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";

export interface ItemCategoryFormData {
  categoryName: string;
}

interface ItemCategoryBody {
  org_id: number | null;
  cat_id?: number;
  cat_name: string;
}

export interface ItemCategoryProps {
  addItemCategoryLoading: boolean;
  updateItemCategoryLoading: boolean;
  loading: boolean;
  form: UseFormReturn<ItemCategoryFormData>;
  handleSubmit: SubmitHandler<ItemCategoryFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: ItemCategoryTableData | null;
  handleEditData: (data: ItemCategoryTableData) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteItemCategory: () => void;
  deleteItemCategoryLoading: boolean;
  deleteWarning: string | null;
  totalCount: number;
}

export interface ItemCategoryFormProps {
  addItemCategoryLoading: boolean;
  updateItemCategoryLoading: boolean;
  form: UseFormReturn<ItemCategoryFormData>;
  handleSubmit: SubmitHandler<ItemCategoryFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: ItemCategoryTableData | null;
}

export interface ItemCategoryTableProps {
  loading: boolean;
  handleEditData: (data: ItemCategoryTableData) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteItemCategory: () => void;
  deleteItemCategoryLoading: boolean;
  deleteWarning: string | null;
}

export interface ItemCategoryTableData {
  Id: number;
  Cat_Name: string;
}
