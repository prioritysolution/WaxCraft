import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

export const addDesignAPI = async (
  bodyData: FormData
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addDesign,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data, "multipart/form-data");

  return res;
};

export const updateDesignAPI = async (
  bodyData: FormData
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateDesign,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data, "multipart/form-data");

  return res;
};

export const getDesignAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage = 50
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getDesign(orgId, page, keyword, perPage),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const deleteDesignAPI = async (bodyData: {
  org_id: number;
  design_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteDesign,
    bodyData,
  };

  const res = await doPutApiCall(data);

  return res;
};
