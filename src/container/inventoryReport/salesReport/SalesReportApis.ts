import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

const getSalesReportInFlight = createInFlightRequest<ApiResponse>();

const buildGetSalesReportKey = (
  fromDate: string,
  toDate: string,
  partyId: string,
  orgId: string | number,
) => `${fromDate}:${toDate}:${partyId}:${orgId}`;

export const getSalesReportAPI = async (
  fromDate: string,
  toDate: string,
  partyId: string,
  orgId: string | number
): Promise<ApiResponse> => {
  const key = buildGetSalesReportKey(fromDate, toDate, partyId, orgId);

  return getSalesReportInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getSalesReport(fromDate, toDate, partyId, orgId),
    }),
  );
};
