import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { SamplePrintBody } from "@/types/inventoryVoucher/SamplePrintTypes";

const getSamplePrintInFlight = createInFlightRequest<ApiResponse>();
const getSamplePrintDetailsInFlight = createInFlightRequest<ApiResponse>();

const buildGetSamplePrintKey = (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number,
) => `${orgId}:${page}:${keyword}:${perPage ?? ""}`;

const buildGetSamplePrintDetailsKey = (
  orgId: string | number,
  printId: string | number,
) => `${orgId}:${printId}`;

const invalidateSamplePrintInFlight = () => {
  getSamplePrintInFlight.clear();
  getSamplePrintDetailsInFlight.clear();
};

export const addSamplePrintAPI = async (
  bodyData: SamplePrintBody
): Promise<ApiResponse> => {
  const data = {
    url: endPoints.addSamplePrint,
    bodyData,
  };

  invalidateSamplePrintInFlight();

  const res = await doPostApiCall(data);

  return res;
};

export const getSamplePrintAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number
): Promise<ApiResponse> => {
  const key = buildGetSamplePrintKey(orgId, page, keyword, perPage);

  return getSamplePrintInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getSamplePrint(orgId, page, keyword, perPage),
    }),
  );
};

export const getSamplePrintDetailsAPI = async (
  orgId: string | number,
  printId: string | number
): Promise<ApiResponse> => {
  const key = buildGetSamplePrintDetailsKey(orgId, printId);

  return getSamplePrintDetailsInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getSamplePrintDetails(orgId, printId),
    }),
  );
};

export const deleteSamplePrintAPI = async (bodyData: {
  org_id: number;
  sampleprint_id: number;
}): Promise<ApiResponse> => {
  const data = {
    url: endPoints.deleteSamplePrint,
    bodyData,
  };

  invalidateSamplePrintInFlight();

  const res = await doPutApiCall(data);

  return res;
};
