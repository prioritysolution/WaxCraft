import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { BankAccountBody } from "@/types/master/BankAccountTypes";

const getBankAccountInFlight = createInFlightRequest<ApiResponse>();
const getBankLedgerInFlight = createInFlightRequest<ApiResponse>();

const buildGetBankAccountKey = (orgId: string | number) => `${orgId}`;

const buildGetBankLedgerKey = (orgId: string | number) => `${orgId}`;

const invalidateGetBankAccountInFlight = () => {
  getBankAccountInFlight.clear();
  getBankLedgerInFlight.clear();
};

export const addBankAccountAPI = async (
  bodyData: BankAccountBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addBankAccount,
    bodyData,
  };

  invalidateGetBankAccountInFlight();

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

  invalidateGetBankAccountInFlight();

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getBankAccountAPI = async (
  orgId: string | number
): Promise<ApiResponse> => {
  const key = buildGetBankAccountKey(orgId);

  return getBankAccountInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getBankAccount(orgId),
    }),
  );
};

export const getBankLedgerAPI = async (
  orgId: string | number
): Promise<ApiResponse> => {
  const key = buildGetBankLedgerKey(orgId);

  return getBankLedgerInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getBankLedgerList(orgId),
    }),
  );
};

export const deleteBankAccountAPI = async (bodyData: {
  org_id: number;
  bank_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteBankAccount,
    bodyData,
  };

  invalidateGetBankAccountInFlight();

  const res = await doPutApiCall(data);

  return res;
};
