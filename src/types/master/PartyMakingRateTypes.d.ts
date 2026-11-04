import { Dispatch, SetStateAction } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

export interface PartyMakingRateFormData {
  partyId: string;
  makingRate: string;
}

export interface PartyMakingRateBody {
  org_id: number | null;
  making_rate_id?: number;
  party_id: string | number;
  making_rate: string;
}

export interface PartyMakingRateTableData {
  Id: number;
  Party_Id: number;
  Party_Name: string;
  Making_Rate: string | number;
}

export interface PartyMakingRatePartyOption {
  Id: number;
  Party_Name: string;
}

export interface PartyMakingRateProps {
  addPartyMakingRateLoading: boolean;
  updatePartyMakingRateLoading: boolean;
  loading: boolean;
  form: UseFormReturn<PartyMakingRateFormData>;
  handleSubmit: SubmitHandler<PartyMakingRateFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: PartyMakingRateTableData | null;
  handleEditData: (data: PartyMakingRateTableData) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  tableInput: string;
  handleFilterTableData: (value: string) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeletePartyMakingRate: () => void;
  deletePartyMakingRateLoading: boolean;
  deleteWarning: string | null;
  totalCount: number;
  partyOptions: PartyMakingRatePartyOption[];
  partyInput: string;
  setPartyInput: Dispatch<SetStateAction<string>>;
  handleSearchParty: () => void;
  handleScrollParty: () => void;
  getPartyLoading: boolean;
}

export interface PartyMakingRateFormProps {
  addPartyMakingRateLoading: boolean;
  updatePartyMakingRateLoading: boolean;
  form: UseFormReturn<PartyMakingRateFormData>;
  handleSubmit: SubmitHandler<PartyMakingRateFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: PartyMakingRateTableData | null;
  partyOptions: PartyMakingRatePartyOption[];
  partyInput: string;
  setPartyInput: Dispatch<SetStateAction<string>>;
  handleSearchParty: () => void;
  handleScrollParty: () => void;
  getPartyLoading: boolean;
}

export interface PartyMakingRateTableProps {
  loading: boolean;
  handleEditData: (data: PartyMakingRateTableData) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  tableInput: string;
  handleFilterTableData: (value: string) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeletePartyMakingRate: () => void;
  deletePartyMakingRateLoading: boolean;
  deleteWarning: string | null;
}
