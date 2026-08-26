import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";

export interface SamplePrintFormData {
  printDate: Date;
  partyId: string;
  address: string;
  mobileNo: string;
  gstin: string;
  designId: string;
  designName: string;
  designNo: string;
  wt: string;
  wtRate: string;
  polish: string;
  image: string;
  itemType: string;
  item: {
    designId: string;
    itemId: string;
    itemGl: string;
    itemName: string;
    itemShName: string;
    itemQuantity: string;
    itemRate: string;
    makingRate: string;
    itemTotal: string;
  }[];
  totalRate: string;
}

export interface SamplePrintBody {
  org_id: number | null;
  sampleprint_id?: number;
  ord_date: string;
  party_id: string;
  is_own: string;
  year_id: number | null;
  sampleprint_array: {
    design_id: string | number | null;
    qnty: string | null;
    wt_rate: string | null;
    tot_wt: string | number | null;
    polish_rate: string | null;
    tot_polish: string | number | null;
    qnty_rate: string | null;
    item_id: string | null;
    Item_Gl: number | string | null;
    item_qnty: string | number | null;
    item_rate: string | null;
    item_tot: string | number | null;
    wt: string | number | null;
    item_grand_tot: string | number | null;
    making_rate: string | null;
  }[];
}

export interface SamplePrintTableData {
  Id: number;
  Print_Date: string;
  Sample_No: string;
  Party_Name: string;
  Party_Id: string;
  Design_Name: string;
  Design_No: string;
  Total: string;
  Item_Type: string;
  Address: string;
  Mobile: string;
  Gstin: string;
  Image: string;
  Wt: string;
  Wt_Rate: string;
  Polish: string;
  printData?: SamplePrintFormData;
  DesignRow?: {
    Design_Id: number;
    Design_Name: string;
    Design_No: string;
    Wt: string;
    Wt_Rate: string;
    Polish: string;
    Image: string;
    ItemRow?: {
      Item_Id: number;
      Item_Name: string;
      Item_GL?: string | number;
      Item_Sh_Name?: string;
      Item_Qnty: string;
      Item_Rate: string;
      Making_Rate: string;
      Item_Tot: string;
    }[];
  }[];
}

export interface SamplePrintProps {
  loading: boolean;
  addSamplePrintLoading: boolean;
  deleteSamplePrintLoading: boolean;
  form: UseFormReturn<SamplePrintFormData>;
  handleSubmit: SubmitHandler<SamplePrintFormData>;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  showDesignDialog: boolean;
  setShowDesignDialog: Dispatch<SetStateAction<boolean>>;
  handleAddDesign: () => void;
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  printData: SamplePrintFormData | null;
  handleSearchOrderParty: () => void;
  handleScrollOrderParty: () => void;
  handleSearchOrderDesign: () => void;
  handleScrollOrderDesign: () => void;
  orderPartyInput: string;
  setOrderPartyInput: Dispatch<SetStateAction<string>>;
  orderDesignInput: string;
  setOrderDesignInput: Dispatch<SetStateAction<string>>;
  handleShowPrintFromHistory: (row: SamplePrintTableData) => void;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeleteSamplePrint: () => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
}

export interface SamplePrintFormProps {
  form: UseFormReturn<SamplePrintFormData>;
  handleSubmit: SubmitHandler<SamplePrintFormData>;
  addSamplePrintLoading: boolean;
  handleSearchOrderParty: () => void;
  handleScrollOrderParty: () => void;
  handleSearchOrderDesign: () => void;
  handleScrollOrderDesign: () => void;
  orderPartyInput: string;
  setOrderPartyInput: Dispatch<SetStateAction<string>>;
  orderDesignInput: string;
  setOrderDesignInput: Dispatch<SetStateAction<string>>;
}

export interface DesignModalProps {
  form: UseFormReturn<SamplePrintFormData>;
  showDesignDialog: boolean;
  setShowDesignDialog: Dispatch<SetStateAction<boolean>>;
  handleAddDesign: () => void;
  setDesignInput: Dispatch<SetStateAction<string>>;
}

export interface SamplePrintTableProps {
  loading: boolean;
  handleShowPrintFromHistory: (row: SamplePrintTableData) => void;
  handleShowDeleteDialog: (id: number) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleDeleteSamplePrint: () => void;
  deleteSamplePrintLoading: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
}

export interface PrintModalProps {
  printData: SamplePrintFormData | null;
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
}
