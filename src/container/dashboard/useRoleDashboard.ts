import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { ApiResponse } from "@/types/ApiTypes";
import { DashboardRole } from "@/lib/dashboardRoles";
import { formatDashboardPeriodLabel } from "@/lib/mapDashboardStats";
import { mapRoleDashboard } from "@/lib/mapRoleDashboard";
import { RoleDashboardDetails, RoleDashboardView } from "@/types/dashboard/RoleDashboardTypes";
import {
  getAccountantDashboardAPI,
  getManagerDashboardAPI,
  getOperatorDashboardAPI,
} from "./DashboardApis";

const emptyView = (
  role: Exclude<DashboardRole, "admin" | "unknown">,
): RoleDashboardView => mapRoleDashboard(role, {});

export const useRoleDashboard = (
  role: Exclude<DashboardRole, "admin" | "unknown">,
  userId: number | null,
) => {
  const [loading, setLoading] = useState(true);
  const [periodLabel, setPeriodLabel] = useState("Current financial year");
  const [view, setView] = useState<RoleDashboardView>(() => emptyView(role));

  const loadDashboard = useCallback(async () => {
    const orgId = getCookieData<number | null>("waxCraftClientOrgId");
    if (!orgId) {
      setLoading(false);
      return;
    }

    if (role === "operator" && !userId) {
      setView(emptyView(role));
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

    setPeriodLabel(formatDashboardPeriodLabel(finStart, reportToDate));

    try {
      const res: ApiResponse =
        role === "manager"
          ? await getManagerDashboardAPI(orgId, finStart, reportToDate)
          : role === "accountant"
            ? await getAccountantDashboardAPI(orgId, finStart, reportToDate)
            : await getOperatorDashboardAPI(
                orgId,
                finStart,
                reportToDate,
                userId ?? 0,
              );

      if (res.status === 200 && res.data.details) {
        const details = (
          Array.isArray(res.data.details) ? res.data.details[0] : res.data.details
        ) as RoleDashboardDetails;
        setView(mapRoleDashboard(role, details ?? {}));
      } else {
        setView(emptyView(role));
        toast.error(res.data.message || "Unable to load dashboard data");
      }
    } catch {
      setView(emptyView(role));
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [role, userId]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return {
    loading,
    periodLabel,
    view,
    refreshDashboard: loadDashboard,
  };
};
