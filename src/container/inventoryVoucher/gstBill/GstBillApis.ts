import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { GstBillBody } from "@/types/inventoryVoucher/GstBillTypes";

const getGstBillInFlight = createInFlightRequest<ApiResponse>();
const getGstBillPrintInFlight = createInFlightRequest<ApiResponse>();

const buildGetGstBillKey = (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number,
) => `${orgId}:${page}:${keyword}:${perPage ?? ""}`;

const buildGetGstBillPrintKey = (
  orgId: string | number,
  salesId: string | number,
) => `${orgId}:${salesId}`;

const invalidateGstBillInFlight = () => {
  getGstBillInFlight.clear();
  getGstBillPrintInFlight.clear();
};

export const addGstBillAPI = async (
  bodyData: GstBillBody
): Promise<ApiResponse> => {
  const data = {
    url: endPoints.addGstBill,
    bodyData,
  };

  invalidateGstBillInFlight();

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

  invalidateGstBillInFlight();

  const res = await doPutApiCall(data);

  return res;
};

export const getGstBillAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number
): Promise<ApiResponse> => {
  const key = buildGetGstBillKey(orgId, page, keyword, perPage);

  return getGstBillInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getGstBill(orgId, page, keyword, perPage),
    }),
  );
};

export const getGstBillPrintAPI = async (
  orgId: string | number,
  salesId: string | number
): Promise<ApiResponse> => {
  const key = buildGetGstBillPrintKey(orgId, salesId);

  return getGstBillPrintInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getGstBillPrint(orgId, salesId),
    }),
  );
};
