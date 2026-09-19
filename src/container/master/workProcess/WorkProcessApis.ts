import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { WorkProcessBody } from "@/types/master/WorkProcessTypes";

const getWorkProcessInFlight = createInFlightRequest<ApiResponse>();

const buildGetWorkProcessKey = (orgId: string | number) => `${orgId}`;

const invalidateGetWorkProcessInFlight = () => {
  getWorkProcessInFlight.clear();
};

export const addWorkProcessAPI = async (
  bodyData: WorkProcessBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addWorkProcess,
    bodyData,
  };

  invalidateGetWorkProcessInFlight();

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const updateWorkProcessAPI = async (
  bodyData: WorkProcessBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateWorkProcess,
    bodyData,
  };

  invalidateGetWorkProcessInFlight();

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getWorkProcessAPI = async (
  orgId: string | number
): Promise<ApiResponse> => {
  const key = buildGetWorkProcessKey(orgId);

  return getWorkProcessInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getWorkProcess(orgId),
    }),
  );
};

export const deleteWorkProcessAPI = async (bodyData: {
  org_id: number;
  work_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteWorkProcess,
    bodyData,
  };

  invalidateGetWorkProcessInFlight();

  const res = await doPutApiCall(data);

  return res;
};
