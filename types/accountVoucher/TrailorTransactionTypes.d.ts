import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { PartyFormData } from "../master/PartyTypes";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface TrailorTransactionFormData {
  date: Date;
  userId: string;
  balance: string;
  transType: string;
  amount: string;
}

// Define the structure of the body you expect for the TrailorTransaction API (adjust based on your API's requirements)
interface TrailorTransactionBody {
  org_id: number | null;
  trans_date: string;
  user_id: string;
  trans_type: string;
  amount: string;
}

export interface TrailorTransactionProps {
  loading: boolean;
  form: UseFormReturn<TrailorTransactionFormData>;
  handleSubmit: SubmitHandler<TrailorTransactionFormData>;
  getUserLoading: boolean;
}

export interface TrailorTransactionFormProps {
  loading: boolean;
  form: UseFormReturn<TrailorTransactionFormData>;
  handleSubmit: SubmitHandler<TrailorTransactionFormData>;
  getUserLoading: boolean;
}
