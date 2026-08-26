import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { SizeColourBody } from "@/types/master/SizeColourTypes";

export const addSizeColourAPI = async (
  bodyData: SizeColourBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addSizeColour,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const updateSizeColourAPI = async (
  bodyData: SizeColourBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateSizeColour,
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getSizeColourAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getSizeColour(orgId, page, keyword),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getColourUnderSizeAPI = async (
  orgId: string | number,
  sizeId: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getColourUnderSize(orgId, sizeId),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const deleteSizeColourAPI = async (bodyData: {
  org_id: number;
  col_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteSizeColour,
    bodyData,
  };

  const res = await doPutApiCall(data);

  return res;
};
