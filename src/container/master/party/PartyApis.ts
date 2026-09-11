import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { PartyBody } from "@/types/master/PartyTypes";

export const addPartyAPI = async (
  bodyData: PartyBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addParty,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const updatePartyAPI = async (
  bodyData: PartyBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateParty,
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getPartyAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getParty(orgId, page, keyword, perPage),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getPartyLedgerAPI = async (
  orgId: string | number,
  type: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getPartyLedgerList(orgId, type),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const deletePartyAPI = async (bodyData: {
  org_id: number;
  party_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteParty,
    bodyData,
  };

  const res = await doPutApiCall(data);

  return res;
};
