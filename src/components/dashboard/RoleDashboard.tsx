"use client";

import { PageHeader, PageShell, SectionCard } from "@/components/ui/page-shell";
import { RoleDashboardView } from "@/types/dashboard/RoleDashboardTypes";
import { Spinner } from "@heroui/react";
import { ChevronRight, LayoutDashboard, RefreshCw } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { cn } from "@/lib/utils";

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

const RoleDashboard: FC<{
  loading: boolean;
  periodLabel: string;
  view: RoleDashboardView;
  onRefresh?: () => void;
}> = ({ loading, periodLabel, view, onRefresh }) => {
  return (
    <PageShell>
      <PageHeader
        icon={LayoutDashboard}
        title={view.title}
        description={view.description}
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
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              Refresh
            </button>
          ) : null
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
        {view.stats.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group block h-full no-underline outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 rounded-2xl"
          >
            <SectionCard className="h-full p-4 transition hover:border-primary/20 hover:bg-[#F7F5F3]/40 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-foreground">
                    {loading ? "—" : item.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </SectionCard>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.6fr_1fr] sm:gap-4">
        <SectionCard className="min-h-[280px] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-semibold text-foreground">
              Recent activity
            </h2>
            {loading ? <Spinner size="sm" color="primary" /> : null}
          </div>
          {view.recent.length > 0 ? (
            <div className="space-y-2">
              {view.recent.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block no-underline"
                >
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-black/[0.06] bg-[#F7F5F3]/70 px-3 py-3 transition hover:border-primary/20 hover:bg-white">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.subtitle || "—"}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      {item.status ? (
                        <p className="text-[11px] font-medium text-primary">
                          {item.status}
                        </p>
                      ) : null}
                      <p className="text-xs text-muted-foreground">
                        {formatActivityDate(item.date)}
                      </p>
                      {item.amount ? (
                        <p className="text-xs font-medium text-foreground">
                          {item.amount}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-black/10 bg-[#F7F5F3]/70 text-sm text-muted-foreground">
              {loading ? "Loading activity..." : "No recent activity found."}
            </div>
          )}
        </SectionCard>

        <SectionCard className="min-h-[220px] p-4 sm:p-5">
          <h2 className="mb-4 text-[15px] font-semibold text-foreground">
            Overview
          </h2>
          {view.overview.length > 0 ? (
            <div className="space-y-2">
              {view.overview.map((item) => {
                const row = (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-black/[0.06] bg-[#F7F5F3]/70 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      {item.value}
                      {item.href ? (
                        <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                      ) : null}
                    </span>
                  </div>
                );

                return item.href ? (
                  <Link key={item.label} href={item.href} className="block no-underline">
                    {row}
                  </Link>
                ) : (
                  <div key={item.label}>{row}</div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-[180px] items-center justify-center rounded-xl border border-dashed border-black/10 bg-[#F7F5F3]/70 text-sm text-muted-foreground">
              {loading ? "Loading overview..." : "Overview data will appear here."}
            </div>
          )}
        </SectionCard>
      </div>
    </PageShell>
  );
};

export default RoleDashboard;
