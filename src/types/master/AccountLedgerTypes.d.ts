import { Dispatch, SetStateAction } from "react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";

// Define the types for form data and API response
export interface AccountLedgerFormData {
  ledgerName: string;
  underMainHeadId: string;
  underHeadId: string;
  openingBalance: string;
}

// Define the structure of the body you expect for the AccountLedger API (adjust based on your API's requirements)
interface AccountLedgerBody {
  org_id: number | null;
  ledger_id?: number;
  ledger_name: string;
  head_id: string;
  sub_head: string;
  open_balance: string;
}

export interface AccountLedgerProps {
  addAccountLedgerLoading: boolean;
  updateAccountLedgerLoading: boolean;
  loading: boolean;
  form: UseFormReturn<AccountLedgerFormData>;
  handleSubmit: SubmitHandler<AccountLedgerFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: AccountLedgerTableData | null;
  handleEditData: (data: AccountLedgerTableData) => void;
  handleSearchMainHead: () => void;
  handleScrollMainHead: () => void;
  handleSearchHead: () => void;
  handleScrollHead: () => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  ledgerTableInput: string;
  handleFilterTableData: (value: string) => void;
  mainHeadInput: string;
  setMainHeadInput: Dispatch<SetStateAction<string>>;
  headInput: string;
  setHeadInput: Dispatch<SetStateAction<string>>;
  getMainHeadLoading: boolean;
  getHeadLoading: boolean;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteAccountLedger: () => void;
  deleteAccountLedgerLoading: boolean;
  deleteWarning: string | null;
  totalCount: number;
}

export interface AccountLedgerFormProps {
  addAccountLedgerLoading: boolean;
  updateAccountLedgerLoading: boolean;
  form: UseFormReturn<AccountLedgerFormData>;
  handleSubmit: SubmitHandler<AccountLedgerFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: AccountLedgerTableData | null;
  handleSearchMainHead: () => void;
  handleScrollMainHead: () => void;
  handleSearchHead: () => void;
  handleScrollHead: () => void;
  mainHeadInput: string;
  setMainHeadInput: Dispatch<SetStateAction<string>>;
  headInput: string;
  setHeadInput: Dispatch<SetStateAction<string>>;
  getMainHeadLoading: boolean;
  getHeadLoading: boolean;
}

export interface AccountLedgerTableProps {
  loading: boolean;
  handleEditData: (data: AccountLedgerTableData) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  ledgerTableInput: string;
  handleFilterTableData: (value: string) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteAccountLedger: () => void;
  deleteAccountLedgerLoading: boolean;
  deleteWarning: string | null;
}

export interface AccountMainHeadData {
  Id: number;
  Head_Name: string;
}

export interface AccountLedgerTableData {
  Id: number;
  Head_Id: number | null;
  Sub_Head: string | null;
  Ledger_Name: string;
  Open_Balance: string | null;
}
