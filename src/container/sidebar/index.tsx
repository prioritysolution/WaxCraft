import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useSidebar } from "./Hooks";
import Sidebar from "@/components/sidebar";

const SidebarContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const { loading, getSidebarApiCall } = useSidebar();

  useEffect(() => {
    if (token && orgId) {
      getSidebarApiCall(orgId);
    }
  }, [token, orgId]);

  return <Sidebar loading={loading} />;
};
export default SidebarContainer;
