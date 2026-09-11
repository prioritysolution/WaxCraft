import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

export const getPartyLedgerAPI = async (
  fromDate: string,
  toDate: string,
  partyId: string,
  type: string,
  orgId: string | number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getPartyLedger(fromDate, toDate, partyId, type, orgId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
