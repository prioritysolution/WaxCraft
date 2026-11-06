import { useEffect, useState } from "react";
import { getUserProfileAPI } from "@/container/profile/ProfileApis";
import { DashboardRole, resolveDashboardRole } from "@/lib/dashboardRoles";
import { ApiResponse } from "@/types/ApiTypes";

export const useCurrentRole = () => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<DashboardRole>("unknown");
  const [roleName, setRoleName] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res: ApiResponse = await getUserProfileAPI();
        if (cancelled) return;

        const profile = Array.isArray(res.data?.details)
          ? res.data.details[0]
          : res.data?.details;
        const name = String(profile?.Role_Name ?? "");
        setRoleName(name);
        setRole(resolveDashboardRole(name));
        const id = Number(profile?.Id);
        setUserId(Number.isFinite(id) && id > 0 ? id : null);
      } catch {
        if (!cancelled) {
          setRole("unknown");
          setRoleName("");
          setUserId(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { loading, role, roleName, userId };
};
