import { ApiResponse } from "@/types/ApiTypes";
import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { AddRoleAssignBody } from "@/types/tools/RoleAssignTypes";

export const addRoleAssignAPI = async (
  bodyData: AddRoleAssignBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addRoleAssign,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const getModuleDataAPI = async (orgId: number): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getModuleData(orgId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
