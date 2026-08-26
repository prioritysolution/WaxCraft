"use client";

import Receipt from "@/components/accountVoucher/receipt";
import { useReceipt } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";
import { useBankAccount } from "@/container/master/bankAccount/Hooks";

const ReceiptContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getReceiptApiCall,
    getReceiptLedgerApiCall,
    getCheckReceiptPartyApiCall,
    addReceiptLoading,
    deleteReceiptLoading,
    loading,
    form,
    handleSubmit,
    selected,
    setSelected,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeleteReceipt,
    ledgerId,
    currentReceiptLedgerPage,
    setCurrentReceiptLedgerPage,
    lastReceiptLedgerPage,
    currentPage,
    setCurrentPage,
    lastPage,
    receiptLedgerInput,
    setReceiptLedgerInput,
    getReceiptLedgerLoading,
    checkReceiptPartyLoading,
  } = useReceipt();

  const { getBankAccountApiCall, loading: getBankAccountLoading } =
    useBankAccount();

  const handleSearchReceiptLedger = () => {
    setCurrentReceiptLedgerPage(1);
    if (orgId) getReceiptLedgerApiCall(orgId, 1, receiptLedgerInput);
  };

  const handleScrollReceiptLedger = () => {
    setCurrentReceiptLedgerPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (
      orgId &&
      currentReceiptLedgerPage > 1 &&
      currentReceiptLedgerPage <= lastReceiptLedgerPage
    )
      getReceiptLedgerApiCall(
        orgId,
        currentReceiptLedgerPage,
        receiptLedgerInput
      );
  }, [currentReceiptLedgerPage, orgId]);

  useEffect(() => {
    if (token && orgId) {
      getBankAccountApiCall(orgId);
    }
  }, [token, orgId]);

  useEffect(() => {
    if (token && orgId && selected === "table") {
      getReceiptApiCall(orgId, currentPage);
    }
  }, [token, orgId, selected, currentPage]);

  useEffect(() => {
    if (token && orgId && !!ledgerId) {
      getCheckReceiptPartyApiCall(orgId, ledgerId);
      form.trigger("partyId");
    }
  }, [token, orgId, ledgerId]);

  return (
    <Receipt
      addReceiptLoading={addReceiptLoading}
      deleteReceiptLoading={deleteReceiptLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      selected={selected}
      setSelected={setSelected}
      handleShowDeleteDialog={handleShowDeleteDialog}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleDeleteReceipt={handleDeleteReceipt}
      handleSearchReceiptLedger={handleSearchReceiptLedger}
      handleScrollReceiptLedger={handleScrollReceiptLedger}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      receiptLedgerInput={receiptLedgerInput}
      setReceiptLedgerInput={setReceiptLedgerInput}
      getReceiptLedgerLoading={getReceiptLedgerLoading}
      checkReceiptPartyLoading={checkReceiptPartyLoading}
      getBankAccountLoading={getBankAccountLoading}
    />
  );
};
export default ReceiptContainer;
