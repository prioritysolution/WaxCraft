"use client";

import SalesVoucher from "@/components/inventoryVoucher/salesVoucher";
import { useSalesVoucher } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";
import { useOrderBooking } from "../orderBooking/Hooks";

const SalesVoucherContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getSalesVoucherApiCall,
    getInvoiceListApiCall,
    deleteInvoiceLoading,
    loading,
    form,
    handleSalesVoucherProcess,
    partyId,
    parentSelected,
    setParentSelected,
    selected,
    handleIsSelected,
    tabSelected,
    setTabSelected,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeleteInvoiceData,
    showInvoiceDialog,
    setShowInvoiceDialog,
    handleShowInvoiceDialog,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    orderPartyInput,
    setOrderPartyInput,
  } = useSalesVoucher();

  const {
    getOrderPartyApiCall,
    currentOrderPartyPage,
    setCurrentOrderPartyPage,
    lastOrderPartyPage,
  } = useOrderBooking();

  const handleSearchOrderParty = () => {
    setCurrentOrderPartyPage(1);
    if (orgId) getOrderPartyApiCall(orgId, 1, orderPartyInput, "");
  };

  const handleScrollOrderParty = () => {
    setCurrentOrderPartyPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (
      orgId &&
      currentOrderPartyPage > 1 &&
      currentOrderPartyPage <= lastOrderPartyPage
    )
      getOrderPartyApiCall(orgId, currentOrderPartyPage, orderPartyInput, "");
  }, [currentOrderPartyPage, orgId]);

  useEffect(() => {
    if (token && orgId && partyId) {
      getSalesVoucherApiCall(orgId, partyId, 1, "");
    }
  }, [token, orgId, partyId]);

  useEffect(() => {
    if (token && orgId && tabSelected === "table") {
      getInvoiceListApiCall(orgId, currentPage, "");
    }
  }, [token, orgId, tabSelected, currentPage, perPage]);

  return (
    <SalesVoucher
      loading={loading}
      deleteInvoiceLoading={deleteInvoiceLoading}
      form={form}
      handleSalesVoucherProcess={handleSalesVoucherProcess}
      parentSelected={parentSelected}
      setParentSelected={setParentSelected}
      selected={selected}
      handleIsSelected={handleIsSelected}
      partyId={partyId}
      tabSelected={tabSelected}
      setTabSelected={setTabSelected}
      handleShowDeleteDialog={handleShowDeleteDialog}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleDeleteInvoiceData={handleDeleteInvoiceData}
      showInvoiceDialog={showInvoiceDialog}
      setShowInvoiceDialog={setShowInvoiceDialog}
      handleShowInvoiceDialog={handleShowInvoiceDialog}
      handleSearchOrderParty={handleSearchOrderParty}
      handleScrollOrderParty={handleScrollOrderParty}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      perPage={perPage}
      onPerPageChange={handlePerPageChange}
      orderPartyInput={orderPartyInput}
      setOrderPartyInput={setOrderPartyInput}
    />
  );
};
export default SalesVoucherContainer;
