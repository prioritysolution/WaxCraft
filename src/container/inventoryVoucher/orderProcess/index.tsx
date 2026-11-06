"use client";

import OrderProcess from "@/components/inventoryVoucher/orderProcess";
import { useOrderProcess } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";
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
    getOrderPartyApiCall,
    getEmployeeListForOrderProcessApiCall,
    getEmployeeLoading,
    orderProcessEmployeeData,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    orderTableInput,
    handleFilterOrderTable,
    orderFromDate,
    orderToDate,
    orderFromDateApi,
    orderToDateApi,
    handleOrderFromDateChange,
    handleOrderToDateChange,
    orderPartyFilter,
    handleOrderPartyFilterChange,
    orderItemTypeFilter,
    handleOrderItemTypeFilterChange,
    orderStatusFilter,
    handleOrderStatusFilterChange,
    handleResetOrderFilters,
  } = useOrderProcess();

  const { getWorkProcessApiCall, loading: getWorkProcessLoading } =
    useWorkProcess();

  useEffect(() => {
    setToken(getCookieData<string | null>("waxCraftClientToken"));
    setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
  }, []);

  useEffect(() => {
    if (token && orgId) {
      getOrderBookingApiCall(orgId, currentPage, orderTableInput.trim(), perPage);
    }
  }, [
    token,
    orgId,
    currentPage,
    perPage,
    orderFromDateApi,
    orderToDateApi,
    orderPartyFilter,
    orderItemTypeFilter,
    orderStatusFilter,
  ]);

  useEffect(() => {
    if (token && orgId) {
      getOrderPartyApiCall(orgId);
      getWorkProcessApiCall(orgId);
      getEmployeeListForOrderProcessApiCall(orgId);
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
      orderTableInput={orderTableInput}
      handleFilterOrderTable={handleFilterOrderTable}
      orderFromDate={orderFromDate}
      orderToDate={orderToDate}
      onOrderFromDateChange={handleOrderFromDateChange}
      onOrderToDateChange={handleOrderToDateChange}
      orderPartyFilter={orderPartyFilter}
      onOrderPartyFilterChange={handleOrderPartyFilterChange}
      orderItemTypeFilter={orderItemTypeFilter}
      onOrderItemTypeFilterChange={handleOrderItemTypeFilterChange}
      orderStatusFilter={orderStatusFilter}
      onOrderStatusFilterChange={handleOrderStatusFilterChange}
      onResetOrderFilters={handleResetOrderFilters}
      getWorkProcessLoading={getWorkProcessLoading}
      getEmployeeLoading={getEmployeeLoading}
      orderProcessEmployeeData={orderProcessEmployeeData}
    />
  );
};
export default OrderProcessContainer;
