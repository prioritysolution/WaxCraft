import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

export const getDashboardStatsAPI = async (
  orgId: string | number,
  formDate: string,
  toDate: string,
  partyId: string | number = "0"
): Promise<ApiResponse> => {
  const data = {
    url: endPoints.getDashboardStats(orgId, formDate, toDate, partyId),
  };

  return doGetApiCall(data);
};
