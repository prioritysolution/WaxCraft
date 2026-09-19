import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { ItemUnitBody } from "@/types/master/ItemUnitTypes";

const getItemUnitInFlight = createInFlightRequest<ApiResponse>();

const buildGetItemUnitKey = (orgId: string | number) => `${orgId}`;

const invalidateGetItemUnitInFlight = () => {
  getItemUnitInFlight.clear();
};

export const addItemUnitAPI = async (
  bodyData: ItemUnitBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addItemUnit,
    bodyData,
  };

  invalidateGetItemUnitInFlight();

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const updateItemUnitAPI = async (
  bodyData: ItemUnitBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateItemUnit,
    bodyData,
  };

  invalidateGetItemUnitInFlight();

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getItemUnitAPI = async (
  orgId: string | number
): Promise<ApiResponse> => {
  const key = buildGetItemUnitKey(orgId);

  return getItemUnitInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getItemUnit(orgId),
    }),
  );
};

export const deleteItemUnitAPI = async (bodyData: {
  org_id: number;
  unit_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteItemUnit,
    bodyData,
  };

  invalidateGetItemUnitInFlight();

  const res = await doPutApiCall(data);

  return res;
};
