import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { PartyBody } from "@/types/master/PartyTypes";

const getPartyInFlight = createInFlightRequest<ApiResponse>();
const getPartyLedgerInFlight = createInFlightRequest<ApiResponse>();

const buildGetPartyKey = (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number,
) => `${orgId}:${page}:${keyword}:${perPage ?? ""}`;

const buildGetPartyLedgerKey = (
  orgId: string | number,
  type: string,
) => `${orgId}:${type}`;

const invalidateGetPartyInFlight = () => {
  getPartyInFlight.clear();
  getPartyLedgerInFlight.clear();
};

export const addPartyAPI = async (
  bodyData: PartyBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addParty,
    bodyData,
  };

  invalidateGetPartyInFlight();

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

  invalidateGetPartyInFlight();

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
  const key = buildGetPartyKey(orgId, page, keyword, perPage);

  return getPartyInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getParty(orgId, page, keyword, perPage),
    }),
  );
};

export const getPartyLedgerAPI = async (
  orgId: string | number,
  type: string
): Promise<ApiResponse> => {
  const key = buildGetPartyLedgerKey(orgId, type);

  return getPartyLedgerInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getPartyLedgerList(orgId, type),
    }),
  );
};

export const deletePartyAPI = async (bodyData: {
  org_id: number;
  party_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteParty,
    bodyData,
  };

  invalidateGetPartyInFlight();

  const res = await doPutApiCall(data);

  return res;
};
