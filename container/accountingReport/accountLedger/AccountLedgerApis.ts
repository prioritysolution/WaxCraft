import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

export const getAccountLedgerAPI = async (
  fromDate: string,
  toDate: string,
  ledgerId: string,
  orgId: string | number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getAccountLedger(fromDate, toDate, ledgerId, orgId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getReportLedgerListDataAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getReportLedgerList(orgId, page, keyword),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
