import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface UserAccessFormData {
  access: Record<string, boolean>;
}

export interface UserAccessBodyData {
  user_id: string | number;
  status: number;
}

export interface UserAccessProps {
  getUserAccessLoading: boolean;
  form: UseFormReturn<UserAccessFormData>;
  handleToggleAccess: (id: number) => void;
}

export interface UserAccessTableProps {
  loading: boolean;
  form: UseFormReturn<UserAccessFormData>;
  handleToggleAccess: (id: number) => void;
}

export interface UserAccessTableData {
  Id: number;
  User_Name: string;
  User_Mail: string;
  Status: number;
}
