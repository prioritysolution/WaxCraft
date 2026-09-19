import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

const getBankLedgerInFlight = createInFlightRequest<ApiResponse>();

const buildGetBankLedgerKey = (
  fromDate: string,
  toDate: string,
  bankId: string,
  orgId: string | number,
) => `${fromDate}:${toDate}:${bankId}:${orgId}`;

export const getBankLedgerAPI = async (
  fromDate: string,
  toDate: string,
  bankId: string,
  orgId: string | number
): Promise<ApiResponse> => {
  const key = buildGetBankLedgerKey(fromDate, toDate, bankId, orgId);

  return getBankLedgerInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getBankLedger(fromDate, toDate, bankId, orgId),
    }),
  );
};
