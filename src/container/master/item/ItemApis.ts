import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { ItemBody } from "@/types/master/ItemTypes";

const getItemInFlight = createInFlightRequest<ApiResponse>();
const getItemUnderCategoryInFlight = createInFlightRequest<ApiResponse>();
const getPurchaseLedgerInFlight = createInFlightRequest<ApiResponse>();
const getSalesLedgerInFlight = createInFlightRequest<ApiResponse>();

const buildGetItemKey = (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number,
) => `${orgId}:${page}:${keyword}:${perPage ?? ""}`;

const buildGetItemUnderCategoryKey = (
  orgId: string | number,
  catId: string,
) => `${orgId}:${catId}`;

const buildGetPurchaseLedgerKey = (
  orgId: string | number,
  page: number,
  keyword: string,
) => `${orgId}:${page}:${keyword}`;

const buildGetSalesLedgerKey = (
  orgId: string | number,
  page: number,
  keyword: string,
) => `${orgId}:${page}:${keyword}`;

const invalidateGetItemInFlight = () => {
  getItemInFlight.clear();
  getItemUnderCategoryInFlight.clear();
  getPurchaseLedgerInFlight.clear();
  getSalesLedgerInFlight.clear();
};

export const addItemAPI = async (bodyData: ItemBody): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addItem,
    bodyData,
  };

  invalidateGetItemInFlight();

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

  invalidateGetItemInFlight();

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
  const key = buildGetItemKey(orgId, page, keyword, perPage);

  return getItemInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getItem(orgId, page, keyword, perPage),
    }),
  );
};

export const getItemUnderCategoryAPI = async (
  orgId: string | number,
  catId: string
): Promise<ApiResponse> => {
  const key = buildGetItemUnderCategoryKey(orgId, catId);

  return getItemUnderCategoryInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getItemUnderCategory(orgId, catId),
    }),
  );
};

export const getPurchaseLedgerAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  const key = buildGetPurchaseLedgerKey(orgId, page, keyword);

  return getPurchaseLedgerInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getPurchaseLedger(orgId, page, keyword),
    }),
  );
};

export const getSalesLedgerAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  const key = buildGetSalesLedgerKey(orgId, page, keyword);

  return getSalesLedgerInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getSalesLedger(orgId, page, keyword),
    }),
  );
};

export const deleteItemAPI = async (bodyData: {
  org_id: number;
  item_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteItem,
    bodyData,
  };

  invalidateGetItemInFlight();

  const res = await doPutApiCall(data);

  return res;
};
