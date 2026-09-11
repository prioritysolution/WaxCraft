import { Dispatch, SetStateAction } from "react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";

// Define the types for form data and API response
export interface PartyFormData {
  partyType: string;
  partyName: string;
  address: string;
  mobileNo: string;
  email: string;
  gstin: string;
  underLedger: string;
  openingBalance: string;
}

// Define the structure of the body you expect for the Party API (adjust based on your API's requirements)
interface PartyBody {
  org_id: number | null;
  party_id?: number;
  party_type: string;
  party_Name: string;
  party_add: string;
  party_mob: string;
  under_ledger: string;
  open_balance: string;
  party_mail: string;
  party_gst: string;
}

export interface PartyProps {
  addPartyLoading: boolean;
  updatePartyLoading: boolean;
  loading: boolean;
  form: UseFormReturn<PartyFormData>;
  handleSubmit: SubmitHandler<PartyFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: PartyTableData | null;
  handleEditData: (data: PartyTableData) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  partyTableInput: string;
  handleFilterTableData: (value: string) => void;
  getPartyLedgerLoading: boolean;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteParty: () => void;
  deletePartyLoading: boolean;
  deleteWarning: string | null;
  totalCount: number;
}

export interface PartyFormProps {
  addPartyLoading: boolean;
  updatePartyLoading?: boolean;
  form: UseFormReturn<PartyFormData>;
  handleSubmit: SubmitHandler<PartyFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData?: PartyTableData | null;
  getPartyLedgerLoading: boolean;
}

export interface PartyTableProps {
  loading: boolean;
  handleEditData: (data: PartyTableData) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  partyTableInput: string;
  handleFilterTableData: (value: string) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteParty: () => void;
  deletePartyLoading: boolean;
  deleteWarning: string | null;
}

export interface PartyTableData {
  Id: number;
  Party_Tp: string;
  Party_Type: number;
  Party_Name: string;
  Party_Add: string;
  Party_Mob: string;
  Party_Mail: string | null;
  Party_Gst: string | null;
  Ledger_Id: number;
  Open_Bal: string;
}
