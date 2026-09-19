import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { TrailorTransactionBody } from "@/types/accountVoucher/TrailorTransactionTypes";

const getTrailorUserInFlight = createInFlightRequest<ApiResponse>();
const getTrailorBalanceInFlight = createInFlightRequest<ApiResponse>();

const buildGetTrailorUserKey = (orgId: string | number) => `${orgId}`;

const buildGetTrailorBalanceKey = (
  orgId: string | number,
  userId: string,
  date: string,
) => `${orgId}:${userId}:${date}`;

const invalidateTrailorTransactionInFlight = () => {
  getTrailorUserInFlight.clear();
  getTrailorBalanceInFlight.clear();
};

export const addTrailorTransactionAPI = async (
  bodyData: TrailorTransactionBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addTrailorTransaction,
    bodyData,
  };

  invalidateTrailorTransactionInFlight();

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const getTrailorUserAPI = async (
  orgId: string | number
): Promise<ApiResponse> => {
  const key = buildGetTrailorUserKey(orgId);

  return getTrailorUserInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getTrailorUser(orgId),
    }),
  );
};

export const getTrailorBalanceAPI = async (
  orgId: string | number,
  userId: string,
  date: string
): Promise<ApiResponse> => {
  const key = buildGetTrailorBalanceKey(orgId, userId, date);

  return getTrailorBalanceInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getTrailorBalance(orgId, userId, date),
    }),
  );
};
