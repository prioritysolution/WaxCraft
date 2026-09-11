import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { ApiResponse } from "@/types/ApiTypes";
import {
  DashboardActivityItem,
  DashboardCharts,
  DashboardOverviewItem,
  DashboardStat,
} from "@/types/dashboard/DashboardTypes";
import { DashboardStatsApiDetails } from "@/types/dashboard/DashboardApiTypes";
import { getDashboardStatsAPI } from "./DashboardApis";
import {
  formatDashboardPeriodLabel,
  mapDashboardStatsResponse,
} from "@/lib/mapDashboardStats";

const emptyCharts: DashboardCharts = {
  monthlyTrend: [],
  fyComparison: [],
  operations: [],
  businessMix: [],
};

export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [overview, setOverview] = useState<DashboardOverviewItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<DashboardActivityItem[]>(
    []
  );
  const [charts, setCharts] = useState<DashboardCharts>(emptyCharts);
  const [periodLabel, setPeriodLabel] = useState("Current financial year");

  const loadDashboard = useCallback(async () => {
    const orgId = getCookieData<number | null>("waxCraftClientOrgId");
    if (!orgId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const finStart =
      getCookieData<string>("waxCraftClientFinStartDate") ||
      format(new Date(new Date().getFullYear(), 3, 1), "yyyy-MM-dd");
    const finEnd =
      getCookieData<string>("waxCraftClientFinEndDate") ||
      format(new Date(), "yyyy-MM-dd");
    const reportToDate =
      finEnd < format(new Date(), "yyyy-MM-dd")
        ? finEnd
        : format(new Date(), "yyyy-MM-dd");

    const currentPeriodLabel = formatDashboardPeriodLabel(
      finStart,
      reportToDate
    );
    setPeriodLabel(currentPeriodLabel);

    try {
      const res: ApiResponse = await getDashboardStatsAPI(
        orgId,
        finStart,
        reportToDate,
        "0"
      );

      if (res.status === 200 && res.data.details) {
        const mapped = mapDashboardStatsResponse(
          res.data.details as DashboardStatsApiDetails,
          currentPeriodLabel
        );

        setStats(mapped.stats);
        setOverview(mapped.overview);
        setRecentActivity(mapped.recentActivity);
        setCharts(mapped.charts);
      } else {
        setStats([]);
        setOverview([]);
        setRecentActivity([]);
        setCharts(emptyCharts);
        toast.error(res.data.message || "Unable to load dashboard data");
      }
    } catch {
      setStats([]);
      setOverview([]);
      setRecentActivity([]);
      setCharts(emptyCharts);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    loading,
    stats,
    overview,
    recentActivity,
    charts,
    periodLabel,
    refreshDashboard: loadDashboard,
  };
};
