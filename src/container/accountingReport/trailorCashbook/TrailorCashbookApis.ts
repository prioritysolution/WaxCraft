import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

const getTrailorCashbookInFlight = createInFlightRequest<ApiResponse>();

const buildGetTrailorCashbookKey = (
  fromDate: string,
  userId: string,
  orgId: string | number,
) => `${fromDate}:${userId}:${orgId}`;

export const getTrailorCashbookAPI = async (
  fromDate: string,
  userId: string,
  orgId: string | number
): Promise<ApiResponse> => {
  const key = buildGetTrailorCashbookKey(fromDate, userId, orgId);

  return getTrailorCashbookInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getTrailorCashbook(fromDate, userId, orgId),
    }),
  );
};
