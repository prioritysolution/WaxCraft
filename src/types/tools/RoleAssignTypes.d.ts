import { UseFormReturn, SubmitHandler } from "react-hook-form";

export interface ChildData {
  Menue_Id: number;
  menue_Name: string;
}

export interface ModuleData {
  Module_Id: number;
  Module_Name: string;
  ChildRow: ChildData[];
}

// Define the types for form data and API response
export interface RoleAssignFormData {
  userId: string;
  [key: string]: any;
}

// Define the structure of the body you expect for the login API (adjust based on your API's requirements)
export interface AddRoleAssignBody {
  user_id: string;
  Module_Array: {
    module_id: string | number;
    menue_id: string | number | null;
  }[];
}

export interface RoleAssignProps {
  form: UseFormReturn<RoleAssignFormData>;
  loading: boolean;
  handleSubmit: SubmitHandler<RoleAssignFormData>;
  roleAssignList: RoleAssign[];
  roleAssignSingleList: RoleAssign[];
  openModuleId: number[];
  setOpenModuleId: React.Dispatch<React.SetStateAction<number[]>>;
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  getUserLoading: boolean;
}

export interface RoleAssignFormProps {
  form: UseFormReturn<RoleAssignFormData>;
  loading: boolean;
  handleSubmit: SubmitHandler<RoleAssignFormData>;
  roleAssignList: RoleAssign[];
  roleAssignSingleList: RoleAssign[];
  openModuleId: number[];
  setOpenModuleId: React.Dispatch<React.SetStateAction<number[]>>;
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  getUserLoading: boolean;
}
