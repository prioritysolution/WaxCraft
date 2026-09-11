import { UseFormReturn, SubmitHandler } from "react-hook-form";

// Define the types for form data and API response
export interface ItemRateFormData {
  itemId: string;
  previousRate: string;
  currentRate: string;
}

// Define the structure of the body you expect for the ItemRate API (adjust based on your API's requirements)
interface ItemRateBody {
  org_id: number | null;
  item_id: string;
  item_rate: string;
}

export interface ItemRateProps {
  addItemRateLoading: boolean;
  loading: boolean;
  form: UseFormReturn<ItemRateFormData>;
  handleSubmit: SubmitHandler<ItemRateFormData>;
  handleSearchItem: () => void;
  handleScrollItem: () => void;
  itemInput: string;
  setItemInput: Dispatch<SetStateAction<string>>;
  getItemLoading: boolean;
}

export interface ItemRateFormProps {
  addItemRateLoading: boolean;
  form: UseFormReturn<ItemRateFormData>;
  handleSubmit: SubmitHandler<ItemRateFormData>;
  handleSearchItem: () => void;
  handleScrollItem: () => void;
  itemInput: string;
  setItemInput: Dispatch<SetStateAction<string>>;
  getItemLoading: boolean;
}
