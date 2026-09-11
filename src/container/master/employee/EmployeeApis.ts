import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { EmployeeBody } from "@/types/master/EmployeeTypes";

export const addEmployeeAPI = async (
  bodyData: EmployeeBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addEmployee,
    bodyData,
  };

  // Call the API
  const res = await doPostApiCall(data);

  return res;
};

export const updateEmployeeAPI = async (
  bodyData: EmployeeBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.updateEmployee,
    bodyData,
  };

  // Call the API
  const res = await doPutApiCall(data);

  return res;
};

export const getEmployeeAPI = async (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.getEmployee(orgId, page, keyword, perPage),
  };

  // Call the API
  const res = await doGetApiCall(data);

  return res;
};

export const deleteEmployeeAPI = async (bodyData: {
  org_id: number;
  emp_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteEmployee,
    bodyData,
  };

  const res = await doPutApiCall(data);

  return res;
};
