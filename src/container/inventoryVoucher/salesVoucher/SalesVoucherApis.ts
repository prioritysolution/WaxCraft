import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { SalesVoucherBody } from "@/types/inventoryVoucher/SalesVoucherTypes";

const getSalesVoucherInFlight = createInFlightRequest<ApiResponse>();
const getInvoicePrintDataInFlight = createInFlightRequest<ApiResponse>();
const getInvoiceListDataInFlight = createInFlightRequest<ApiResponse>();

const buildGetSalesVoucherKey = (
  orgId: number | string,
  partyId: string,
  page: number,
  keyword: string,
) => `${orgId}:${partyId}:${page}:${keyword}`;

const buildGetInvoicePrintDataKey = (
  orgId: number | string,
  salesId: number | string,
) => `${orgId}:${salesId}`;

const buildGetInvoiceListDataKey = (
  orgId: number | string,
  page: number,
  keyword: string,
  perPage?: number,
) => `${orgId}:${page}:${keyword}:${perPage ?? ""}`;

const invalidateSalesVoucherInFlight = () => {
  getSalesVoucherInFlight.clear();
  getInvoicePrintDataInFlight.clear();
  getInvoiceListDataInFlight.clear();
};

export const addSalesVoucherAPI = async (
  bodyData: SalesVoucherBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addSalesVoucher,
    bodyData,
  };

  invalidateSalesVoucherInFlight();

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const getSalesVoucherAPI = async (
  orgId: number | string,
  partyId: string,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  const key = buildGetSalesVoucherKey(orgId, partyId, page, keyword);

  return getSalesVoucherInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getSalesVoucher(orgId, partyId, page, keyword),
    }),
  );
};

export const getInvoicePrintDataAPI = async (
  orgId: number | string,
  salesId: number | string
): Promise<ApiResponse> => {
  const key = buildGetInvoicePrintDataKey(orgId, salesId);

  return getInvoicePrintDataInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getInvoicePrintData(orgId, salesId),
    }),
  );
};

export const getInvoiceListDataAPI = async (
  orgId: number | string,
  page: number,
  keyword: string,
  perPage?: number
): Promise<ApiResponse> => {
  const key = buildGetInvoiceListDataKey(orgId, page, keyword, perPage);

  return getInvoiceListDataInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getInvoiceListData(orgId, page, keyword, perPage),
    }),
  );
};

export const deleteInvoiceDataAPI = async (bodyData: {
  org_id: string | number;
  sales_id: string | number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteInvoiceData,
    bodyData,
  };

  invalidateSalesVoucherInFlight();

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};
