import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

const getAccountLedgerInFlight = createInFlightRequest<ApiResponse>();
const getReportLedgerListDataInFlight = createInFlightRequest<ApiResponse>();

const buildGetAccountLedgerKey = (
  fromDate: string,
  toDate: string,
  ledgerId: string,
  orgId: string | number,
) => `${fromDate}:${toDate}:${ledgerId}:${orgId}`;

const buildGetReportLedgerListDataKey = (
  orgId: string | number,
  page: number,
  keyword: string,
) => `${orgId}:${page}:${keyword}`;

export const getAccountLedgerAPI = async (
  fromDate: string,
  toDate: string,
  ledgerId: string,
  orgId: string | number
): Promise<ApiResponse> => {
  const key = buildGetAccountLedgerKey(fromDate, toDate, ledgerId, orgId);

  return getAccountLedgerInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getAccountLedger(fromDate, toDate, ledgerId, orgId),
    }),
  );
};

export const getReportLedgerListDataAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  const key = buildGetReportLedgerListDataKey(orgId, page, keyword);

  return getReportLedgerListDataInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getReportLedgerList(orgId, page, keyword),
    }),
  );
};
