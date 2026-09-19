import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

const getPartyItemLedgerInFlight = createInFlightRequest<ApiResponse>();

const buildGetPartyItemLedgerKey = (
  fromDate: string,
  toDate: string,
  partyId: string,
  orgId: string | number,
) => `${fromDate}:${toDate}:${partyId}:${orgId}`;

export const getPartyItemLedgerAPI = async (
  fromDate: string,
  toDate: string,
  partyId: string,
  orgId: string | number
): Promise<ApiResponse> => {
  const key = buildGetPartyItemLedgerKey(fromDate, toDate, partyId, orgId);

  return getPartyItemLedgerInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getPartyItemLedger(fromDate, toDate, partyId, orgId),
    }),
  );
};
