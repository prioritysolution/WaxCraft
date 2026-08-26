import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { ItemUnitBody } from "@/types/master/ItemUnitTypes";

export const addItemUnitAPI = async (
  bodyData: ItemUnitBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addItemUnit,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const updateItemUnitAPI = async (
  bodyData: ItemUnitBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateItemUnit,
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getItemUnitAPI = async (
  orgId: string | number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getItemUnit(orgId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const deleteItemUnitAPI = async (bodyData: {
  org_id: number;
  unit_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteItemUnit,
    bodyData,
  };

  const res = await doPutApiCall(data);

  return res;
};
