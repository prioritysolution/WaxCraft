import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { OrderBookingBody } from "@/types/inventoryVoucher/OrderBookingTypes";

const DESIGN_DETAILS_CACHE_TTL_MS = 5 * 60 * 1000;
const designDetailsCache = new Map<
  string,
  { data: ApiResponse; ts: number }
>();
const getDesignDetailsInFlight = createInFlightRequest<ApiResponse>();
const getOrderBookingInFlight = createInFlightRequest<ApiResponse>();
const getOrderPartyInFlight = createInFlightRequest<ApiResponse>();
const getOrderDesignInFlight = createInFlightRequest<ApiResponse>();

const buildDesignDetailsKey = (
  orgId: string | number,
  designId: string,
) => `${orgId}:${designId}`;

const buildGetOrderBookingKey = (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number,
) => `${orgId}:${page}:${keyword}:${perPage ?? ""}`;

const buildGetOrderPartyKey = (
  orgId: string | number,
  page: number,
  keyword: string,
  partyId?: number | string,
) => `${orgId}:${page}:${keyword}:${partyId ?? ""}`;

const buildGetOrderDesignKey = (
  orgId: string | number,
  page: number,
  keyword: string,
) => `${orgId}:${page}:${keyword}`;

const invalidateOrderBookingInFlight = () => {
  getOrderBookingInFlight.clear();
  getOrderPartyInFlight.clear();
  getOrderDesignInFlight.clear();
  getDesignDetailsInFlight.clear();
};

export const clearDesignDetailsCache = (
  orgId?: string | number,
  designId?: string | number,
) => {
  if (orgId != null && designId != null) {
    designDetailsCache.delete(buildDesignDetailsKey(orgId, String(designId)));
    return;
  }
  designDetailsCache.clear();
};

export const addOrderBookingAPI = async (
  bodyData: OrderBookingBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addOrderBooking,
    bodyData,
  };

  invalidateOrderBookingInFlight();

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

  invalidateOrderBookingInFlight();

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getOrderBookingAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number
): Promise<ApiResponse> => {
  const key = buildGetOrderBookingKey(orgId, page, keyword, perPage);

  return getOrderBookingInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getOrderBooking(orgId, page, keyword, perPage),
    }),
  );
};

export const getOrderPartyAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  partyId?: number | string
): Promise<ApiResponse> => {
  const key = buildGetOrderPartyKey(orgId, page, keyword, partyId);

  return getOrderPartyInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getOrderParty(orgId, page, keyword, partyId),
    }),
  );
};

export const getOrderDesignAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  const key = buildGetOrderDesignKey(orgId, page, keyword);

  return getOrderDesignInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getOrderDesign(orgId, page, keyword),
    }),
  );
};

export const getDesignDetailsAPI = async (
  orgId: string | number,
  designId: string,
  options?: { force?: boolean },
): Promise<ApiResponse> => {
  const key = buildDesignDetailsKey(orgId, designId);

  if (!options?.force) {
    const cached = designDetailsCache.get(key);
    if (cached && Date.now() - cached.ts < DESIGN_DETAILS_CACHE_TTL_MS) {
      return cached.data;
    }
  }

  return getDesignDetailsInFlight.run(key, async () => {
    const res = await doGetApiCall({
      url: endPoints.getDesignDetails(orgId, designId),
    });

    if (res.status === 200) {
      designDetailsCache.set(key, { data: res, ts: Date.now() });
    }

    return res;
  });
};
