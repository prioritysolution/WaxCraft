import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { LoginBody } from "@/types/auth/LoginTypes";

export const addLoginAPI = async (
  bodyData: LoginBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.login,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};
