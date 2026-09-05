"use client";

import PartyLedger from "@/components/inventoryReport/partyLedger";
import { usePartyLedger } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";
import { useOrderBooking } from "@/container/inventoryVoucher/orderBooking/Hooks";

const PartyLedgerContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getPartyLedgerLoading,
    form,
    handleSubmit,
    showPrintDialog,
    setShowPrintDialog,
    fromDate,
    toDate,
    orderPartyInput,
    setOrderPartyInput,
  } = usePartyLedger();

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
    <PartyLedger
      getPartyLedgerLoading={getPartyLedgerLoading}
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
export default PartyLedgerContainer;
