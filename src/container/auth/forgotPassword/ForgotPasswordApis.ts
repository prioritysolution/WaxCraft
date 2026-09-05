import { doGetApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { ForgotPasswordBody } from "@/types/auth/ForgotPasswordTypes";

export const updateForgotPasswordAPI = async (
  bodyData: ForgotPasswordBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateForgotPassword,
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getForgotPasswordOtpAPI = async (
  email: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getForgotPasswordOtp(email),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const getForgotPasswordVerifyOtpAPI = async (
  email: string,
  otp: string
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getForgotPasswordVerifyOtp(email, otp),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
