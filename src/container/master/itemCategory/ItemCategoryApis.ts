import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { ItemCategoryBody } from "@/types/master/ItemCategoryTypes";

export const addItemCategoryAPI = async (
  bodyData: ItemCategoryBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addItemCategory,
    bodyData,
  };

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
  let data = {
    url: endPoints.getItemCategory(orgId, page, keyword, perPage),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const deleteItemCategoryAPI = async (bodyData: {
  org_id: number;
  cat_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteItemCategory,
    bodyData,
  };

  const res = await doPutApiCall(data);

  return res;
};
