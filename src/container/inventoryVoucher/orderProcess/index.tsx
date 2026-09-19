"use client";

import OrderProcess from "@/components/inventoryVoucher/orderProcess";
import { useOrderProcess } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";
import { useWorkProcess } from "@/container/master/workProcess/Hooks";
import { useEmployee } from "@/container/master/employee/Hooks";

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
  } = useOrderProcess();

  const { getWorkProcessApiCall, loading: getWorkProcessLoading } =
    useWorkProcess();
  const { getEmployeeApiCall, loading: getEmployeeLoading } = useEmployee();

  useEffect(() => {
    setToken(getCookieData<string | null>("waxCraftClientToken"));
    setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
  }, []);

  useEffect(() => {
    if (token && orgId) {
      getOrderBookingApiCall(orgId, currentPage, "", perPage);
    }
  }, [token, orgId, currentPage, perPage]);

  useEffect(() => {
    if (token && orgId) {
      getWorkProcessApiCall(orgId);
      getEmployeeApiCall(orgId, 1, "", "DROPDOWN");
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
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      perPage={perPage}
      onPerPageChange={handlePerPageChange}
      getWorkProcessLoading={getWorkProcessLoading}
      getEmployeeLoading={getEmployeeLoading}
    />
  );
};
export default OrderProcessContainer;
