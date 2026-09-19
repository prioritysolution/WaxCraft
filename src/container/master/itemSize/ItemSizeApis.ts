import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { ItemSizeBody } from "@/types/master/ItemSizeTypes";

const getItemSizeInFlight = createInFlightRequest<ApiResponse>();
const getItemSizeUnderModelInFlight = createInFlightRequest<ApiResponse>();

const buildGetItemSizeKey = (
  orgId: string | number,
  page: number,
  perPage?: number,
) => `${orgId}:${page}:${perPage ?? ""}`;

const buildGetItemSizeUnderModelKey = (
  orgId: string | number,
  modId: string,
) => `${orgId}:${modId}`;

const invalidateGetItemSizeInFlight = () => {
  getItemSizeInFlight.clear();
  getItemSizeUnderModelInFlight.clear();
};

export const addItemSizeAPI = async (
  bodyData: ItemSizeBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addItemSize,
    bodyData,
  };

  invalidateGetItemSizeInFlight();

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const updateItemSizeAPI = async (
  bodyData: ItemSizeBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateItemSize,
    bodyData,
  };

  invalidateGetItemSizeInFlight();

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getItemSizeAPI = async (
  orgId: string | number,
  page: number,
  perPage?: number
): Promise<ApiResponse> => {
  const key = buildGetItemSizeKey(orgId, page, perPage);

  return getItemSizeInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getItemSize(orgId, page, perPage),
    }),
  );
};

export const getItemSizeUnderModelAPI = async (
  orgId: string | number,
  modId: string
): Promise<ApiResponse> => {
  const key = buildGetItemSizeUnderModelKey(orgId, modId);

  return getItemSizeUnderModelInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getItemSizeUnderModel(orgId, modId),
    }),
  );
};

export const deleteItemSizeAPI = async (bodyData: {
  org_id: number;
  size_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteItemSize,
    bodyData,
  };

  invalidateGetItemSizeInFlight();

  const res = await doPutApiCall(data);

  return res;
};
