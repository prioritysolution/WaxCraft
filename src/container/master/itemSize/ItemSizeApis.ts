import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { ItemSizeBody } from "@/types/master/ItemSizeTypes";

export const addItemSizeAPI = async (
  bodyData: ItemSizeBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addItemSize,
    bodyData,
  };

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

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getItemSizeAPI = async (
  orgId: string | number,
  page: number,
  perPage?: number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getItemSize(orgId, page, perPage),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getItemSizeUnderModelAPI = async (
  orgId: string | number,
  modId: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getItemSizeUnderModel(orgId, modId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const deleteItemSizeAPI = async (bodyData: {
  org_id: number;
  size_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteItemSize,
    bodyData,
  };

  const res = await doPutApiCall(data);

  return res;
};
