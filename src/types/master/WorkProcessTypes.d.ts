import { Dispatch, SetStateAction } from "react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";

// Define the types for form data and API response
export interface WorkProcessFormData {
  processName: string;
}

// Define the structure of the body you expect for the WorkProcess API (adjust based on your API's requirements)
interface WorkProcessBody {
  org_id: number | null;
  work_id?: number;
  process_name: string;
}

export interface WorkProcessProps {
  addWorkProcessLoading: boolean;
  updateWorkProcessLoading: boolean;
  loading: boolean;
  form: UseFormReturn<WorkProcessFormData>;
  handleSubmit: SubmitHandler<WorkProcessFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: WorkProcessTableData | null;
  handleEditData: (data: WorkProcessTableData) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteWorkProcess: () => void;
  deleteWorkProcessLoading: boolean;
  deleteWarning: string | null;
  totalCount: number;
}

export interface WorkProcessFormProps {
  addWorkProcessLoading: boolean;
  updateWorkProcessLoading: boolean;
  form: UseFormReturn<WorkProcessFormData>;
  handleSubmit: SubmitHandler<WorkProcessFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: WorkProcessTableData | null;
}

export interface WorkProcessTableProps {
  loading: boolean;
  handleEditData: (data: WorkProcessTableData) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteWorkProcess: () => void;
  deleteWorkProcessLoading: boolean;
  deleteWarning: string | null;
}

export interface WorkProcessTableData {
  Id: number;
  Process_Name: string;
}
