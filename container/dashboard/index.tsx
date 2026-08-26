"use client";

import Dashboard from "@/components/dashboard";
import { useDashboard } from "./Hooks";

const DashboardContainer = () => {
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

export default DashboardContainer;
