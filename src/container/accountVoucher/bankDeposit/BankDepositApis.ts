import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { BankDepositBody } from "@/types/accountVoucher/BankDepositTypes";

const getBankDepositInFlight = createInFlightRequest<ApiResponse>();

const buildGetBankDepositKey = (
  orgId: string | number,
  page: number,
  perPage?: number,
  fromDate?: string,
  toDate?: string,
) => `${orgId}:${page}:${perPage ?? ""}:${fromDate ?? ""}:${toDate ?? ""}`;

const invalidateBankDepositInFlight = () => {
  getBankDepositInFlight.clear();
};

export const addBankDepositAPI = async (
  bodyData: BankDepositBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addBankDeposit,
    bodyData,
  };

  invalidateBankDepositInFlight();

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const deleteBankDepositAPI = async (bodyData: {
  org_id: number;
  trans_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteBankDeposit,
    bodyData,
  };

  invalidateBankDepositInFlight();

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getBankDepositAPI = async (
  orgId: string | number,
  page: number,
  perPage?: number,
  fromDate?: string,
  toDate?: string
): Promise<ApiResponse> => {
  const key = buildGetBankDepositKey(orgId, page, perPage, fromDate, toDate);

  return getBankDepositInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getBankDeposit(orgId, page, perPage, fromDate, toDate),
    }),
  );
};
