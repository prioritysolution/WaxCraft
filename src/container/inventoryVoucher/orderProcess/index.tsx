"use client";

import OrderProcess from "@/components/inventoryVoucher/orderProcess";
import { useOrderProcess } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";
import { useEmployee } from "@/container/master/employee/Hooks";
import { useWorkProcess } from "@/container/master/workProcess/Hooks";

const OrderProcessContainer = () => {
  const [token, setToken] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<number | null>(null);

  const {
    addOrderProcessLoading,
    loading,
    form,
    handleSubmit,
    isOpenProcess,
    setIsOpenProcess,
    handleOpenProcessDialog,
    dialogType,
    handleFurtherProcess,
    showFormFields,
    processTableData,
    processDesignRows,
    selectedProcessOrder,
    handleFinalClose,
    processPostType,
    getOrderBookingApiCall,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    employeeInput,
    setEmployeeInput,
  } = useOrderProcess();

  const {
    getEmployeeApiCall,
    currentPage: currentEmployeePage,
    setCurrentPage: setCurrentEmployeePage,
    lastPage: lastEmployeePage,
    loading: getEmployeeLoading,
  } = useEmployee();

  const { getWorkProcessApiCall, loading: getWorkProcessLoading } =
    useWorkProcess();

  useEffect(() => {
    setToken(getCookieData<string | null>("waxCraftClientToken"));
    setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
  }, []);

  useEffect(() => {
    if (token && orgId) {
      getOrderBookingApiCall(orgId, currentPage, "", perPage);
    }
  }, [token, orgId, currentPage, perPage]);

  const handleSearchEmployee = () => {
    setCurrentEmployeePage(1);
    if (orgId) getEmployeeApiCall(orgId, 1, employeeInput, "DROPDOWN");
  };

  const handleScrollEmployee = () => {
    setCurrentEmployeePage((prev) => prev + 1);
  };

  useEffect(() => {
    if (
      orgId &&
      currentEmployeePage > 1 &&
      currentEmployeePage <= lastEmployeePage
    )
      getEmployeeApiCall(orgId, currentEmployeePage, employeeInput, "DROPDOWN");
  }, [currentEmployeePage, orgId]);

  useEffect(() => {
    if (token && orgId) {
      getWorkProcessApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <OrderProcess
      addOrderProcessLoading={addOrderProcessLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      isOpenProcess={isOpenProcess}
      setIsOpenProcess={setIsOpenProcess}
      handleOpenProcessDialog={handleOpenProcessDialog}
      dialogType={dialogType}
      handleFurtherProcess={handleFurtherProcess}
      showFormFields={showFormFields}
      processTableData={processTableData}
      processDesignRows={processDesignRows}
      selectedProcessOrder={selectedProcessOrder}
      handleFinalClose={handleFinalClose}
      processPostType={processPostType}
      handleSearchEmployee={handleSearchEmployee}
      handleScrollEmployee={handleScrollEmployee}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      perPage={perPage}
      onPerPageChange={handlePerPageChange}
      employeeInput={employeeInput}
      setEmployeeInput={setEmployeeInput}
      getEmployeeLoading={getEmployeeLoading}
      getWorkProcessLoading={getWorkProcessLoading}
    />
  );
};
export default OrderProcessContainer;
