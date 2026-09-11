import { ApiResponse } from "@/types/ApiTypes";
import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getSidebarAPI = async (
  orgId: number | string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getSidebar(orgId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
