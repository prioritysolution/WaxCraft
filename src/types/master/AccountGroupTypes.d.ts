import { Dispatch, SetStateAction } from "react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";

// Define the types for form data and API response
export interface AccountGroupFormData {
  headName: string;
  underHeadId: string;
}

// Define the structure of the body you expect for the AccountGroup API (adjust based on your API's requirements)
interface AccountGroupBody {
  org_id: number | null;
  head_id?: number;
  head_name: string;
  under_head: string;
}

export interface AccountGroupProps {
  addAccountGroupLoading: boolean;
  updateAccountGroupLoading: boolean;
  loading: boolean;
  form: UseFormReturn<AccountGroupFormData>;
  handleSubmit: SubmitHandler<AccountGroupFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: AccountGroupTableData | null;
  handleEditData: (data: AccountGroupTableData) => void;
  handleSearchMainHead: () => void;
  handleScrollMainHead: () => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  mainHeadInput: string;
  setMainHeadInput: Dispatch<SetStateAction<string>>;
  getMainHeadLoading: boolean;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteAccountGroup: () => void;
  deleteAccountGroupLoading: boolean;
  deleteWarning: string | null;
  totalCount: number;
}

export interface AccountGroupFormProps {
  addAccountGroupLoading: boolean;
  updateAccountGroupLoading: boolean;
  form: UseFormReturn<AccountGroupFormData>;
  handleSubmit: SubmitHandler<AccountGroupFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: AccountGroupTableData | null;
  handleSearchMainHead: () => void;
  handleScrollMainHead: () => void;
  mainHeadInput: string;
  setMainHeadInput: Dispatch<SetStateAction<string>>;
  getMainHeadLoading: boolean;
}

export interface AccountGroupTableProps {
  loading: boolean;
  handleEditData: (data: AccountGroupTableData) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteAccountGroup: () => void;
  deleteAccountGroupLoading: boolean;
  deleteWarning: string | null;
}

export interface AccountMainHeadData {
  Id: number;
  Head_Name: string;
}

export interface AccountGroupTableData {
  Id: number;
  Main_Head: number;
  Head_Name: string;
  Sub_Head_Name: string;
}
