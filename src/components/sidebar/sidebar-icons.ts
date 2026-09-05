import {
  Banknote,
  ChartColumn,
  CircleDollarSign,
  Database,
  FileSpreadsheet,
  Info,
  LayoutDashboard,
  Package,
  PieChart,
  Receipt,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const sidebarIcons: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  master: Database,
  "inventory voucher": Package,
  "accounting voucher": Receipt,
  payroll: CircleDollarSign,
  "inventory report": ChartColumn,
  "accounting report": PieChart,
  "payroll report": FileSpreadsheet,
  tools: Wrench,
  about: Info,
  "account voucher": Banknote,
};

export function getSidebarIcon(title?: string | null): LucideIcon | null {
  const key = (title || "").trim().toLowerCase();
  if (sidebarIcons[key]) return sidebarIcons[key];

  if (key.includes("inventory") && key.includes("report")) return ChartColumn;
  if (key.includes("accounting") && key.includes("report")) return PieChart;
  if (key.includes("payroll") && key.includes("report")) return FileSpreadsheet;
  if (key.includes("inventory")) return Package;
  if (key.includes("account")) return Receipt;
  if (key.includes("payroll")) return CircleDollarSign;
  if (key.includes("tool")) return Wrench;
  if (key.includes("master")) return Database;
  if (key.includes("about")) return Info;
  if (key.includes("dashboard")) return LayoutDashboard;

  return null;
}
