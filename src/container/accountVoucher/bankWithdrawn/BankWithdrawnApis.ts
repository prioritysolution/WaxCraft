import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { BankWithdrawnBody } from "@/types/accountVoucher/BankWithdrawnTypes";

const getBankWithdrawnInFlight = createInFlightRequest<ApiResponse>();

const buildGetBankWithdrawnKey = (
  orgId: string | number,
  page: number,
  perPage?: number,
  fromDate?: string,
  toDate?: string,
) => `${orgId}:${page}:${perPage ?? ""}:${fromDate ?? ""}:${toDate ?? ""}`;

const invalidateBankWithdrawnInFlight = () => {
  getBankWithdrawnInFlight.clear();
};

export const addBankWithdrawnAPI = async (
  bodyData: BankWithdrawnBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addBankWithdrawn,
    bodyData,
  };

  invalidateBankWithdrawnInFlight();

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const deleteBankWithdrawnAPI = async (bodyData: {
  org_id: number;
  trans_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteBankWithdrawn,
    bodyData,
  };

  invalidateBankWithdrawnInFlight();

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getBankWithdrawnAPI = async (
  orgId: string | number,
  page: number,
  perPage?: number,
  fromDate?: string,
  toDate?: string
): Promise<ApiResponse> => {
  const key = buildGetBankWithdrawnKey(orgId, page, perPage, fromDate, toDate);

  return getBankWithdrawnInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getBankWithdrawn(orgId, page, perPage, fromDate, toDate),
    }),
  );
};
