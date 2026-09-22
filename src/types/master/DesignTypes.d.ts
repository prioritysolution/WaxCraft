import { Dispatch, SetStateAction, ChangeEvent } from "react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";

// Define the types for form data and API response
export interface DesignFormData {
  designName: string;
  designNo: string;
  wt: string;
  wtRate: string;
  polish: string;
  ghat: string;
  designImage: any;
  unitId: string;
  categoryId: string;
  itemId: string;
  quantity: string;
  makingRate: string;
}

export interface DesignProps {
  refreshDesignDetails?: (data: DesignTableData) => void | Promise<void>;
  handlePrintDesigns?: () => Promise<DesignTableData[]>;
  printLoading?: boolean;
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
  itemInput: string;
  setItemInput: Dispatch<SetStateAction<string>>;
  getCategoryLoading: boolean;
  getItemLoading: boolean;
  getUnitLoading: boolean;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteDesign: () => void;
  deleteDesignLoading: boolean;
  deleteWarning: string | null;
  totalCount: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
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
  itemInput: string;
  setItemInput: Dispatch<SetStateAction<string>>;
  getCategoryLoading: boolean;
  getItemLoading: boolean;
  getUnitLoading: boolean;
}

export interface DesignTableProps {
  handleEditData: (data: DesignTableData) => void;
  refreshDesignDetails?: (data: DesignTableData) => void | Promise<void>;
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
  onPerPageChange: (perPage: number) => void;
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
  Cat_Id?: number | string | null;
  cat_id?: number | string | null;
  Model_Id?: number | string | null;
  model_id?: number | string | null;
  item_mod?: number | string | null;
  Size_Id?: number | string | null;
  size_id?: number | string | null;
  item_size?: number | string | null;
  Color_Id?: number | string | null;
  color_id?: number | string | null;
  item_color?: number | string | null;
}

export interface DesignTableData {
  Id: number;
  Design_Name: string;
  Design_No: string;
  WT: string;
  Wt_Rate: string;
  Polish: string;
  Ghat?: string;
  Unit_Id?: number | string;
  Design_Unit?: number | string | null;
  Unit_Name?: string;
  image: string;
  File_Name: string;
  childrow: ChildRow[];
}
