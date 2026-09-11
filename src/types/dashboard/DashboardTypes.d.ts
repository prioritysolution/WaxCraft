import { LucideIcon } from "lucide-react";

export interface DashboardStat {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  href: string;
}

export interface DashboardOverviewItem {
  label: string;
  value: string;
  href?: string;
}

export interface DashboardActivityItem {
  id: string;
  type: "order" | "sale" | "purchase";
  title: string;
  subtitle: string;
  date: string;
  amount?: string;
  href: string;
}

export interface DashboardMonthlyTrendPoint {
  month: string;
  sales: number;
  purchases: number;
}

export interface DashboardChartPoint {
  name: string;
  value: number;
  fill: string;
}

export interface DashboardCharts {
  monthlyTrend: DashboardMonthlyTrendPoint[];
  fyComparison: DashboardChartPoint[];
  operations: DashboardChartPoint[];
  businessMix: DashboardChartPoint[];
}

export interface DashboardData {
  stats: DashboardStat[];
  overview: DashboardOverviewItem[];
  recentActivity: DashboardActivityItem[];
  periodLabel: string;
  charts: DashboardCharts;
}

export interface DashboardProps {
  loading: boolean;
  stats: DashboardStat[];
  overview: DashboardOverviewItem[];
  recentActivity: DashboardActivityItem[];
  periodLabel: string;
  charts: DashboardCharts;
}
