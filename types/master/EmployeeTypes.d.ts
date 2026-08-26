import { Dispatch, SetStateAction } from "react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";

// Define the types for form data and API response
export interface EmployeeFormData {
  employeeType: string;
  employeeName: string;
  address: string;
  mobileNo: string;
  email: string;
}

// Define the structure of the body you expect for the Employee API (adjust based on your API's requirements)
interface EmployeeBody {
  org_id: number | null;
  emp_id?: number;
  emp_type: string;
  emp_name: string;
  emp_add: string;
  emp_mobile: string;
  emp_mail: string;
}

export interface EmployeeProps {
  addEmployeeLoading: boolean;
  updateEmployeeLoading: boolean;
  loading: boolean;
  form: UseFormReturn<EmployeeFormData>;
  handleSubmit: SubmitHandler<EmployeeFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: EmployeeTableData | null;
  handleEditData: (data: EmployeeTableData) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  employeeTableInput: string;
  handleFilterTableData: (value: string) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteEmployee: () => void;
  deleteEmployeeLoading: boolean;
  deleteWarning: string | null;
  totalCount: number;
}

export interface EmployeeFormProps {
  addEmployeeLoading: boolean;
  updateEmployeeLoading: boolean;
  form: UseFormReturn<EmployeeFormData>;
  handleSubmit: SubmitHandler<EmployeeFormData>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editData: EmployeeTableData | null;
}

export interface EmployeeTableProps {
  loading: boolean;
  handleEditData: (data: EmployeeTableData) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  employeeTableInput: string;
  handleFilterTableData: (value: string) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  setTempDeleteId: Dispatch<SetStateAction<number | null>>;
  handleShowDeleteDialog: (id: number) => void;
  handleDeleteEmployee: () => void;
  deleteEmployeeLoading: boolean;
  deleteWarning: string | null;
}

export interface EmployeeTableData {
  Id: number;
  Employee_type: string;
  Emp_Type: number;
  Emp_Name: string;
  Emp_Address: string;
  Emp_Mobile: string;
  Emp_Mail: string | null;
}
