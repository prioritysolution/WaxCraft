import { LucideIcon } from "lucide-react";
import { DashboardRole } from "@/lib/dashboardRoles";

export interface RoleDashboardStat {
  label: string;
  value: string;
  hint: string;
  href: string;
  icon: LucideIcon;
}

export interface RoleDashboardOverviewItem {
  label: string;
  value: string;
  href?: string;
}

export interface RoleDashboardActivityItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  status?: string;
  amount?: string;
  href: string;
}

export interface RoleDashboardView {
  role: Exclude<DashboardRole, "admin" | "unknown">;
  title: string;
  description: string;
  stats: RoleDashboardStat[];
  overview: RoleDashboardOverviewItem[];
  recent: RoleDashboardActivityItem[];
}

export interface RoleDashboardActivityApiRow {
  Id?: number | string;
  Title?: string;
  title?: string;
  Subtitle?: string;
  subtitle?: string;
  Party_Name?: string;
  Date?: string;
  Activity_Date?: string;
  Status?: string;
  status?: string;
  Amount?: string | number;
  Href?: string;
}

export interface RoleDashboardDetails {
  Overview?: Array<{
    Label?: string;
    label?: string;
    Value?: string | number;
    value?: string | number;
    Href?: string;
  }>;
  overview?: RoleDashboardDetails["Overview"];
  Recent?: RoleDashboardActivityApiRow[];
  recent?: RoleDashboardActivityApiRow[];
  Recent_Activity?: RoleDashboardActivityApiRow[];
  [key: string]: unknown;
}
