import { UseFormReturn, SubmitHandler } from "react-hook-form";

// Define the types for form data and API response
export interface ProfileFormData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  role: string;
  roleId: string;
}

// Define the structure of the body you expect for the Profile API (adjust based on your API's requirements)
interface ProfileBody {
  org_id: number | null;
  user_id: string | number;
  user_name: string;
  user_mail: string;
  user_mob: string;
  user_pass: string | null;
  user_role: string | number;
}

export interface ProfileProps {
  updateProfileLoading: boolean;
  loading: boolean;
  form: UseFormReturn<ProfileFormData>;
  handleSubmit: SubmitHandler<ProfileFormData>;
  userName: string;
  userMobile: string;
}

export interface ProfileFormProps {
  updateProfileLoading: boolean;
  form: UseFormReturn<ProfileFormData>;
  handleSubmit: SubmitHandler<ProfileFormData>;
  userName: string;
  userMobile: string;
}

// export interface ProfileTableProps {
//   handleEditData: (data: ProfileTableData) => void;
// }

// export interface AccountMainHeadData {
//   Id: number;
//   Head_Name: string;
// }

// export interface ProfileTableData {
//   Id: number;
//   Head_Id: number | null;
//   Sub_Head: string | null;
//   Ledger_Name: string;
//   Open_Balance: string | null;
// }
