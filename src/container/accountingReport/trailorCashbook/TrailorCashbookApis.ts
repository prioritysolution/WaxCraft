import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

export const getTrailorCashbookAPI = async (
  fromDate: string,
  userId: string,
  orgId: string | number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getTrailorCashbook(fromDate, userId, orgId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
