"use client";

import { PageHeader, PageShell, SectionCard } from "@/components/ui/page-shell";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import { DashboardProps, DashboardStat } from "@/types/dashboard/DashboardTypes";
import { Spinner } from "@heroui/react";
import {
  Banknote,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  Receipt,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { cn } from "@/lib/utils";
import {
  DASHBOARD_ACTIVITY_LINKS,
  resolveOverviewLink,
  resolveStatLink,
} from "@/lib/dashboardLinks";

const activityMeta = {
  order: {
    label: "Order",
    icon: ClipboardList,
    badgeClass: "bg-blue-50 text-blue-700",
  },
  sale: {
    label: "Sale",
    icon: ShoppingCart,
    badgeClass: "bg-emerald-50 text-emerald-700",
  },
  purchase: {
    label: "Purchase",
    icon: Receipt,
    badgeClass: "bg-amber-50 text-amber-700",
  },
};

const formatActivityDate = (value: string) => {
  if (!value) return "—";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatActivityAmount = (value?: string) => {
  const amount = Number.parseFloat(String(value ?? "").replace(/,/g, ""));
  if (!Number.isFinite(amount) || amount === 0) return null;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const StatCardSkeleton = () => (
  <SectionCard className="p-4 sm:p-5">
    <div className="flex animate-pulse items-start justify-between gap-3">
      <div className="flex-1 space-y-3">
        <div className="h-4 w-24 rounded bg-black/5" />
        <div className="h-8 w-32 rounded bg-black/5" />
        <div className="h-3 w-40 rounded bg-black/5" />
      </div>
      <div className="h-10 w-10 rounded-xl bg-black/5" />
    </div>
  </SectionCard>
);

const StatCard: FC<{ stat: DashboardStat }> = ({ stat }) => {
  const href = resolveStatLink(stat);

  return (
    <Link
      href={href}
      aria-label={`View ${stat.label} details`}
      className="group block h-full no-underline outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 rounded-2xl"
    >
      <SectionCard className="h-full cursor-pointer p-4 transition hover:border-primary/20 hover:bg-[#F7F5F3]/40 hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)] sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-foreground">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
            <p className="mt-2 text-[11px] font-medium text-primary opacity-0 transition group-hover:opacity-100">
              View details
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <stat.icon className="h-5 w-5" />
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </div>
      </SectionCard>
    </Link>
  );
};

const Dashboard: FC<
  DashboardProps & { onRefresh?: () => void }
> = ({
  loading,
  stats,
  overview,
  recentActivity,
  charts,
  periodLabel,
  onRefresh,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        description="A live snapshot of your WaxCraft operations."
        badge={
          periodLabel ? (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {periodLabel}
            </span>
          ) : null
        }
        action={
          onRefresh ? (
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium text-foreground transition hover:bg-[#F7F5F3] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={cn("h-4 w-4", loading && "animate-spin")}
              />
              Refresh
            </button>
          ) : null
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
        {loading && stats.length === 0
          ? Array.from({ length: 8 }).map((_, index) => (
              <StatCardSkeleton key={index} />
            ))
          : stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
      </div>

      <DashboardCharts loading={loading} charts={charts} />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.6fr_1fr] sm:gap-4">
        <SectionCard className="min-h-[280px] p-4 sm:p-5 lg:min-h-[360px]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h2 className="text-[15px] font-semibold text-foreground">
                Recent activity
              </h2>
            </div>
            {loading ? <Spinner size="sm" color="primary" /> : null}
          </div>

          {loading && recentActivity.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-14 animate-pulse rounded-xl bg-black/[0.04]"
                />
              ))}
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-2">
              {recentActivity.map((item) => {
                const meta = activityMeta[item.type];
                const amount = formatActivityAmount(item.amount);

                return (
                  <Link
                    key={item.id}
                    href={DASHBOARD_ACTIVITY_LINKS[item.type] ?? item.href}
                    aria-label={`View ${item.title} details`}
                    className="group block no-underline outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 rounded-xl"
                  >
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-black/[0.06] bg-[#F7F5F3]/70 px-3 py-3 transition hover:border-primary/20 hover:bg-white cursor-pointer">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            meta.badgeClass
                          )}
                        >
                          <meta.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">
                            {item.title}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 text-right">
                        <div>
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                              meta.badgeClass
                            )}
                          >
                            {meta.label}
                          </span>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatActivityDate(item.date)}
                          </p>
                          {amount ? (
                            <p className="mt-0.5 text-xs font-medium text-foreground">
                              {amount}
                            </p>
                          ) : null}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition group-hover:text-primary" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-black/10 bg-[#F7F5F3]/70 text-sm text-muted-foreground lg:h-[280px]">
              No recent activity found.
            </div>
          )}
        </SectionCard>

        <SectionCard className="min-h-[220px] p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <Banknote className="h-4 w-4 text-primary" />
            <h2 className="text-[15px] font-semibold text-foreground">
              Business overview
            </h2>
          </div>

          {loading && overview.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 animate-pulse rounded-lg bg-black/[0.04]"
                />
              ))}
            </div>
          ) : overview.length > 0 ? (
            <div className="space-y-2">
              {overview.map((item) => {
                const href = resolveOverviewLink(item.label, item.href);

                return href ? (
                  <Link
                    key={item.label}
                    href={href}
                    aria-label={`View ${item.label} details`}
                    className="group block no-underline outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 rounded-xl"
                  >
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-black/[0.06] bg-[#F7F5F3]/70 px-3 py-2.5 transition hover:border-primary/20 hover:bg-white cursor-pointer">
                      <span className="text-sm text-muted-foreground group-hover:text-foreground">
                        {item.label}
                      </span>
                      <span className="flex items-center gap-2 text-right text-sm font-medium text-foreground">
                        {item.value}
                        <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3 rounded-xl border border-black/[0.06] bg-[#F7F5F3]/70 px-3 py-2.5"
                  >
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-right text-sm font-medium text-foreground">
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-[180px] items-center justify-center rounded-xl border border-dashed border-black/10 bg-[#F7F5F3]/70 text-sm text-muted-foreground lg:h-[280px]">
              Overview data will appear here.
            </div>
          )}
        </SectionCard>
      </div>
    </PageShell>
  );
};

export default Dashboard;
