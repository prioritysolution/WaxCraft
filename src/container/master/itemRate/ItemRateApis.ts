import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { ItemRateBody } from "@/types/master/ItemRateTypes";

const getItemRateInFlight = createInFlightRequest<ApiResponse>();

const buildGetItemRateKey = (
  orgId: string | number,
  itemId: string,
) => `${orgId}:${itemId}`;

const invalidateGetItemRateInFlight = () => {
  getItemRateInFlight.clear();
};

export const addItemRateAPI = async (
  bodyData: ItemRateBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addItemRate,
    bodyData,
  };

  invalidateGetItemRateInFlight();

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const getItemRateAPI = async (
  orgId: string | number,
  itemId: string
): Promise<ApiResponse> => {
  const key = buildGetItemRateKey(orgId, itemId);

  return getItemRateInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getItemRate(orgId, itemId),
    }),
  );
};
