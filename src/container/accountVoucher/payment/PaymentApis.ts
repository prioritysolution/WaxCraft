import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { PaymentBody } from "@/types/accountVoucher/PaymentTypes";

export const addPaymentAPI = async (
  bodyData: PaymentBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addPayment,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const deletePaymentAPI = async (bodyData: {
  org_id: number;
  trans_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deletePayment,
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getPaymentAPI = async (
  orgId: string | number,
  page: number,
  perPage?: number,
  fromDate?: string,
  toDate?: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getPayment(orgId, page, perPage, fromDate, toDate),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getBankBalanceAPI = async (
  orgId: string | number,
  bankId: string,
  date: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getBankBalance(orgId, bankId, date),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
