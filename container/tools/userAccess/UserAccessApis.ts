import { doGetApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { UserAccessBodyData } from "@/types/tools/UserAccessTypes";

export const updateUserAccessAPI = async (
  bodyData: UserAccessBodyData
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateUserAccess,
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getUserAccessAPI = async (
  orgId: string | number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getUserAccess(orgId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
