import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { ItemRateBody } from "@/types/master/ItemRateTypes";

export const addItemRateAPI = async (
  bodyData: ItemRateBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addItemRate,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const getItemRateAPI = async (
  orgId: string | number,
  itemId: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getItemRate(orgId, itemId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
