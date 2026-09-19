import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { ItemColourBody } from "@/types/master/ItemColourTypes";

const getItemColourInFlight = createInFlightRequest<ApiResponse>();

const buildGetItemColourKey = (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage: number,
) => `${orgId}:${page}:${keyword}:${perPage}`;

const invalidateGetItemColourInFlight = () => {
  getItemColourInFlight.clear();
};

export const addItemColourAPI = async (
  bodyData: ItemColourBody,
): Promise<ApiResponse> => {
  const data = {
    url: endPoints.addItemColour,
    bodyData,
  };

  invalidateGetItemColourInFlight();

  return await doPostApiCall(data);
};

export const updateItemColourAPI = async (
  bodyData: ItemColourBody,
): Promise<ApiResponse> => {
  const data = {
    url: endPoints.updateItemColour,
    bodyData,
  };

  invalidateGetItemColourInFlight();

  return await doPutApiCall(data);
};

export const getItemColourAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage = 10,
): Promise<ApiResponse> => {
  const key = buildGetItemColourKey(orgId, page, keyword, perPage);

  return getItemColourInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getItemColour(orgId, page, keyword, perPage),
    }),
  );
};

export const deleteItemColourAPI = async (bodyData: {
  org_id: number;
  color_id: number;
}): Promise<ApiResponse> => {
  const data = {
    url: endPoints.deleteItemColour,
    bodyData,
  };

  invalidateGetItemColourInFlight();

  return await doPutApiCall(data);
};
