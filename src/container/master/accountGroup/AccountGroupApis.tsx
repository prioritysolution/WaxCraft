import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { AccountGroupBody } from "@/types/master/AccountGroupTypes";

const getAccountGroupInFlight = createInFlightRequest<ApiResponse>();
const getAccountMainHeadInFlight = createInFlightRequest<ApiResponse>();

const buildGetAccountGroupKey = (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number,
) => `${orgId}:${page}:${keyword}:${perPage ?? ""}`;

const buildGetAccountMainHeadKey = (
  orgId: string | number,
  page: number,
  keyword: string,
) => `${orgId}:${page}:${keyword}`;

const invalidateGetAccountGroupInFlight = () => {
  getAccountGroupInFlight.clear();
  getAccountMainHeadInFlight.clear();
};

export const addAccountGroupAPI = async (
  bodyData: AccountGroupBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addAccountGroup,
    bodyData,
  };

  invalidateGetAccountGroupInFlight();

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

  invalidateGetAccountGroupInFlight();

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
  const key = buildGetAccountGroupKey(orgId, page, keyword, perPage);

  return getAccountGroupInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getAccountGroup(orgId, page, keyword, perPage),
    }),
  );
};

export const getAccountMainHeadAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  const key = buildGetAccountMainHeadKey(orgId, page, keyword);

  return getAccountMainHeadInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getAccountMainHead(orgId, page, keyword),
    }),
  );
};

export const deleteAccountGroupAPI = async (bodyData: {
  org_id: number;
  head_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteAccountGroup,
    bodyData,
  };

  invalidateGetAccountGroupInFlight();

  const res = await doPutApiCall(data);

  return res;
};
