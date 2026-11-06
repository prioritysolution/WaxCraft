"use client";

import Dashboard from "@/components/dashboard";
import RoleDashboard from "@/components/dashboard/RoleDashboard";
import { PageShell } from "@/components/ui/page-shell";
import { Spinner } from "@heroui/react";
import { useDashboard } from "./Hooks";
import { useCurrentRole } from "./useCurrentRole";
import { useRoleDashboard } from "./useRoleDashboard";
import { DashboardRole } from "@/lib/dashboardRoles";

const AdminDashboard = () => {
  const {
    loading,
    stats,
    overview,
    recentActivity,
    charts,
    periodLabel,
    refreshDashboard,
  } = useDashboard();

  return (
    <Dashboard
      loading={loading}
      stats={stats}
      overview={overview}
      recentActivity={recentActivity}
      charts={charts}
      periodLabel={periodLabel}
      onRefresh={refreshDashboard}
    />
  );
};

const ScopedDashboard = ({
  role,
  userId,
}: {
  role: Exclude<DashboardRole, "admin" | "unknown">;
  userId: number | null;
}) => {
  const { loading, periodLabel, view, refreshDashboard } = useRoleDashboard(
    role,
    userId,
  );

  return (
    <RoleDashboard
      loading={loading}
      periodLabel={periodLabel}
      view={view}
      onRefresh={refreshDashboard}
    />
  );
};

const DashboardContainer = () => {
  const { loading, role, roleName, userId } = useCurrentRole();

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[320px] items-center justify-center">
          <Spinner size="lg" color="primary" />
        </div>
      </PageShell>
    );
  }

  if (role === "admin") return <AdminDashboard />;

  if (role === "manager" || role === "accountant" || role === "operator") {
    return <ScopedDashboard role={role} userId={userId} />;
  }

  return (
    <PageShell>
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-2 text-center">
        <p className="text-base font-medium text-foreground">
          Dashboard is not available for this role
        </p>
        <p className="text-sm text-muted-foreground">
          {roleName
            ? `Signed in as ${roleName}.`
            : "The user profile did not return a role."}
        </p>
      </div>
    </PageShell>
  );
};

export default DashboardContainer;
