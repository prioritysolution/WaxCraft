import { createInFlightRequest } from "@/lib/apiInFlight";
import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import { ApiResponse } from "@/types/ApiTypes";
import { EmployeeBody } from "@/types/master/EmployeeTypes";

const getEmployeeInFlight = createInFlightRequest<ApiResponse>();

const buildGetEmployeeKey = (
  orgId: string | number,
  page: number,
  keyword: string,
  perPage?: number,
) => `${orgId}:${page}:${keyword}:${perPage ?? ""}`;

const invalidateGetEmployeeInFlight = () => {
  getEmployeeInFlight.clear();
};

export const addEmployeeAPI = async (
  bodyData: EmployeeBody
): Promise<ApiResponse> => {
  let data = {
    url: endPoints.addEmployee,
    bodyData,
  };

  invalidateGetEmployeeInFlight();

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

  invalidateGetEmployeeInFlight();

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
  const key = buildGetEmployeeKey(orgId, page, keyword, perPage);

  return getEmployeeInFlight.run(key, () =>
    doGetApiCall({
      url: endPoints.getEmployee(orgId, page, keyword, perPage),
    }),
  );
};

export const deleteEmployeeAPI = async (bodyData: {
  org_id: number;
  emp_id: number;
}): Promise<ApiResponse> => {
  let data = {
    url: endPoints.deleteEmployee,
    bodyData,
  };

  invalidateGetEmployeeInFlight();

  const res = await doPutApiCall(data);

  return res;
};
