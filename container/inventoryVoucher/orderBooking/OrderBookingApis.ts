import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { OrderBookingBody } from "@/types/inventoryVoucher/OrderBookingTypes";

export const addOrderBookingAPI = async (
  bodyData: OrderBookingBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addOrderBooking,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const deleteOrderBookingAPI = async (bodyData: {
  org_id: number;
  order_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteOrderBooking,
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getOrderBookingAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getOrderBooking(orgId, page, keyword),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getOrderPartyAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  partyId?: number | string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getOrderParty(orgId, page, keyword, partyId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getOrderDesignAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getOrderDesign(orgId, page, keyword),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getDesignDetailsAPI = async (
  orgId: string | number,
  designId: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getDesignDetails(orgId, designId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
