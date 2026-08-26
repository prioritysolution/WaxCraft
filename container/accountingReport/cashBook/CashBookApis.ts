import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

export const getCashBookAPI = async (
  fromDate: string,
  orgId: string | number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getCashBook(fromDate, orgId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
