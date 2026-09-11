import { Dispatch, SetStateAction } from "react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";

export interface AddUserFormData {
  name: string;
  email: string;
  mobile: string;
  role: string;
  password: string;
}

interface AddUserBody {
  org_id: number | null;
  user_id?: number;
  user_name: string;
  user_mail: string;
  user_mob: string;
  user_role: string;
  user_pass: string | null;
}

export interface AddUserProps {
  addUserLoading: boolean;
  updateUserLoading: boolean;
  loading: boolean;
  form: UseFormReturn<AddUserFormData>;
  handleSubmit: SubmitHandler<AddUserFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: AddUserTableData | null;
  handleEditData: (data: AddUserTableData) => void;
  handleOpenAdd: () => void;
  getRolesLoading: boolean;
  // currentPage: number;
  // setCurrentPage: Dispatch<SetStateAction<number>>;
  // lastPage: number;
}

export interface AddUserFormProps {
  addUserLoading: boolean;
  updateUserLoading: boolean;
  form: UseFormReturn<AddUserFormData>;
  handleSubmit: SubmitHandler<AddUserFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: AddUserTableData | null;
  getRolesLoading: boolean;
}

export interface AddUserTableProps {
  loading: boolean;
  handleEditData: (data: AddUserTableData) => void;
  // currentPage: number;
  // setCurrentPage: Dispatch<SetStateAction<number>>;
  // lastPage: number;
}

export interface AddUserTableData {
  Id: number;
  Org_Id: number;
  Role_Id: number;
  User_Name: string;
  User_Mail: string;
  User_Mob: string;
  Role_Name: string;
}
