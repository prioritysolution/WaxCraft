import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { ItemModelBody } from "@/types/master/ItemModelTypes";

const getItemModelInFlight = createInFlightRequest<ApiResponse>();
const getItemModelUnderCategoryInFlight = createInFlightRequest<ApiResponse>();

const buildGetItemModelKey = (
  orgId: string | number,
  page: number,
  perPage?: number,
) => `${orgId}:${page}:${perPage ?? ""}`;

const buildGetItemModelUnderCategoryKey = (
  orgId: string | number,
  catId: string,
) => `${orgId}:${catId}`;

const invalidateGetItemModelInFlight = () => {
  getItemModelInFlight.clear();
  getItemModelUnderCategoryInFlight.clear();
};

export const addItemModelAPI = async (
  bodyData: ItemModelBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addItemModel,
    bodyData,
  };

  invalidateGetItemModelInFlight();

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const updateItemModelAPI = async (
  bodyData: ItemModelBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateItemModel,
    bodyData,
  };

  invalidateGetItemModelInFlight();

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getItemModelAPI = async (
  orgId: string | number,
  page: number,
  perPage?: number
): Promise<ApiResponse> => {
  const key = buildGetItemModelKey(orgId, page, perPage);

  return getItemModelInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getItemModel(orgId, page, perPage),
    }),
  );
};

export const getItemModelUnderCategoryAPI = async (
  orgId: string | number,
  catId: string
): Promise<ApiResponse> => {
  const key = buildGetItemModelUnderCategoryKey(orgId, catId);

  return getItemModelUnderCategoryInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getItemModelUnderCategory(orgId, catId),
    }),
  );
};

export const deleteItemModelAPI = async (bodyData: {
  org_id: number;
  model_Id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteItemModel,
    bodyData,
  };

  invalidateGetItemModelInFlight();

  const res = await doPutApiCall(data);

  return res;
};
