import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { SizeColourBody } from "@/types/master/SizeColourTypes";

const getSizeColourInFlight = createInFlightRequest<ApiResponse>();
const getColourUnderSizeInFlight = createInFlightRequest<ApiResponse>();

const buildGetSizeColourKey = (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number,
) => `${orgId}:${page}:${keyword}:${perPage ?? ""}`;

const buildGetColourUnderSizeKey = (
  orgId: string | number,
  sizeId: string,
) => `${orgId}:${sizeId}`;

const invalidateGetSizeColourInFlight = () => {
  getSizeColourInFlight.clear();
  getColourUnderSizeInFlight.clear();
};

export const addSizeColourAPI = async (
  bodyData: SizeColourBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addSizeColour,
    bodyData,
  };

  invalidateGetSizeColourInFlight();

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const updateSizeColourAPI = async (
  bodyData: SizeColourBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateSizeColour,
    bodyData,
  };

  invalidateGetSizeColourInFlight();

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getSizeColourAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number
): Promise<ApiResponse> => {
  const key = buildGetSizeColourKey(orgId, page, keyword, perPage);

  return getSizeColourInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getSizeColour(orgId, page, keyword, perPage),
    }),
  );
};

export const getColourUnderSizeAPI = async (
  orgId: string | number,
  sizeId: string
): Promise<ApiResponse> => {
  const key = buildGetColourUnderSizeKey(orgId, sizeId);

  return getColourUnderSizeInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getColourUnderSize(orgId, sizeId),
    }),
  );
};

export const deleteSizeColourAPI = async (bodyData: {
  org_id: number;
  col_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteSizeColour,
    bodyData,
  };

  invalidateGetSizeColourInFlight();

  const res = await doPutApiCall(data);

  return res;
};
