import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { PurchaseVoucherBody } from "@/types/inventoryVoucher/PurchaseVoucherTypes";

const getPurchaseVoucherInFlight = createInFlightRequest<ApiResponse>();
const getPurchasePartyInFlight = createInFlightRequest<ApiResponse>();
const getItemRequisitionInFlight = createInFlightRequest<ApiResponse>();

const buildGetPurchaseVoucherKey = (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number,
) => `${orgId}:${page}:${keyword}:${perPage ?? ""}`;

const buildGetPurchasePartyKey = (
  orgId: string | number,
  page: number,
  keyword: string,
) => `${orgId}:${page}:${keyword}`;

const buildGetItemRequisitionKey = (
  orgId: string | number,
  page: number,
  keyword: string,
) => `${orgId}:${page}:${keyword}`;

const invalidatePurchaseVoucherInFlight = () => {
  getPurchaseVoucherInFlight.clear();
  getPurchasePartyInFlight.clear();
  getItemRequisitionInFlight.clear();
};

export const addPurchaseVoucherAPI = async (
  bodyData: PurchaseVoucherBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addPurchaseVoucher,
    bodyData,
  };

  invalidatePurchaseVoucherInFlight();

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

  invalidatePurchaseVoucherInFlight();

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getPurchaseVoucherAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number
): Promise<ApiResponse> => {
  const key = buildGetPurchaseVoucherKey(orgId, page, keyword, perPage);

  return getPurchaseVoucherInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getPurchaseVoucher(orgId, page, keyword, perPage),
    }),
  );
};

export const getPurchasePartyAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  const key = buildGetPurchasePartyKey(orgId, page, keyword);

  return getPurchasePartyInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getPurchaseParty(orgId, page, keyword),
    }),
  );
};

export const getItemRequisitionAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  const key = buildGetItemRequisitionKey(orgId, page, keyword);

  return getItemRequisitionInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getItemRequisition(orgId, page, keyword),
    }),
  );
};
