"use client";

import AccountLedger from "@/components/accountingReport/accountLedger";
import { useAccountLedger } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";

const AccountLedgerContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getAccountLedgerLoading,
    getAccountLedgerListDataApiCall,
    form,
    handleSubmit,
    showPrintDialog,
    setShowPrintDialog,
    fromDate,
    toDate,
    ledgerId,
    currentAccountLedgerPage,
    setCurrentAccountLedgerPage,
    lastAccountLedgerPage,
    accountLedgerInput,
    setAccountLedgerInput,
    getAccountLedgerListLoading,
  } = useAccountLedger();

  const handleSearchAccountLedger = () => {
    setCurrentAccountLedgerPage(1);
    if (orgId) getAccountLedgerListDataApiCall(orgId, 1, accountLedgerInput);
  };

  const handleScrollAccountLedger = () => {
    setCurrentAccountLedgerPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (
      orgId &&
      currentAccountLedgerPage > 1 &&
      currentAccountLedgerPage <= lastAccountLedgerPage
    )
      getAccountLedgerListDataApiCall(
        orgId,
        currentAccountLedgerPage,
        accountLedgerInput
      );
  }, [currentAccountLedgerPage, orgId]);

  return (
    <AccountLedger
      getAccountLedgerLoading={getAccountLedgerLoading}
      form={form}
      handleSubmit={handleSubmit}
      showPrintDialog={showPrintDialog}
      setShowPrintDialog={setShowPrintDialog}
      fromDate={fromDate}
      toDate={toDate}
      ledgerId={ledgerId}
      handleSearchAccountLedger={handleSearchAccountLedger}
      handleScrollAccountLedger={handleScrollAccountLedger}
      accountLedgerInput={accountLedgerInput}
      setAccountLedgerInput={setAccountLedgerInput}
      getAccountLedgerListLoading={getAccountLedgerListLoading}
    />
  );
};
export default AccountLedgerContainer;
