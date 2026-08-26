import { Dispatch, SetStateAction } from "react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";

// Define the types for form data and API response
export interface SizeColourFormData {
  categoryId: string;
  modelId: string;
  sizeId: string;
  colourId: string;
}

// Define the structure of the body you expect for the SizeColour API (adjust based on your API's requirements)
export interface SizeColourBody {
  org_id: number | null;
  col_id?: number;
  cat_id: string;
  mod_id: string;
  size_id: string;
  color_name: string;
}

export interface SizeColourProps {
  addSizeColourLoading: boolean;
  updateSizeColourLoading: boolean;
  loading: boolean;
  form: UseFormReturn<SizeColourFormData>;
  handleSubmit: SubmitHandler<SizeColourFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: SizeColourTableData | null;
  handleEditData: (data: SizeColourTableData) => void;
  categoryId: string;
  modelId: string;
  handleSearchCategory: () => void;
  handleScrollCategory: () => void;
  getCategoryLoading: boolean;
  getModelLoading: boolean;
  getSizeLoading: boolean;
  categoryInput: string;
  setCategoryInput: Dispatch<SetStateAction<string>>;
  colourOptions: { Id: string | number; Color_Name?: string; Colour_Name?: string }[];
  getColourLoading: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  sizeColourTableInput: string;
  handleFilterTableData: (value: string) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteSizeColour: () => void;
  deleteSizeColourLoading: boolean;
  deleteWarning: string | null;
  totalCount: number;
}

export interface SizeColourFormProps {
  addSizeColourLoading: boolean;
  updateSizeColourLoading: boolean;
  form: UseFormReturn<SizeColourFormData>;
  handleSubmit: SubmitHandler<SizeColourFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: SizeColourTableData | null;
  categoryId: string;
  modelId: string;
  handleSearchCategory: () => void;
  handleScrollCategory: () => void;
  getCategoryLoading: boolean;
  getModelLoading: boolean;
  getSizeLoading: boolean;
  categoryInput: string;
  setCategoryInput: Dispatch<SetStateAction<string>>;
  colourOptions: { Id: string | number; Color_Name?: string; Colour_Name?: string }[];
  getColourLoading: boolean;
}

export interface SizeColourTableProps {
  loading: boolean;
  handleEditData: (data: SizeColourTableData) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  sizeColourTableInput: string;
  handleFilterTableData: (value: string) => void;
  colourOptions: { Id: string | number; Color_Name?: string; Colour_Name?: string }[];
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteSizeColour: () => void;
  deleteSizeColourLoading: boolean;
  deleteWarning: string | null;
}

export interface SizeColourTableData {
  Id: number;
  Cat_Id: number;
  Mod_Id: number;
  Size_Id: number;
  Color_Id?: number | string;
  Colour_Id?: number | string;
  Color_Name: string;
  Colour_Name?: string;
  Cat_Name: string;
  Model_Sh_Name: string;
  Size_Name: string;
}
