import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface PartyItemLedgerFormData {
  fromDate: Date;
  toDate: Date;
  partyId: string;
}

export interface PartyItemLedgerProps {
  getPartyItemLedgerLoading: boolean;
  form: UseFormReturn<PartyItemLedgerFormData>;
  handleSubmit: SubmitHandler<PartyItemLedgerFormData>;
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

export interface PartyItemLedgerFormProps {
  getPartyItemLedgerLoading: boolean;
  form: UseFormReturn<PartyItemLedgerFormData>;
  handleSubmit: SubmitHandler<PartyItemLedgerFormData>;
  partyItemLedgerData: PartyItemLedgerTableData[];
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  handleSearchOrderParty: () => void;
  handleScrollOrderParty: () => void;
  orderPartyInput: string;
  setOrderPartyInput: Dispatch<SetStateAction<string>>;
  getOrderPartyLoading: boolean;
}

export interface PartyItemLedgerTableProps {
  loading: boolean;
  partyItemLedgerData: PartyItemLedgerTableData[];
}

export interface PreviewModalProps {
  partyItemLedgerData: PartyItemLedgerTableData[];
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  partyItemLedgerData: PartyItemLedgerTableData[];
  fromDate: string;
  toDate: string;
}

export interface PartyItemLedgerTableData {
  Id: number;
  Party_Name: string;
  Party_Add: string;
  Party_Gst: string;
  Party_Mob: string;
  ItemData: {
    Item_Name: string;
    Trans_Details: {
      Trans_Date: string;
      Particular: string;
      Issue: number;
      Refund: number;
      Balance: number;
    }[];
  }[];
}
