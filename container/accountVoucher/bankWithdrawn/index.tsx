"use client";

import BankWithdrawn from "@/components/accountVoucher/bankWithdrawn";
import { useBankWithdrawn } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useBankAccount } from "@/container/master/bankAccount/Hooks";

const BankWithdrawnContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getBankWithdrawnApiCall,
    addBankWithdrawnLoading,
    deleteBankWithdrawnLoading,
    loading,
    form,
    handleSubmit,
    selected,
    setSelected,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeleteBankWithdrawn,
    currentPage,
    setCurrentPage,
    lastPage,
  } = useBankWithdrawn();

  const { getBankAccountApiCall, loading: getBankAccountLoading } =
    useBankAccount();

  useEffect(() => {
    if (token && orgId) {
      getBankAccountApiCall(orgId);
    }
  }, [token, orgId]);

  useEffect(() => {
    if (token && orgId && selected === "table") {
      getBankWithdrawnApiCall(orgId, currentPage);
    }
  }, [token, orgId, selected, currentPage]);

  return (
    <BankWithdrawn
      addBankWithdrawnLoading={addBankWithdrawnLoading}
      deleteBankWithdrawnLoading={deleteBankWithdrawnLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      selected={selected}
      setSelected={setSelected}
      handleShowDeleteDialog={handleShowDeleteDialog}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleDeleteBankWithdrawn={handleDeleteBankWithdrawn}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      getBankAccountLoading={getBankAccountLoading}
    />
  );
};

export default BankWithdrawnContainer;
