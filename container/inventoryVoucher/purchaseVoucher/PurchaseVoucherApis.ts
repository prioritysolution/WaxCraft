import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { PurchaseVoucherBody } from "@/types/inventoryVoucher/PurchaseVoucherTypes";

export const addPurchaseVoucherAPI = async (
  bodyData: PurchaseVoucherBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addPurchaseVoucher,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const deletePurchaseVoucherAPI = async (bodyData: {
  org_id: number;
  pur_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deletePurchaseVoucher,
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getPurchaseVoucherAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getPurchaseVoucher(orgId, page, keyword),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getPurchasePartyAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getPurchaseParty(orgId, page, keyword),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getItemRequisitionAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  const data = {
    url: endPoints.getItemRequisition(orgId, page, keyword),
  };

  return doGetApiCall(data);
};
