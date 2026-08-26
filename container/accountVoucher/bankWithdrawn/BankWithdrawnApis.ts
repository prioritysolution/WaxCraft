import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { BankWithdrawnBody } from "@/types/accountVoucher/BankWithdrawnTypes";

export const addBankWithdrawnAPI = async (
  bodyData: BankWithdrawnBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addBankWithdrawn,
    bodyData,
  };

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

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getBankWithdrawnAPI = async (
  orgId: string | number,
  page: number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getBankWithdrawn(orgId, page),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
