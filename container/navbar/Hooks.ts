import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { ApiResponse } from "@/types/ApiTypes";
import { getLogoutAPI } from "./NavbarApis";

export const useNavbar = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleLogout = () => {
    getLogoutApiCall();
  };

  // Function to call the login API
  const getLogoutApiCall = async () => {
    setLoading(true);

    try {
      const res: ApiResponse = await getLogoutAPI();

      if (res.status === 200) {
        toast.success(res.data.message);

        // Save the token in a cookie with secure settings
        Cookies.remove("waxCraftClientToken");
        Cookies.remove("waxCraftClientOrgId");
        Cookies.remove("waxCraftClientOrgName");
        Cookies.remove("waxCraftClientOrgAddress");
        Cookies.remove("waxCraftClientOrgMobile");
        Cookies.remove("waxCraftClientOrgGst");
        Cookies.remove("waxCraftClientOrgPan");
        Cookies.remove("waxCraftClientFinStartDate");
        Cookies.remove("waxCraftClientFinEndDate");
        Cookies.remove("waxCraftClientFinId");
        Cookies.remove("waxCraftClientUserName");

        router.push("/login");
      } else {
        // Handle the case when login fails
        toast.error(res.data.message || "Unknown error");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleLogout,
  };
};
