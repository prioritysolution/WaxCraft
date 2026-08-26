import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

export const getSalesReportAPI = async (
  fromDate: string,
  toDate: string,
  partyId: string,
  orgId: string | number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getSalesReport(fromDate, toDate, partyId, orgId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
