"use client";

import BankAccount from "@/components/master/bankAccount";
import { useBankAccount } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useItemCategory } from "../itemCategory/Hooks";

const BankAccountContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getBankAccountApiCall,
    getBankLedgerApiCall,
    addBankAccountLoading,
    updateBankAccountLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    getBankLedgerLoading,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteBankAccount,
    deleteBankAccountLoading,
    deleteWarning,
    totalCount,
  } = useBankAccount();

  useEffect(() => {
    if (token && orgId) {
      getBankAccountApiCall(orgId);
      getBankLedgerApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <BankAccount
      addBankAccountLoading={addBankAccountLoading}
      updateBankAccountLoading={updateBankAccountLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      editData={editData}
      handleEditData={handleEditData}
      getBankLedgerLoading={getBankLedgerLoading}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleShowDeleteDialog={handleShowDeleteDialog}
      handleDeleteBankAccount={handleDeleteBankAccount}
      deleteBankAccountLoading={deleteBankAccountLoading}
      deleteWarning={deleteWarning}
      totalCount={totalCount}
    />
  );
};
export default BankAccountContainer;
