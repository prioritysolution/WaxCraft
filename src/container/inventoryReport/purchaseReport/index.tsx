"use client";

import PurchaseReport from "@/components/inventoryReport/purchaseReport";
import { usePurchaseReport } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";
import { useOrderBooking } from "@/container/inventoryVoucher/orderBooking/Hooks";

const PurchaseReportContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getPurchaseReportLoading,
    form,
    handleSubmit,
    showPrintDialog,
    setShowPrintDialog,
    fromDate,
    toDate,
    orderPartyInput,
    setOrderPartyInput,
  } = usePurchaseReport();

  const {
    getOrderPartyApiCall,
    currentOrderPartyPage,
    setCurrentOrderPartyPage,
    lastOrderPartyPage,
    getOrderPartyLoading,
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

  return (
    <PurchaseReport
      getPurchaseReportLoading={getPurchaseReportLoading}
      form={form}
      handleSubmit={handleSubmit}
      showPrintDialog={showPrintDialog}
      setShowPrintDialog={setShowPrintDialog}
      fromDate={fromDate}
      toDate={toDate}
      handleSearchOrderParty={handleSearchOrderParty}
      handleScrollOrderParty={handleScrollOrderParty}
      orderPartyInput={orderPartyInput}
      setOrderPartyInput={setOrderPartyInput}
      getOrderPartyLoading={getOrderPartyLoading}
    />
  );
};
export default PurchaseReportContainer;
