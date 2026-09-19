import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { PaymentBody } from "@/types/accountVoucher/PaymentTypes";

const getPaymentInFlight = createInFlightRequest<ApiResponse>();
const getBankBalanceInFlight = createInFlightRequest<ApiResponse>();

const buildGetPaymentKey = (
  orgId: string | number,
  page: number,
  perPage?: number,
  fromDate?: string,
  toDate?: string,
) => `${orgId}:${page}:${perPage ?? ""}:${fromDate ?? ""}:${toDate ?? ""}`;

const buildGetBankBalanceKey = (
  orgId: string | number,
  bankId: string,
  date: string,
) => `${orgId}:${bankId}:${date}`;

const invalidatePaymentInFlight = () => {
  getPaymentInFlight.clear();
  getBankBalanceInFlight.clear();
};

export const addPaymentAPI = async (
  bodyData: PaymentBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addPayment,
    bodyData,
  };

  invalidatePaymentInFlight();

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

  invalidatePaymentInFlight();

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
  const key = buildGetPaymentKey(orgId, page, perPage, fromDate, toDate);

  return getPaymentInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getPayment(orgId, page, perPage, fromDate, toDate),
    }),
  );
};

export const getBankBalanceAPI = async (
  orgId: string | number,
  bankId: string,
  date: string
): Promise<ApiResponse> => {
  const key = buildGetBankBalanceKey(orgId, bankId, date);

  return getBankBalanceInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getBankBalance(orgId, bankId, date),
    }),
  );
};
