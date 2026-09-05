import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { AccountGroupBody } from "@/types/master/AccountGroupTypes";

export const addAccountGroupAPI = async (
  bodyData: AccountGroupBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addAccountGroup,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const updateAccountGroupAPI = async (
  bodyData: AccountGroupBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateAccountGroup,
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getAccountGroupAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getAccountGroup(orgId, page, keyword, perPage),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getAccountMainHeadAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getAccountMainHead(orgId, page, keyword),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const deleteAccountGroupAPI = async (bodyData: {
  org_id: number;
  head_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteAccountGroup,
    bodyData,
  };

  const res = await doPutApiCall(data);

  return res;
};
