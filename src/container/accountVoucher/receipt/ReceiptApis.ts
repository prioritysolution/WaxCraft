import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { ReceiptBody } from "@/types/accountVoucher/ReceiptTypes";

const getReceiptInFlight = createInFlightRequest<ApiResponse>();
const getReceiptLedgerInFlight = createInFlightRequest<ApiResponse>();
const getCheckReceiptPartyInFlight = createInFlightRequest<ApiResponse>();

const buildGetReceiptKey = (
  orgId: string | number,
  page: number,
  perPage?: number,
  fromDate?: string,
  toDate?: string,
) => `${orgId}:${page}:${perPage ?? ""}:${fromDate ?? ""}:${toDate ?? ""}`;

const buildGetReceiptLedgerKey = (
  orgId: string | number,
  page: number,
  keyword: string,
) => `${orgId}:${page}:${keyword}`;

const buildGetCheckReceiptPartyKey = (
  orgId: string | number,
  ledgerId: string | number,
) => `${orgId}:${ledgerId}`;

const invalidateReceiptInFlight = () => {
  getReceiptInFlight.clear();
  getReceiptLedgerInFlight.clear();
  getCheckReceiptPartyInFlight.clear();
};

export const addReceiptAPI = async (
  bodyData: ReceiptBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addReceipt,
    bodyData,
  };

  invalidateReceiptInFlight();

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

  invalidateReceiptInFlight();

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getReceiptAPI = async (
  orgId: string | number,
  page: number,
  perPage?: number,
  fromDate?: string,
  toDate?: string
): Promise<ApiResponse> => {
  const key = buildGetReceiptKey(orgId, page, perPage, fromDate, toDate);

  return getReceiptInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getReceipt(orgId, page, perPage, fromDate, toDate),
    }),
  );
};

export const getReceiptLedgerAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  const key = buildGetReceiptLedgerKey(orgId, page, keyword);

  return getReceiptLedgerInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getReceiptLedger(orgId, page, keyword),
    }),
  );
};

export const getCheckReceiptPartyAPI = async (
  orgId: string | number,
  ledgerId: string | number
): Promise<ApiResponse> => {
  const key = buildGetCheckReceiptPartyKey(orgId, ledgerId);

  return getCheckReceiptPartyInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getCheckReceiptParty(orgId, ledgerId),
    }),
  );
};
