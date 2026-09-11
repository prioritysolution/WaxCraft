import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface PartyLedgerFormData {
  fromDate: Date;
  toDate: Date;
  partyId: string;
  ledgerType: string;
}

export interface PartyLedgerProps {
  getPartyLedgerLoading: boolean;
  form: UseFormReturn<PartyLedgerFormData>;
  handleSubmit: SubmitHandler<PartyLedgerFormData>;
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  fromDate: string;
  toDate: string;
  handleSearchOrderParty: () => void;
  handleScrollOrderParty: () => void;
  orderPartyInput: string;
  setOrderPartyInput: Dispatch<SetStateAction<string>>;
  getOrderPartyLoading: boolean;
}

export interface PartyLedgerFormProps {
  getPartyLedgerLoading: boolean;
  form: UseFormReturn<PartyLedgerFormData>;
  handleSubmit: SubmitHandler<PartyLedgerFormData>;
  partyLedgerData: PartyLedgerTableData[];
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  handleSearchOrderParty: () => void;
  handleScrollOrderParty: () => void;
  orderPartyInput: string;
  setOrderPartyInput: Dispatch<SetStateAction<string>>;
  getOrderPartyLoading: boolean;
}

export interface PartyLedgerTableProps {
  loading: boolean;
  partyLedgerData: PartyLedgerTableData[];
}

export interface PreviewModalProps {
  partyLedgerData: PartyLedgerTableData[];
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  partyLedgerData: PartyLedgerTableData[];
  fromDate: string;
  toDate: string;
}

export interface PartyLedgerTableData {
  Id: number;
  Party_Name: string;
  Party_Add: string;
  Party_Gst: string;
  Party_Mob: string;
  Ledger_Data: {
    Trans_Date: string;
    Particular: string;
    Debit: string;
    Credit: string;
    Balance: string;
    Balance_Type: string;
  }[];
}
