import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { AccountLedgerBody } from "@/types/master/AccountLedgerTypes";

export const addAccountLedgerAPI = async (
  bodyData: AccountLedgerBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addAccountLedger,
    bodyData,
  };

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
  let data = {
    url: endPoints.getAccountLedgerList(orgId, page, keyword, perPage),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const deleteAccountLedgerAPI = async (bodyData: {
  org_id: number;
  ledger_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteAccountLedger,
    bodyData,
  };

  const res = await doPutApiCall(data);

  return res;
};
