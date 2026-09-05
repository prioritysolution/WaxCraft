import { useState, useLayoutEffect, useEffect } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

import { useDispatch, useSelector } from "react-redux";
import { getSidebarAPI } from "./SidebarApis";
import { getSidebarData } from "./SidebarReducer";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/ApiTypes";

export const useSidebar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Use useLayoutEffect to synchronously update Redux state before browser paints.
  // This completely eliminates the visual "empty" flicker!
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
  
  useIsomorphicLayoutEffect(() => {
    const orgId = Cookies.get("waxCraftClientOrgId");
    if (orgId) {
      const cachedData = localStorage.getItem(`sidebarData_${orgId}`);
      if (cachedData) {
        try {
          dispatch(getSidebarData(JSON.parse(cachedData)));
        } catch (e) {
          console.error("Failed to parse cached sidebar data", e);
        }
      }
    }
  }, [dispatch]);

  const [loading, setLoading] = useState(false);

  // Function to call the login API
  const getSidebarApiCall = async (orgId: number | string) => {
    const cachedData = localStorage.getItem(`sidebarData_${orgId}`);
    if (!cachedData) {
      // Only show loading skeleton if we don't have cached data at all
      setLoading(true);
    }

    try {
      const res: ApiResponse = await getSidebarAPI(orgId);

      if (res.status === 200) {
        const newData = res?.data?.details || [];
        dispatch(getSidebarData(newData));
        localStorage.setItem(`sidebarData_${orgId}`, JSON.stringify(newData));
      } else {
        dispatch(getSidebarData([]));
        localStorage.removeItem(`sidebarData_${orgId}`);
        toast.error(res.data.message || "No data available");
      }
    } catch (err) {
      if (!cachedData) {
        dispatch(getSidebarData([]));
      }
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getSidebarApiCall,
  };
};
