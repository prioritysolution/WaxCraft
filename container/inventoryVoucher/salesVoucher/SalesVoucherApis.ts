import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { SalesVoucherBody } from "@/types/inventoryVoucher/SalesVoucherTypes";

export const addSalesVoucherAPI = async (
  bodyData: SalesVoucherBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addSalesVoucher,
    bodyData,
  };

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
  let data = {
    url: endPoints.getSalesVoucher(orgId, partyId, page, keyword),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getInvoicePrintDataAPI = async (
  orgId: number | string,
  salesId: number | string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getInvoicePrintData(orgId, salesId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getInvoiceListDataAPI = async (
  orgId: number | string,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getInvoiceListData(orgId, page, keyword),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const deleteInvoiceDataAPI = async (bodyData: {
  org_id: string | number;
  sales_id: string | number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteInvoiceData,
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};
