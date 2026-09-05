import { Dispatch, SetStateAction } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

export interface ItemColourFormData {
  colourName: string;
}

export interface ItemColourBody {
  org_id: number | null;
  color_id?: number;
  color_name: string;
}

export interface ItemColourProps {
  addItemColourLoading: boolean;
  updateItemColourLoading: boolean;
  loading: boolean;
  form: UseFormReturn<ItemColourFormData>;
  handleSubmit: SubmitHandler<ItemColourFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: ItemColourTableData | null;
  handleEditData: (data: ItemColourTableData) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  colourTableInput: string;
  handleFilterTableData: (value: string) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteItemColour: () => void;
  deleteItemColourLoading: boolean;
  deleteWarning: string | null;
  totalCount: number;
}

export interface ItemColourFormProps {
  addItemColourLoading: boolean;
  updateItemColourLoading: boolean;
  form: UseFormReturn<ItemColourFormData>;
  handleSubmit: SubmitHandler<ItemColourFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: ItemColourTableData | null;
}

export interface ItemColourTableProps {
  loading: boolean;
  handleEditData: (data: ItemColourTableData) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  colourTableInput: string;
  handleFilterTableData: (value: string) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteItemColour: () => void;
  deleteItemColourLoading: boolean;
  deleteWarning: string | null;
}

export interface ItemColourTableData {
  Id: number;
  Color_Name?: string;
  Colour_Name?: string;
}
