import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { ReceiptBody } from "@/types/accountVoucher/ReceiptTypes";

export const addReceiptAPI = async (
  bodyData: ReceiptBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addReceipt,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const deleteReceiptAPI = async (bodyData: {
  org_id: number;
  trans_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteReceipt,
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getReceiptAPI = async (
  orgId: string | number,
  page: number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getReceipt(orgId, page),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getReceiptLedgerAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getReceiptLedger(orgId, page, keyword),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getCheckReceiptPartyAPI = async (
  orgId: string | number,
  ledgerId: string | number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getCheckReceiptParty(orgId, ledgerId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
