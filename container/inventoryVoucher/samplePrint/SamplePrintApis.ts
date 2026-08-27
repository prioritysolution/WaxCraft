import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { SamplePrintBody } from "@/types/inventoryVoucher/SamplePrintTypes";

export const addSamplePrintAPI = async (
  bodyData: SamplePrintBody
): Promise<ApiResponse> => {
  const data = {
    url: endPoints.addSamplePrint,
    bodyData,
  };

  const res = await doPostApiCall(data);

  return res;
};

export const getSamplePrintAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  const data = {
    url: endPoints.getSamplePrint(orgId, page, keyword),
  };

  const res = await doGetApiCall(data);

  return res;
};

export const getSamplePrintDetailsAPI = async (
  orgId: string | number,
  printId: string | number
): Promise<ApiResponse> => {
  const data = {
    url: endPoints.getSamplePrintDetails(orgId, printId),
  };

  const res = await doGetApiCall(data);

  return res;
};

export const deleteSamplePrintAPI = async (bodyData: {
  org_id: number;
  sampleprint_id: number;
}): Promise<ApiResponse> => {
  const data = {
    url: endPoints.deleteSamplePrint,
    bodyData,
  };

  const res = await doPutApiCall(data);

  return res;
};
