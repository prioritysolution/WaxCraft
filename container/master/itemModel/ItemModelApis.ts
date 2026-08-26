import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { ItemModelBody } from "@/types/master/ItemModelTypes";

export const addItemModelAPI = async (
  bodyData: ItemModelBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addItemModel,
    bodyData,
  };

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

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getItemModelAPI = async (
  orgId: string | number,
  page: number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getItemModel(orgId, page),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getItemModelUnderCategoryAPI = async (
  orgId: string | number,
  catId: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getItemModelUnderCategory(orgId, catId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const deleteItemModelAPI = async (bodyData: {
  org_id: number;
  model_Id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteItemModel,
    bodyData,
  };

  const res = await doPutApiCall(data);

  return res;
};
