import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import {
  PartyMakingRateBody,
  PartyMakingRateSaveBody,
} from "@/types/master/PartyMakingRateTypes";

const getPartyMakingRateInFlight = createInFlightRequest<ApiResponse>();
const getPartyMakingRateByPartyInFlight = createInFlightRequest<ApiResponse>();
const getPartyMakingRateLogInFlight = createInFlightRequest<ApiResponse>();

const buildGetPartyMakingRateKey = (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage: number,
) => `${orgId}:${page}:${keyword}:${perPage}`;

const buildGetPartyMakingRateByPartyKey = (
  orgId: string | number,
  partyId: string | number,
) => `${orgId}:${partyId}`;

const buildGetPartyMakingRateLogKey = (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage: number,
) => `${orgId}:${page}:${keyword}:${perPage}`;

const invalidateGetPartyMakingRateInFlight = () => {
  getPartyMakingRateInFlight.clear();
  getPartyMakingRateByPartyInFlight.clear();
  getPartyMakingRateLogInFlight.clear();
};

export const addPartyMakingRateAPI = async (
  bodyData: PartyMakingRateBody,
): Promise<ApiResponse> => {
  invalidateGetPartyMakingRateInFlight();

  return await doPostApiCall({
    url: endPoints.addPartyMakingRate,
    bodyData,
  });
};

export const updatePartyMakingRateAPI = async (
  bodyData: PartyMakingRateBody,
): Promise<ApiResponse> => {
  invalidateGetPartyMakingRateInFlight();

  return await doPutApiCall({
    url: endPoints.updatePartyMakingRate,
    bodyData,
  });
};

export const savePartyMakingRateAPI = async (
  bodyData: PartyMakingRateSaveBody,
): Promise<ApiResponse> => {
  invalidateGetPartyMakingRateInFlight();

  return await doPostApiCall({
    url: endPoints.savePartyMakingRate,
    bodyData,
  });
};

export const getPartyMakingRateAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage = 10,
): Promise<ApiResponse> => {
  const key = buildGetPartyMakingRateKey(orgId, page, keyword, perPage);

  return getPartyMakingRateInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getPartyMakingRate(orgId, page, keyword, perPage),
    }),
  );
};

export const deletePartyMakingRateAPI = async (bodyData: {
  org_id: number;
  making_rate_id: number;
}): Promise<ApiResponse> => {
  invalidateGetPartyMakingRateInFlight();

  return await doPutApiCall({
    url: endPoints.deletePartyMakingRate,
    bodyData,
  });
};

export const getPartyMakingRateLogAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage = 10,
): Promise<ApiResponse> => {
  const key = buildGetPartyMakingRateLogKey(orgId, page, keyword, perPage);

  return getPartyMakingRateLogInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getPartyMakingRateLog(orgId, page, keyword, perPage),
    }),
  );
};

export const getPartyMakingRateByPartyAPI = async (
  orgId: string | number,
  partyId: string | number,
): Promise<ApiResponse> => {
  const key = buildGetPartyMakingRateByPartyKey(orgId, partyId);

  return getPartyMakingRateByPartyInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getPartyMakingRateByParty(orgId, partyId),
    }),
  );
};
