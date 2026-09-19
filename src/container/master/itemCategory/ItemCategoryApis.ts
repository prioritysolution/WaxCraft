import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { ItemCategoryBody } from "@/types/master/ItemCategoryTypes";

const getItemCategoryInFlight = createInFlightRequest<ApiResponse>();

const buildGetItemCategoryKey = (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number,
) => `${orgId}:${page}:${keyword}:${perPage ?? ""}`;

const invalidateGetItemCategoryInFlight = () => {
  getItemCategoryInFlight.clear();
};

export const addItemCategoryAPI = async (
  bodyData: ItemCategoryBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addItemCategory,
    bodyData,
  };

  invalidateGetItemCategoryInFlight();

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const updateItemCategoryAPI = async (
  bodyData: ItemCategoryBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateItemCategory,
    bodyData,
  };

  invalidateGetItemCategoryInFlight();

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getItemCategoryAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number
): Promise<ApiResponse> => {
  const key = buildGetItemCategoryKey(orgId, page, keyword, perPage);

  return getItemCategoryInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getItemCategory(orgId, page, keyword, perPage),
    }),
  );
};

export const deleteItemCategoryAPI = async (bodyData: {
  org_id: number;
  cat_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteItemCategory,
    bodyData,
  };

  invalidateGetItemCategoryInFlight();

  const res = await doPutApiCall(data);

  return res;
};
