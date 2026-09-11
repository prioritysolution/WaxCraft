import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

export const getPurchaseReportAPI = async (
  fromDate: string,
  toDate: string,
  partyId: string,
  orgId: string | number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getPurchaseReport(fromDate, toDate, partyId, orgId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
