import { Dispatch, SetStateAction, ChangeEvent } from "react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";

// Define the types for form data and API response
export interface DesignFormData {
  designName: string;
  designNo: string;
  wt: string;
  wtRate: string;
  polish: string;
  designImage: any;
  categoryId: string;
  itemId: string;
  quantity: string;
  makingRate: string;
}

export interface DesignProps {
  addDesignLoading: boolean;
  updateDesignLoading: boolean;
  loading: boolean;
  form: UseFormReturn<DesignFormData>;
  handleSubmit: SubmitHandler<DesignFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: DesignTableData | null;
  handleEditData: (data: DesignTableData) => void;
  handleDeleteFormTableData: (id: number) => void;
  designFormTableData: any[];
  handleAddDesign: () => void;
  photoPreview: string | undefined;
  handlePhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSearchCategory: () => void;
  handleScrollCategory: () => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  designTableInput: string;
  handleFilterTableData: (value: string) => void;
  categoryInput: string;
  setCategoryInput: Dispatch<SetStateAction<string>>;
  getCategoryLoading: boolean;
  getItemLoading: boolean;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteDesign: () => void;
  deleteDesignLoading: boolean;
  deleteWarning: string | null;
  totalCount: number;
  perPage: number;
}

export interface DesignFormProps {
  addDesignLoading: boolean;
  updateDesignLoading: boolean;
  form: UseFormReturn<DesignFormData>;
  handleSubmit: SubmitHandler<DesignFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: DesignTableData | null;
  designFormTableData: any[];
  handleDeleteFormTableData: (id: number) => void;
  handleAddDesign: () => void;
  photoPreview: string | undefined;
  handlePhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSearchCategory: () => void;
  handleScrollCategory: () => void;
  categoryInput: string;
  setCategoryInput: Dispatch<SetStateAction<string>>;
  getCategoryLoading: boolean;
  getItemLoading: boolean;
}

export interface DesignTableProps {
  handleEditData: (data: DesignTableData) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  designTableInput: string;
  handleFilterTableData: (value: string) => void;
  loading: boolean;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteDesign: () => void;
  deleteDesignLoading: boolean;
  deleteWarning: string | null;
  perPage: number;
}

export interface ChildRow {
  Item_Id: number;
  Qnty?: number;
  Item_Name: string;
  Item_GL?: string;
  Item_Sh_Name: string;
  Item_Rate?: string;
  Item_Total?: string;
  Making_Rate?: string | null;
}

export interface DesignTableData {
  Id: number;
  Design_Name: string;
  Design_No: string;
  WT: string;
  Wt_Rate: string;
  Polish: string;
  image: string;
  File_Name: string;
  childrow: ChildRow[];
}
