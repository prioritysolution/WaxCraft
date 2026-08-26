"use client";

import BankDeposit from "@/components/accountVoucher/bankDeposit";
import { useBankDeposit } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useBankAccount } from "@/container/master/bankAccount/Hooks";

const BankDepositContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getBankDepositApiCall,
    addBankDepositLoading,
    deleteBankDepositLoading,
    loading,
    form,
    handleSubmit,
    selected,
    setSelected,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeleteBankDeposit,
    currentPage,
    setCurrentPage,
    lastPage,
  } = useBankDeposit();

  const { getBankAccountApiCall, loading: getBankAccountLoading } =
    useBankAccount();

  useEffect(() => {
    if (token && orgId) {
      getBankAccountApiCall(orgId);
    }
  }, [token, orgId]);

  useEffect(() => {
    if (token && orgId && selected === "table") {
      getBankDepositApiCall(orgId, currentPage);
    }
  }, [token, orgId, selected, currentPage]);

  return (
    <BankDeposit
      addBankDepositLoading={addBankDepositLoading}
      deleteBankDepositLoading={deleteBankDepositLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      selected={selected}
      setSelected={setSelected}
      handleShowDeleteDialog={handleShowDeleteDialog}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleDeleteBankDeposit={handleDeleteBankDeposit}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      getBankAccountLoading={getBankAccountLoading}
    />
  );
};
export default BankDepositContainer;
