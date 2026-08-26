import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { PartyFormData } from "../master/PartyTypes";
import { SetStateAction } from "react";

// Define the types for form data and API response
export interface OrderProcessFormData {
  orderId: string;
  designId: string;
  orderDate: string;
  orderNo: string;
  partyName: string;
  totalOrder: string;
  orderStatus: string;
  designName: string;
  designNo: string;
  orderQuantity: string;
  designRate: string;
  wt: string;
  wtRate: string;
  totalWt: string;
  polish: string;
  totalPolish: string;
  image: string;
  closeDate: Date;
  startDate: Date;
  employeeId: string;
  workDetails: string;
}

// Define the structure of the body you expect for the OrderProcess API (adjust based on your API's requirements)
interface OrderProcessBody {
  org_id: number | null;
  order_id: string;
  work_details: {
    design_id: string;
    work_details: string;
    start_date: string;
    work_under: string;
  }[];
}

interface OrderFinalCloseBody {
  org_id: number | null;
  order_id: string;
  comp_date: string;
}

export interface OrderProcessProps {
  addOrderProcessLoading: boolean;
  loading: boolean;
  form: UseFormReturn<OrderProcessFormData, any, TFieldValues>;
  handleSubmit: SubmitHandler<OrderProcessFormData, TFieldValues>;
  isOpenProcess: boolean;
  setIsOpenProcess: Dispatch<SetStateAction<boolean>>;
  handleOpenProcessDialog: (
    data: OrderProcessTableData,
    type: "Process" | "View"
  ) => void;
  dialogType: "View" | "Process";
  handleFurtherProcess: () => void;
  handleFinalClose: () => void;
  processPostType: "FurtherProcess" | "FinalClose";
  showFormFields: boolean;
  processTableData: ProcessTableData[];
  handleSearchEmployee: () => void;
  handleScrollEmployee: () => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  employeeInput: string;
  setEmployeeInput: Dispatch<SetStateAction<string>>;
  getEmployeeLoading: boolean;
  getWorkProcessLoading: boolean;
}

export interface OrderProcessFormProps {
  addOrderProcessLoading: boolean;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  form: UseFormReturn<OrderProcessFormData, any, TFieldValues>;
  handleSubmit: SubmitHandler<OrderProcessFormData, TFieldValues>;
  dialogType: "View" | "Process";
  handleFurtherProcess: () => void;
  handleFinalClose: () => void;
  processPostType: "FurtherProcess" | "FinalClose";
  showFormFields: boolean;
  processTableData: ProcessTableData[];
  handleSearchEmployee: () => void;
  handleScrollEmployee: () => void;
  employeeInput: string;
  setEmployeeInput: Dispatch<SetStateAction<string>>;
  getEmployeeLoading: boolean;
  getWorkProcessLoading: boolean;
}

export interface OrderProcessTableProps {
  loading: boolean;
  handleOpenProcessDialog: (
    data: OrderProcessTableData,
    type: "Process" | "View"
  ) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
}

export interface ProcessTableData {
  Work_Details: string;
  Work_Start: string;
  Work_End: string | null;
  Work_Under: string;
}

export interface OrderProcessTableData {
  Id: number;
  Order_Date: string;
  Order_No: string;
  Party_Name: string;
  Party_Id: number;
  Total_Order: string;
  Order_Status: string;
  DesignRow: {
    Design_Id: number;
    Design_Name: string;
    Design_No: string;
    Order_Qnty: string;
    Design_Rate: string;
    Wt: string;
    Wt_Rate: string;
    Tot_Wt: string;
    Polish: string;
    Tot_Polish: string;
    Image: string;
    ItemRow: {
      Item_Id: number;
      Item_Name: string;
      Item_Qnty: string;
      Item_Rate: string;
      Making_Rate: string;
      Item_Tot: string;
    }[];
  }[];
}
