import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import {
  OrderFinalCloseBody,
  OrderProcessBody,
} from "@/types/inventoryVoucher/OrderProcessTypes";

const getWorkStatusInFlight = createInFlightRequest<ApiResponse>();
const getEmployeeListForOrderProcessInFlight =
  createInFlightRequest<ApiResponse>();

const buildGetWorkStatusKey = (
  orgId: number | string,
  orderId: number,
) => `${orgId}:${orderId}`;

const buildGetEmployeeListForOrderProcessKey = (orgId: number | string) =>
  String(orgId);

const invalidateOrderProcessInFlight = () => {
  getWorkStatusInFlight.clear();
  getEmployeeListForOrderProcessInFlight.clear();
};

export const addOrderProcessAPI = async (
  bodyData: OrderProcessBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addOrderProcess,
    bodyData,
  };

  invalidateOrderProcessInFlight();

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const getWorkStatusAPI = async (
  orgId: number | string,
  orderId: number
): Promise<ApiResponse> => {
  const key = buildGetWorkStatusKey(orgId, orderId);

  return getWorkStatusInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getWorkStatus(orgId, orderId),
    }),
  );
};

export const getEmployeeListForOrderProcessAPI = async (
  orgId: number | string,
): Promise<ApiResponse> => {
  const key = buildGetEmployeeListForOrderProcessKey(orgId);

  return getEmployeeListForOrderProcessInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getEmployeeListForOrderProcess(orgId),
    }),
  );
};

export const addOrderFinalCloseAPI = async (
  bodyData: OrderFinalCloseBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addOrderFinalClose,
    bodyData,
  };

  invalidateOrderProcessInFlight();

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};
