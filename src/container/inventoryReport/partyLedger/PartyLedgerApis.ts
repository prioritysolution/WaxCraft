import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

const getPartyLedgerInFlight = createInFlightRequest<ApiResponse>();

const buildGetPartyLedgerKey = (
  fromDate: string,
  toDate: string,
  partyId: string,
  type: string,
  orgId: string | number,
) => `${fromDate}:${toDate}:${partyId}:${type}:${orgId}`;

export const getPartyLedgerAPI = async (
  fromDate: string,
  toDate: string,
  partyId: string,
  type: string,
  orgId: string | number
): Promise<ApiResponse> => {
  const key = buildGetPartyLedgerKey(fromDate, toDate, partyId, type, orgId);

  return getPartyLedgerInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getPartyLedger(fromDate, toDate, partyId, type, orgId),
    }),
  );
};
