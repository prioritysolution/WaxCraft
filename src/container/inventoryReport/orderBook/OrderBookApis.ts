import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

const getOrderBookInFlight = createInFlightRequest<ApiResponse>();

const buildGetOrderBookKey = (
  fromDate: string,
  toDate: string,
  partyId: string,
  orgId: string | number,
) => `${fromDate}:${toDate}:${partyId}:${orgId}`;

export const getOrderBookAPI = async (
  fromDate: string,
  toDate: string,
  partyId: string,
  orgId: string | number
): Promise<ApiResponse> => {
  const key = buildGetOrderBookKey(fromDate, toDate, partyId, orgId);

  return getOrderBookInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getOrderBook(fromDate, toDate, partyId, orgId),
    }),
  );
};
