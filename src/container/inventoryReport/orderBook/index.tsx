"use client";

import OrderBook from "@/components/inventoryReport/orderBook";
import { useOrderBook } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";
import { useOrderBooking } from "@/container/inventoryVoucher/orderBooking/Hooks";

const OrderBookContainer = () => {
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getOrderBookLoading,
    form,
    handleSubmit,
    showPrintDialog,
    setShowPrintDialog,
    fromDate,
    toDate,
    orderPartyInput,
    setOrderPartyInput,
  } = useOrderBook();

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
    <OrderBook
      getOrderBookLoading={getOrderBookLoading}
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
export default OrderBookContainer;
