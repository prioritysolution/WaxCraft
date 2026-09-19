import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

const getPurchaseReportInFlight = createInFlightRequest<ApiResponse>();

const buildGetPurchaseReportKey = (
  fromDate: string,
  toDate: string,
  partyId: string,
  orgId: string | number,
) => `${fromDate}:${toDate}:${partyId}:${orgId}`;

export const getPurchaseReportAPI = async (
  fromDate: string,
  toDate: string,
  partyId: string,
  orgId: string | number
): Promise<ApiResponse> => {
  const key = buildGetPurchaseReportKey(fromDate, toDate, partyId, orgId);

  return getPurchaseReportInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getPurchaseReport(fromDate, toDate, partyId, orgId),
    }),
  );
};
