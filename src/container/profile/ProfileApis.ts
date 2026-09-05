import { ApiResponse } from "@/types/ApiTypes";
import { ProfileBody } from "@/types/ProfileTypes";
import { doGetApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

let inFlightGetUserProfile: Promise<ApiResponse> | null = null;

export const getUserProfileAPI = async (
  options?: { force?: boolean },
): Promise<ApiResponse> => {
  if (!options?.force && inFlightGetUserProfile) {
    return inFlightGetUserProfile;
  }

  const request = doGetApiCall({
    url: endPoints.getUserProfile,
  }).finally(() => {
    const clear = () => {
      if (inFlightGetUserProfile === request) {
        inFlightGetUserProfile = null;
      }
    };

    if (typeof window === "undefined") {
      clear();
      return;
    }

    window.setTimeout(clear, 300);
  });

  inFlightGetUserProfile = request;
  return request;
};

export const updateProfileAPI = async (
  bodyData: ProfileBody,
): Promise<ApiResponse> => {
  const data = {
    url: endPoints.updateUserProfile,
    bodyData,
  };

  inFlightGetUserProfile = null;
  return doPutApiCall(data);
};
