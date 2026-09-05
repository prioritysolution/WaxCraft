"use client";

import BankTransfer from "@/components/accountVoucher/bankTransfer";
import { useBankTransfer } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useBankAccount } from "@/container/master/bankAccount/Hooks";

const BankTransferContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getBankTransferApiCall,
    addBankTransferLoading,
    deleteBankTransferLoading,
    loading,
    form,
    handleSubmit,
    selected,
    setSelected,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeleteBankTransfer,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
  } = useBankTransfer();

  const { getBankAccountApiCall, loading: getBankAccountLoading } =
    useBankAccount();

  useEffect(() => {
    if (token && orgId) {
      getBankAccountApiCall(orgId);
    }
  }, [token, orgId]);

  useEffect(() => {
    if (token && orgId && selected === "table") {
      getBankTransferApiCall(orgId, currentPage);
    }
  }, [token, orgId, selected, currentPage, perPage, fromDate, toDate]);

  return (
    <BankTransfer
      addBankTransferLoading={addBankTransferLoading}
      deleteBankTransferLoading={deleteBankTransferLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      selected={selected}
      setSelected={setSelected}
      handleShowDeleteDialog={handleShowDeleteDialog}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleDeleteBankTransfer={handleDeleteBankTransfer}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      perPage={perPage}
      onPerPageChange={handlePerPageChange}
      getBankAccountLoading={getBankAccountLoading}
      fromDate={fromDate}
      toDate={toDate}
      setFromDate={setFromDate}
      setToDate={setToDate}
    />
  );
};

export default BankTransferContainer;
