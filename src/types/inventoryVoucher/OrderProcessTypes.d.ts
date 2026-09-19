import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";

// Define the types for form data and API response
export interface OrderProcessEmployeeWorkRow {
  employeeId: string;
  quantity: string;
}

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
  endDate: Date;
  workDetails: string;
  isFinalStep: boolean;
  finalWeight: string;
  employeeWorkRows: OrderProcessEmployeeWorkRow[];
}

// Define the structure of the body you expect for the OrderProcess API (adjust based on your API's requirements)
export interface OrderProcessBody {
  org_id: number | null;
  order_id: string;
  work_details: {
    design_id: string;
    work_details: string;
    start_date: string;
    end_date: string;
    work_under: string;
    work_qty: string | number;
    is_final: number;
    final_weight: string;
  }[];
}

export interface OrderFinalCloseBody {
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
  processDesignRows: OrderProcessDesignRow[];
  selectedProcessOrder: OrderProcessTableData | null;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  getWorkProcessLoading: boolean;
  getEmployeeLoading: boolean;
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
  processDesignRows: OrderProcessDesignRow[];
  selectedProcessOrder: OrderProcessTableData | null;
  getWorkProcessLoading: boolean;
  getEmployeeLoading: boolean;
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
  perPage: number;
  onPerPageChange: (perPage: number) => void;
}

export interface ProcessTableData {
  Work_Details: string;
  Work_Start: string;
  Work_End: string | null;
  Work_Under: string;
  Work_Qty?: string | number | null;
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
    Is_Complete?: string | number | null;
    Order_Status?: string;
    Process_Name?: string;
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

export type OrderProcessDesignRow = OrderProcessTableData["DesignRow"][number];
