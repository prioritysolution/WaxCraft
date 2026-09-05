import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

export const getBankLedgerAPI = async (
  fromDate: string,
  toDate: string,
  bankId: string,
  orgId: string | number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getBankLedger(fromDate, toDate, bankId, orgId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
