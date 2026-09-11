import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { AddUserBody } from "@/types/tools/AddUserTypes";

export const addUserAPI = async (
  bodyData: AddUserBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addUser,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const updateUserAPI = async (
  bodyData: AddUserBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateUser,
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getUserListAPI = async (
  orgId: string | number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getUserList(orgId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getUserRolesAPI = async (): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getUserRoles,
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
