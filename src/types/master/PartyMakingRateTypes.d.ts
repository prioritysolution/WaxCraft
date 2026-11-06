import { Dispatch, SetStateAction } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

export interface PartyMakingRateLineForm {
  makingRateId: string;
  modelId: string;
  modelName: string;
  makingRate: string;
}

export interface PartyMakingRateFormData {
  partyId: string;
  wtRate: string;
  ghat: string;
  polish: string;
  rows: PartyMakingRateLineForm[];
}

export interface PartyMakingRateBody {
  org_id: number | null;
  making_rate_id?: number;
  party_id: string | number;
  model_id: string | number;
  making_rate: string;
  wt_rate: string;
  ghat: string;
  polish: string;
}

export interface PartyMakingRateSaveRow {
  making_rate_id: number;
  model_id: number;
  making_rate: string;
}

export interface PartyMakingRateSaveBody {
  org_id: number;
  party_id: number | string;
  wt_rate: string;
  ghat: string;
  polish: string;
  rows: PartyMakingRateSaveRow[];
}

export interface PartyMakingRateLogEntry {
  id: string;
  partyName: string;
  modelName: string;
  action: string;
  oldMakingRate: string;
  newMakingRate: string;
  oldWtRate: string;
  newWtRate: string;
  oldGhat: string;
  newGhat: string;
  oldPolish: string;
  newPolish: string;
  changedBy: string;
  changedAt: string;
}

export interface PartyMakingRateTableData {
  Id: number;
  Party_Id: number;
  Party_Name: string;
  Model_Id: number;
  Model_Name: string;
  Making_Rate: string | number;
  Wt_Rate: string | number;
  Ghat: string | number;
  Polish: string | number;
}

export interface PartyMakingRatePartyOption {
  Id: number;
  Party_Name: string;
}

export interface PartyMakingRateModelOption {
  Id: number;
  Model_Name: string;
}

export interface PartyMakingRateProps {
  savePartyMakingRateLoading: boolean;
  rowsLoading: boolean;
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
  handleOpenAdd: () => void;
  visibleParties: PartyMakingRateTableData[];
  filterPartyOptions: PartyMakingRatePartyOption[];
  filterPartyLoading: boolean;
  partyFilterId: string;
  onPartyFilterChange: (partyId: string) => void;
  totalCount: number;
  partyOptions: PartyMakingRatePartyOption[];
  partyInput: string;
  setPartyInput: Dispatch<SetStateAction<string>>;
  handleSearchParty: () => void;
  handleScrollParty: () => void;
  getPartyLoading: boolean;
  getModelLoading: boolean;
}

export interface PartyMakingRateFormProps {
  savePartyMakingRateLoading: boolean;
  rowsLoading: boolean;
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
  getModelLoading: boolean;
}

export interface PartyMakingRateLogTableProps {
  loading: boolean;
  rows: PartyMakingRateLogEntry[];
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  tableInput: string;
  handleFilterTableData: (value: string) => void;
  unavailable: boolean;
}

export interface PartyMakingRateTableProps {
  loading: boolean;
  rows: PartyMakingRateTableData[];
  filterPartyOptions: PartyMakingRatePartyOption[];
  filterPartyLoading: boolean;
  partyFilterId: string;
  onPartyFilterChange: (partyId: string) => void;
  handleEditData: (data: PartyMakingRateTableData) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  tableInput: string;
  handleFilterTableData: (value: string) => void;
}
