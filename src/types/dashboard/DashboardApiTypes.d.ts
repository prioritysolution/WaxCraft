import { SalesReportTableData } from "@/types/inventoryReport/SalesReportTypes";
import { PurchaseReportTableData } from "@/types/inventoryReport/PurchaseReportTypes";

export interface DashboardMonthlyTrendApiRow {
  Month?: string;
  month?: string;
  Month_Label?: string;
  Sales?: string | number;
  sales?: string | number;
  Purchases?: string | number;
  purchases?: string | number;
}

export interface DashboardRecentActivityApiRow {
  Activity_Type?: string;
  activity_type?: string;
  Type?: string;
  Id?: number;
  Reference_Id?: number;
  Reference_No?: string;
  Title?: string;
  Party_Name?: string;
  Subtitle?: string;
  Activity_Date?: string;
  Date?: string;
  Amount?: string | number;
  Total_Amount?: string | number;
}

export interface DashboardChartPointApiRow {
  name?: string;
  Name?: string;
  value?: string | number;
  Value?: string | number;
  fill?: string;
  Fill?: string;
}

export interface DashboardStatsApiDetails {
  OrderBook?: {
    Count?: string | number;
    Amount?: string | number;
  };
  ActiveOrder?: {
    Count?: string | number;
    Amount?: string | number;
  };
  InvoiseList?: {
    Count?: string | number;
  };
  SalesRegister?: {
    Count?: string | number;
    Amount?: string | number;
  };
  PurchaseRegister?: {
    Count?: string | number;
    Amount?: string | number;
  };
  PurchaseList?: {
    Count?: string | number;
  };
  PartyList?: {
    Count?: string | number;
    Debtor_Count?: string | number;
    Creditor_Count?: string | number;
  };
  ItemList?: {
    Count?: string | number;
  };
  Active_Orders?: string | number;
  Active_Order_Count?: string | number;
  Sales_Total?: string | number;
  Fy_Sales?: string | number;
  Sales_Invoice_Count?: string | number;
  Sales_Count?: string | number;
  Purchase_Total?: string | number;
  Fy_Purchases?: string | number;
  Purchase_Count?: string | number;
  Purchase_Entry_Count?: string | number;
  Order_Pipeline?: string | number;
  Order_Pipeline_Total?: string | number;
  Order_Book_Count?: string | number;
  Orders_Booked?: string | number;
  Party_Count?: string | number;
  Parties?: string | number;
  Item_Count?: string | number;
  Inventory_Items?: string | number;
  Net_Business?: string | number;
  Monthly_Trend?: DashboardMonthlyTrendApiRow[];
  monthly_trend?: DashboardMonthlyTrendApiRow[];
  Recent_Activity?: DashboardRecentActivityApiRow[];
  recent_activity?: DashboardRecentActivityApiRow[];
  Sales_Register?: SalesReportTableData[];
  Purchase_Register?: PurchaseReportTableData[];
  Fy_Comparison?: DashboardChartPointApiRow[];
  fy_comparison?: DashboardChartPointApiRow[];
  Operations?: DashboardChartPointApiRow[];
  operations?: DashboardChartPointApiRow[];
  Business_Mix?: DashboardChartPointApiRow[];
  business_mix?: DashboardChartPointApiRow[];
  Stats?: DashboardStatsApiDetails;
}
