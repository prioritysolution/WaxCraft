import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { AccountLedgerBody } from "@/types/master/AccountLedgerTypes";

const getAccountLedgerInFlight = createInFlightRequest<ApiResponse>();

const buildGetAccountLedgerKey = (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number,
) => `${orgId}:${page}:${keyword}:${perPage ?? ""}`;

const invalidateGetAccountLedgerInFlight = () => {
  getAccountLedgerInFlight.clear();
};

export const addAccountLedgerAPI = async (
  bodyData: AccountLedgerBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addAccountLedger,
    bodyData,
  };

  invalidateGetAccountLedgerInFlight();

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const updateAccountLedgerAPI = async (
  bodyData: AccountLedgerBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateAccountLedger,
    bodyData,
  };

  invalidateGetAccountLedgerInFlight();

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getAccountLedgerAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number
): Promise<ApiResponse> => {
  const key = buildGetAccountLedgerKey(orgId, page, keyword, perPage);

  return getAccountLedgerInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getAccountLedgerList(orgId, page, keyword, perPage),
    }),
  );
};

export const deleteAccountLedgerAPI = async (bodyData: {
  org_id: number;
  ledger_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteAccountLedger,
    bodyData,
  };

  invalidateGetAccountLedgerInFlight();

  const res = await doPutApiCall(data);

  return res;
};
