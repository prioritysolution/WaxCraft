import { createInFlightRequest } from "@/lib/apiInFlight";
import { ApiResponse } from "@/types/ApiTypes";
import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

const getSidebarInFlight = createInFlightRequest<ApiResponse>();

const buildGetSidebarKey = (orgId: number | string) => `${orgId}`;

export const getSidebarAPI = async (
  orgId: number | string
): Promise<ApiResponse> => {
  const key = buildGetSidebarKey(orgId);

  return getSidebarInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getSidebar(orgId),
    }),
  );
};
