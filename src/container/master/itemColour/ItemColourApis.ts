import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { ItemColourBody } from "@/types/master/ItemColourTypes";

export const addItemColourAPI = async (
  bodyData: ItemColourBody,
): Promise<ApiResponse> => {
  const data = {
    url: endPoints.addItemColour,
    bodyData,
  };

  return await doPostApiCall(data);
};

export const updateItemColourAPI = async (
  bodyData: ItemColourBody,
): Promise<ApiResponse> => {
  const data = {
    url: endPoints.updateItemColour,
    bodyData,
  };

  return await doPutApiCall(data);
};

export const getItemColourAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage = 10,
): Promise<ApiResponse> => {
  const data = {
    url: endPoints.getItemColour(orgId, page, keyword, perPage),
  };

  return await doGetApiCall(data);
};

export const deleteItemColourAPI = async (bodyData: {
  org_id: number;
  color_id: number;
}): Promise<ApiResponse> => {
  const data = {
    url: endPoints.deleteItemColour,
    bodyData,
  };

  return await doPutApiCall(data);
};
