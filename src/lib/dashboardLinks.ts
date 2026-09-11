import { DashboardStat } from "@/types/dashboard/DashboardTypes";

export const DASHBOARD_STAT_LINKS: Record<string, string> = {
  "Active Orders": "/inventoryVoucher/orderBooking",
  "FY Sales": "/inventoryVoucher/salesVoucher",
  "FY Purchases": "/inventoryVoucher/purchaseVoucher",
  "Order Pipeline": "/inventoryVoucher/orderProcess",
  Parties: "/master/party",
  "Inventory Items": "/master/item",
  "Net Business": "/accountingReport/dayBook",
  "Orders Booked": "/inventoryReport/orderBook",
};

export const DASHBOARD_OVERVIEW_LINKS: Record<string, string> = {
  "Total sales": "/inventoryVoucher/salesVoucher",
  "Total purchases": "/inventoryVoucher/purchaseVoucher",
  "Active orders": "/inventoryVoucher/orderBooking",
  "Parties onboarded": "/master/party",
  "Items in master": "/master/item",
};

export const DASHBOARD_CHART_LINKS = {
  monthlyTrend: "/inventoryReport/salesReport",
  businessMix: "/accountingReport/dayBook",
  fyPerformance: "/inventoryReport/purchaseReport",
  operations: "/inventoryVoucher/orderBooking",
} as const;

export const DASHBOARD_ACTIVITY_LINKS = {
  order: "/inventoryVoucher/orderBooking",
  sale: "/inventoryVoucher/salesVoucher",
  purchase: "/inventoryVoucher/purchaseVoucher",
} as const;

export const resolveStatLink = (stat: DashboardStat) =>
  DASHBOARD_STAT_LINKS[stat.label] ?? stat.href;

export const resolveOverviewLink = (label: string, fallback?: string) =>
  DASHBOARD_OVERVIEW_LINKS[label] ?? fallback;
