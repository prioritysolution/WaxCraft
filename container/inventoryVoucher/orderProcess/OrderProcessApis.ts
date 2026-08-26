import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import {
  OrderFinalCloseBody,
  OrderProcessBody,
} from "@/types/inventoryVoucher/OrderProcessTypes";

export const addOrderProcessAPI = async (
  bodyData: OrderProcessBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addOrderProcess,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const getWorkStatusAPI = async (
  orgId: number | string,
  orderId: number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getWorkStatus(orgId, orderId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const addOrderFinalCloseAPI = async (
  bodyData: OrderFinalCloseBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addOrderFinalClose,
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};
