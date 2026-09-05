"use client";

import { SectionCard } from "@/components/ui/page-shell";
import {
  formatChartCount,
  formatChartCurrency,
} from "@/lib/dashboardChartData";
import { DASHBOARD_CHART_LINKS } from "@/lib/dashboardLinks";
import { DashboardCharts as DashboardChartsData } from "@/types/dashboard/DashboardTypes";
import {
  BarChart3,
  ChevronRight,
  LucideIcon,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { FC, ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartTooltipStyle = {
  borderRadius: "12px",
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
  fontSize: "12px",
};

const ChartEmptyState = ({ label }: { label: string }) => (
  <div className="flex h-[240px] items-center justify-center rounded-xl border border-dashed border-black/10 bg-[#F7F5F3]/70 text-sm text-muted-foreground">
    {label}
  </div>
);

const ChartSkeleton = () => (
  <div className="h-[240px] animate-pulse rounded-xl bg-black/[0.04]" />
);

interface DashboardChartsProps {
  loading: boolean;
  charts: DashboardChartsData;
}

const ChartSection: FC<{
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
}> = ({ href, title, description, icon: Icon, children }) => (
  <SectionCard className="p-4 sm:p-5">
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-primary" />
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Link
        href={href}
        aria-label={`View ${title} details`}
        className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary transition hover:bg-primary/10"
      >
        View details
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
    {children}
  </SectionCard>
);

const DashboardCharts: FC<DashboardChartsProps> = ({ loading, charts }) => {
  const hasMonthlyTrend = charts.monthlyTrend.length > 0;
  const hasBusinessMix = charts.businessMix.length > 0;
  const hasFyComparison = charts.fyComparison.some((item) => item.value > 0);
  const hasOperations = charts.operations.some((item) => item.value > 0);

  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.7fr_1fr] sm:gap-4">
      <ChartSection
        href={DASHBOARD_CHART_LINKS.monthlyTrend}
        title="Monthly sales vs purchases"
        description="Financial year trend across billing activity"
        icon={TrendingUp}
      >
        {loading ? (
          <ChartSkeleton />
        ) : hasMonthlyTrend ? (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={charts.monthlyTrend}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                  <linearGradient
                    id="purchaseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-2))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-2))"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatChartCurrency}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={72}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value, name) => [
                    formatChartCurrency(Number(value)),
                    String(name),
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="sales"
                  name="Sales"
                  stroke="hsl(var(--chart-1))"
                  fill="url(#salesGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="purchases"
                  name="Purchases"
                  stroke="hsl(var(--chart-2))"
                  fill="url(#purchaseGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <ChartEmptyState label="Monthly trend will appear once sales or purchase data is available." />
        )}
      </ChartSection>

      <ChartSection
        href={DASHBOARD_CHART_LINKS.businessMix}
        title="Business mix"
        description="Share of sales, purchases, and pipeline"
        icon={PieChartIcon}
      >
        {loading ? (
          <ChartSkeleton />
        ) : hasBusinessMix ? (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.businessMix}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={96}
                  paddingAngle={3}
                >
                  {charts.businessMix.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value) => formatChartCurrency(Number(value))}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <ChartEmptyState label="Business mix chart will appear once financial data is available." />
        )}
      </ChartSection>

      <ChartSection
        href={DASHBOARD_CHART_LINKS.fyPerformance}
        title="FY performance"
        description="Sales, purchases, pipeline, and net position"
        icon={BarChart3}
      >
        {loading ? (
          <ChartSkeleton />
        ) : hasFyComparison ? (
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.fyComparison}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatChartCurrency}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={72}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value) => formatChartCurrency(Number(value))}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {charts.fyComparison.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <ChartEmptyState label="FY performance chart will appear once report data is available." />
        )}
      </ChartSection>

      <ChartSection
        href={DASHBOARD_CHART_LINKS.operations}
        title="Operations snapshot"
        description="Orders, parties, items, and bookings"
        icon={BarChart3}
      >
        {loading ? (
          <ChartSkeleton />
        ) : hasOperations ? (
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.operations}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis
                  type="number"
                  tickFormatter={formatChartCount}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={92}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value) => formatChartCount(Number(value))}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {charts.operations.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <ChartEmptyState label="Operations chart will appear once master and order data is available." />
        )}
      </ChartSection>
    </div>
  );
};

export default DashboardCharts;
