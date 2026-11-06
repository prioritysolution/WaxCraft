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

const getRoleDashboardInFlight = createInFlightRequest<ApiResponse>();

export const getManagerDashboardAPI = async (
  orgId: string | number,
  formDate: string,
  toDate: string,
): Promise<ApiResponse> =>
  getRoleDashboardInFlight.run(`manager:${orgId}:${formDate}:${toDate}`, () =>
    doGetApiCall({
      url: endPoints.getManagerDashboard(orgId, formDate, toDate),
    }),
  );

export const getAccountantDashboardAPI = async (
  orgId: string | number,
  formDate: string,
  toDate: string,
): Promise<ApiResponse> =>
  getRoleDashboardInFlight.run(
    `accountant:${orgId}:${formDate}:${toDate}`,
    () =>
      doGetApiCall({
        url: endPoints.getAccountantDashboard(orgId, formDate, toDate),
      }),
  );

export const getOperatorDashboardAPI = async (
  orgId: string | number,
  formDate: string,
  toDate: string,
  userId: string | number,
): Promise<ApiResponse> =>
  getRoleDashboardInFlight.run(
    `operator:${orgId}:${formDate}:${toDate}:${userId}`,
    () =>
      doGetApiCall({
        url: endPoints.getOperatorDashboard(orgId, formDate, toDate, userId),
      }),
  );
