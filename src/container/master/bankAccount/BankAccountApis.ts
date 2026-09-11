import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { BankAccountBody } from "@/types/master/BankAccountTypes";

export const addBankAccountAPI = async (
  bodyData: BankAccountBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addBankAccount,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const updateBankAccountAPI = async (
  bodyData: BankAccountBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateBankAccount,
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getBankAccountAPI = async (
  orgId: string | number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getBankAccount(orgId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getBankLedgerAPI = async (
  orgId: string | number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getBankLedgerList(orgId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const deleteBankAccountAPI = async (bodyData: {
  org_id: number;
  bank_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteBankAccount,
    bodyData,
  };

  const res = await doPutApiCall(data);

  return res;
};
