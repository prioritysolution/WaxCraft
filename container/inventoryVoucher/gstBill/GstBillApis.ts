import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { GstBillBody } from "@/types/inventoryVoucher/GstBillTypes";

export const addGstBillAPI = async (
  bodyData: GstBillBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addGstBill,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const deleteGstBillAPI = async (bodyData: {
  org_id: number;
  gst_id: number;
}): Promise<ApiResponse> => {
  let data = {
    // url: endPoints.deleteGstBill,
    url: "",
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getGstBillAPI = async (
  orgId: string | number,
  page: number,
  keyword: string
): Promise<ApiResponse> => {
  let data = {
    // url: endPoints.getGstBill(orgId, page, keyword),
    url: "",
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};
