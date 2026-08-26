import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { WorkProcessBody } from "@/types/master/WorkProcessTypes";

export const addWorkProcessAPI = async (
  bodyData: WorkProcessBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addWorkProcess,
    bodyData,
  };

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

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getWorkProcessAPI = async (
  orgId: string | number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getWorkProcess(orgId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const deleteWorkProcessAPI = async (bodyData: {
  org_id: number;
  work_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteWorkProcess,
    bodyData,
  };

  const res = await doPutApiCall(data);

  return res;
};
