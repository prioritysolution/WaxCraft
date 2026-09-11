import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { ItemBody } from "@/types/master/ItemTypes";

export const addItemAPI = async (bodyData: ItemBody): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addItem,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const updateItemAPI = async (
  bodyData: ItemBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateItem,
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getItemAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getItem(orgId, page, keyword, perPage),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getItemUnderCategoryAPI = async (
  orgId: string | number,
  catId: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getItemUnderCategory(orgId, catId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getPurchaseLedgerAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getPurchaseLedger(orgId, page, keyword),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getSalesLedgerAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getSalesLedger(orgId, page, keyword),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const deleteItemAPI = async (bodyData: {
  org_id: number;
  item_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteItem,
    bodyData,
  };

  const res = await doPutApiCall(data);

  return res;
};
