import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

const getDayBookInFlight = createInFlightRequest<ApiResponse>();

const buildGetDayBookKey = (
  fromDate: string,
  orgId: string | number,
) => `${fromDate}:${orgId}`;

export const getDayBookAPI = async (
  fromDate: string,
  orgId: string | number
): Promise<ApiResponse> => {
  const key = buildGetDayBookKey(fromDate, orgId);

  return getDayBookInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getDayBook(fromDate, orgId),
    }),
  );
};
