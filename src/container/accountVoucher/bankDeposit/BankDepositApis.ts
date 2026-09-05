import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { BankDepositBody } from "@/types/accountVoucher/BankDepositTypes";

export const addBankDepositAPI = async (
  bodyData: BankDepositBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addBankDeposit,
    bodyData,
  };

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
  let data = {
    url: endPoints.getBankDeposit(orgId, page, perPage, fromDate, toDate),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
