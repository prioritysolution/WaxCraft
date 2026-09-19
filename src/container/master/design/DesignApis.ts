import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";

const getDesignInFlight = createInFlightRequest<ApiResponse>();

const buildGetDesignKey = (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage: number,
) => `${orgId}:${page}:${keyword}:${perPage}`;

const invalidateGetDesignInFlight = () => {
  getDesignInFlight.clear();
};

export const addDesignAPI = async (
  bodyData: FormData
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addDesign,
    bodyData,
  };

  invalidateGetDesignInFlight();

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

  invalidateGetDesignInFlight();

  const res = await doPostApiCall(data, "multipart/form-data");

  return res;
};

export const getDesignAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage = 50,
  options?: { force?: boolean },
): Promise<ApiResponse> => {
  const key = buildGetDesignKey(orgId, page, keyword, perPage);

  if (options?.force) {
    getDesignInFlight.clear();
  }

  return getDesignInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getDesign(orgId, page, keyword, perPage),
    }),
  );
};

export const deleteDesignAPI = async (bodyData: {
  org_id: number;
  design_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteDesign,
    bodyData,
  };

  invalidateGetDesignInFlight();

  const res = await doPutApiCall(data);

  return res;
};
