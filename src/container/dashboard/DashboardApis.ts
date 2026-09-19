import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

const getDashboardStatsInFlight = createInFlightRequest<ApiResponse>();

const buildGetDashboardStatsKey = (
  orgId: string | number,
  formDate: string,
  toDate: string,
  partyId: string | number = "0",
) => `${orgId}:${formDate}:${toDate}:${partyId}`;

export const getDashboardStatsAPI = async (
  orgId: string | number,
  formDate: string,
  toDate: string,
  partyId: string | number = "0"
): Promise<ApiResponse> => {
  const key = buildGetDashboardStatsKey(orgId, formDate, toDate, partyId);

  return getDashboardStatsInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getDashboardStats(orgId, formDate, toDate, partyId),
    }),
  );
};
