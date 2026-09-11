import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { TrailorTransactionBody } from "@/types/accountVoucher/TrailorTransactionTypes";

export const addTrailorTransactionAPI = async (
  bodyData: TrailorTransactionBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addTrailorTransaction,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const getTrailorUserAPI = async (
  orgId: string | number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getTrailorUser(orgId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getTrailorBalanceAPI = async (
  orgId: string | number,
  userId: string,
  date: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getTrailorBalance(orgId, userId, date),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
