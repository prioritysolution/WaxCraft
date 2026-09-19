import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

const getCashBookInFlight = createInFlightRequest<ApiResponse>();

const buildGetCashBookKey = (
  fromDate: string,
  orgId: string | number,
) => `${fromDate}:${orgId}`;

export const getCashBookAPI = async (
  fromDate: string,
  orgId: string | number
): Promise<ApiResponse> => {
  const key = buildGetCashBookKey(fromDate, orgId);

  return getCashBookInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getCashBook(fromDate, orgId),
    }),
  );
};
