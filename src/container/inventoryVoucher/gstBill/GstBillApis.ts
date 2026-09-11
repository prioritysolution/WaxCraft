import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { GstBillBody } from "@/types/inventoryVoucher/GstBillTypes";

export const addGstBillAPI = async (
  bodyData: GstBillBody
): Promise<ApiResponse> => {
  const data = {
    url: endPoints.addGstBill,
    bodyData,
  };

  const res = await doPostApiCall(data);

  return res;
};

export const deleteGstBillAPI = async (bodyData: {
  org_id: number;
  sales_id: number;
}): Promise<ApiResponse> => {
  const data = {
    url: endPoints.deleteGstBill,
    bodyData,
  };

  const res = await doPutApiCall(data);

  return res;
};

export const getGstBillAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number
): Promise<ApiResponse> => {
  const data = {
    url: endPoints.getGstBill(orgId, page, keyword, perPage),
  };

  const res = await doGetApiCall(data);

  return res;
};

export const getGstBillPrintAPI = async (
  orgId: string | number,
  salesId: string | number
): Promise<ApiResponse> => {
  const data = {
    url: endPoints.getGstBillPrint(orgId, salesId),
  };

  const res = await doGetApiCall(data);

  return res;
};
