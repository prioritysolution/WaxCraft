import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { BankTransferBody } from "@/types/accountVoucher/BankTransferTypes";

export const addBankTransferAPI = async (
  bodyData: BankTransferBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addBankTransfer,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const deleteBankTransferAPI = async (bodyData: {
  org_id: number;
  trans_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteBankTransfer,
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getBankTransferAPI = async (
  orgId: string | number,
  page: number,
  perPage?: number,
  fromDate?: string,
  toDate?: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getBankTransfer(orgId, page, perPage, fromDate, toDate),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
