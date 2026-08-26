import { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

import { useDispatch } from "react-redux";
import { getSidebarAPI } from "./SidebarApis";
import { getSidebarData } from "./SidebarReducer";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/ApiTypes";

export const useSidebar = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  // Function to call the login API
  const getSidebarApiCall = async (orgId: number | string) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getSidebarAPI(orgId);

      if (res.status === 200) {
        dispatch(getSidebarData(res?.data?.details));
      } else {
        dispatch(getSidebarData([]));
        toast.error(res.data.message || "No data available");
      }
    } catch (err) {
      dispatch(getSidebarData([]));
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
