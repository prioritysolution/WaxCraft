import {
  Banknote,
  Boxes,
  ClipboardCheck,
  ClipboardList,
  Factory,
  HandCoins,
  PackageCheck,
  Receipt,
  ShoppingCart,
  Truck,
  Landmark,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import { DashboardRole } from "@/lib/dashboardRoles";
import {
  RoleDashboardActivityApiRow,
  RoleDashboardActivityItem,
  RoleDashboardDetails,
  RoleDashboardOverviewItem,
  RoleDashboardStat,
  RoleDashboardView,
} from "@/types/dashboard/RoleDashboardTypes";

const parseAmount = (value: unknown) => {
  const parsed = Number.parseFloat(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCount = (value: unknown) =>
  new Intl.NumberFormat("en-IN").format(parseAmount(value));

const formatCurrency = (value: unknown) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(parseAmount(value));

const pick = (details: RoleDashboardDetails, keys: string[]) => {
  for (const key of keys) {
    const value = details[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return 0;
};

const stat = (
  label: string,
  value: string,
  hint: string,
  href: string,
  icon: RoleDashboardStat["icon"],
): RoleDashboardStat => ({ label, value, hint, href, icon });

const mapOverview = (details: RoleDashboardDetails): RoleDashboardOverviewItem[] => {
  const rows = details.Overview ?? details.overview ?? [];
  if (!Array.isArray(rows)) return [];

  return rows
    .map((row) => ({
      label: String(row?.Label ?? row?.label ?? "").trim(),
      value: String(row?.Value ?? row?.value ?? "—"),
      href: row?.Href ? String(row.Href) : undefined,
    }))
    .filter((row) => row.label);
};

const mapRecent = (
  details: RoleDashboardDetails,
  fallbackHref: string,
): RoleDashboardActivityItem[] => {
  const rows =
    details.Recent ?? details.recent ?? details.Recent_Activity ?? [];
  if (!Array.isArray(rows)) return [];

  return rows.map((row: RoleDashboardActivityApiRow, index) => ({
    id: String(row.Id ?? index),
    title: String(row.Title ?? row.title ?? "—"),
    subtitle: String(row.Subtitle ?? row.subtitle ?? row.Party_Name ?? ""),
    date: String(row.Date ?? row.Activity_Date ?? ""),
    status: String(row.Status ?? row.status ?? ""),
    amount:
      row.Amount != null && String(row.Amount).trim() !== ""
        ? formatCurrency(row.Amount)
        : undefined,
    href: String(row.Href ?? fallbackHref),
  }));
};

const mapManager = (details: RoleDashboardDetails): RoleDashboardView => ({
  role: "manager",
  title: "Manager Dashboard",
  description: "Orders, production progress, and shop activity.",
  stats: [
    stat(
      "Active Orders",
      formatCount(pick(details, ["Active_Orders", "Active_Order_Count"])),
      "Orders currently open",
      "/inventoryVoucher/orderBooking",
      ClipboardList,
    ),
    stat(
      "In Process",
      formatCount(pick(details, ["In_Process", "Process_Count"])),
      "Orders on the floor",
      "/inventoryVoucher/orderProcess",
      Factory,
    ),
    stat(
      "Product Ready",
      formatCount(pick(details, ["Product_Ready", "Ready_Count"])),
      "Ready to ship",
      "/inventoryVoucher/orderProcess",
      PackageCheck,
    ),
    stat(
      "Shipped",
      formatCount(pick(details, ["Shipped", "Shipped_Count"])),
      "Completed dispatches",
      "/inventoryVoucher/orderProcess",
      Truck,
    ),
    stat(
      "Sample Prints",
      formatCount(pick(details, ["Sample_Prints", "Sample_Print_Count"])),
      "Sample jobs in period",
      "/inventoryVoucher/samplePrint",
      Boxes,
    ),
    stat(
      "Pending Orders",
      formatCount(pick(details, ["Pending_Orders", "Pending_Count"])),
      "Not yet in process",
      "/inventoryVoucher/orderBooking",
      ClipboardCheck,
    ),
    stat(
      "Work In Progress",
      formatCount(pick(details, ["Work_In_Progress", "Wip_Count"])),
      "Open work rows",
      "/inventoryVoucher/orderProcess",
      Wrench,
    ),
    stat(
      "Employees Working",
      formatCount(pick(details, ["Employees_Working", "Employee_Count"])),
      "People with open work",
      "/master/employee",
      Users,
    ),
  ],
  overview: mapOverview(details),
  recent: mapRecent(details, "/inventoryVoucher/orderProcess"),
});

const mapAccountant = (details: RoleDashboardDetails): RoleDashboardView => ({
  role: "accountant",
  title: "Accountant Dashboard",
  description: "Sales, purchases, cash, bank, and party balances.",
  stats: [
    stat(
      "FY Sales",
      formatCurrency(pick(details, ["Fy_Sales", "Sales_Total"])),
      "Sales in this period",
      "/inventoryVoucher/salesVoucher",
      ShoppingCart,
    ),
    stat(
      "FY Purchases",
      formatCurrency(pick(details, ["Fy_Purchases", "Purchase_Total"])),
      "Purchases in this period",
      "/inventoryVoucher/purchaseVoucher",
      Receipt,
    ),
    stat(
      "Receipts",
      formatCurrency(pick(details, ["Receipt_Total", "Receipts"])),
      "Money received",
      "/accountVoucher/receipt",
      HandCoins,
    ),
    stat(
      "Payments",
      formatCurrency(pick(details, ["Payment_Total", "Payments"])),
      "Money paid",
      "/accountVoucher/payment",
      Wallet,
    ),
    stat(
      "Cash Balance",
      formatCurrency(pick(details, ["Cash_Balance", "Cash"])),
      "Cash in hand",
      "/accountingReport/cashBook",
      Banknote,
    ),
    stat(
      "Bank Balance",
      formatCurrency(pick(details, ["Bank_Balance", "Bank"])),
      "Bank books",
      "/accountingReport/bankLedger",
      Landmark,
    ),
    stat(
      "Receivable",
      formatCurrency(pick(details, ["Receivable", "Debtor_Balance"])),
      "Party dues to collect",
      "/inventoryReport/partyLedger",
      Users,
    ),
    stat(
      "Payable",
      formatCurrency(pick(details, ["Payable", "Creditor_Balance"])),
      "Party dues to pay",
      "/inventoryReport/partyLedger",
      Receipt,
    ),
  ],
  overview: mapOverview(details),
  recent: mapRecent(details, "/accountingReport/dayBook"),
});

const mapOperator = (details: RoleDashboardDetails): RoleDashboardView => ({
  role: "operator",
  title: "Operator Dashboard",
  description: "Your assigned work and today's production.",
  stats: [
    stat(
      "Pending Work",
      formatCount(pick(details, ["Pending_Work", "Pending_Count"])),
      "Jobs waiting on you",
      "/inventoryVoucher/orderProcess",
      ClipboardList,
    ),
    stat(
      "Started Today",
      formatCount(pick(details, ["Started_Today", "Start_Count"])),
      "Work started today",
      "/inventoryVoucher/orderProcess",
      Factory,
    ),
    stat(
      "Completed Today",
      formatCount(pick(details, ["Completed_Today", "Complete_Count"])),
      "Work closed today",
      "/inventoryVoucher/orderProcess",
      ClipboardCheck,
    ),
    stat(
      "Assigned Qty",
      formatCount(pick(details, ["Assigned_Qty", "Work_Qty"])),
      "Quantity on your jobs",
      "/inventoryVoucher/orderProcess",
      Boxes,
    ),
    stat(
      "Open Orders",
      formatCount(pick(details, ["Open_Orders", "Order_Count"])),
      "Orders linked to your work",
      "/inventoryVoucher/orderBooking",
      PackageCheck,
    ),
    stat(
      "Process Steps",
      formatCount(pick(details, ["Process_Steps", "Step_Count"])),
      "Steps still open",
      "/inventoryVoucher/orderProcess",
      Wrench,
    ),
  ],
  overview: mapOverview(details),
  recent: mapRecent(details, "/inventoryVoucher/orderProcess"),
});

export const mapRoleDashboard = (
  role: Exclude<DashboardRole, "admin" | "unknown">,
  details: RoleDashboardDetails,
): RoleDashboardView => {
  if (role === "manager") return mapManager(details);
  if (role === "accountant") return mapAccountant(details);
  return mapOperator(details);
};
