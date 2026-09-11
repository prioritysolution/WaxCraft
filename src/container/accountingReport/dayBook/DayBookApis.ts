import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

export const getDayBookAPI = async (
  fromDate: string,
  orgId: string | number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getDayBook(fromDate, orgId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
