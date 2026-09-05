"use client";

import AccountLedger from "@/components/master/accountLedger";
import { useAccountLedger } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";
import { useAccountGroup } from "../accountGroup/Hooks";

const AccountLedgerContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getAccountLedgerApiCall,
    addAccountLedgerLoading,
    updateAccountLedgerLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    ledgerTableInput,
    handleFilterTableData,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteAccountLedger,
    deleteAccountLedgerLoading,
    deleteWarning,
    totalCount,
  } = useAccountLedger();

  const {
    getAccountGroupApiCall,
    getAccountMainHeadApiCall,
    currentMainHeadPage,
    setCurrentMainHeadPage,
    lastMainHeadPage,
    currentGroupPage,
    setCurrentGroupPage,
    lastGroupPage,
    mainHeadInput,
    setMainHeadInput,
    headInput,
    setHeadInput,
    getMainHeadLoading,
    loading: getHeadLoading,
  } = useAccountGroup();

  const handleSearchMainHead = () => {
    setCurrentMainHeadPage(1);
    if (orgId) getAccountMainHeadApiCall(orgId, 1, mainHeadInput);
  };

  const handleScrollMainHead = () => {
    setCurrentMainHeadPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (
      orgId &&
      currentMainHeadPage > 1 &&
      currentMainHeadPage <= lastMainHeadPage
    )
      getAccountMainHeadApiCall(orgId, currentMainHeadPage, mainHeadInput);
  }, [currentMainHeadPage, orgId]);

  const handleSearchHead = () => {
    setCurrentGroupPage(1);
    if (orgId) getAccountGroupApiCall(orgId, 1, headInput, "DROPDOWN");
  };

  const handleScrollHead = () => {
    setCurrentGroupPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (orgId && currentGroupPage > 1 && currentGroupPage <= lastGroupPage)
      getAccountGroupApiCall(orgId, currentGroupPage, headInput, "DROPDOWN");
  }, [currentGroupPage, orgId]);

  useEffect(() => {
    if (token && orgId) {
      getAccountLedgerApiCall(orgId, currentPage, ledgerTableInput, "TABLE");
    }
  }, [token, orgId, currentPage, perPage]);

  return (
    <AccountLedger
      addAccountLedgerLoading={addAccountLedgerLoading}
      updateAccountLedgerLoading={updateAccountLedgerLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      editData={editData}
      handleEditData={handleEditData}
      handleSearchMainHead={handleSearchMainHead}
      handleScrollMainHead={handleScrollMainHead}
      handleSearchHead={handleSearchHead}
      handleScrollHead={handleScrollHead}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      perPage={perPage}
      onPerPageChange={handlePerPageChange}
      ledgerTableInput={ledgerTableInput}
      handleFilterTableData={handleFilterTableData}
      mainHeadInput={mainHeadInput}
      setMainHeadInput={setMainHeadInput}
      headInput={headInput}
      setHeadInput={setHeadInput}
      getMainHeadLoading={getMainHeadLoading}
      getHeadLoading={getHeadLoading}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleShowDeleteDialog={handleShowDeleteDialog}
      handleDeleteAccountLedger={handleDeleteAccountLedger}
      deleteAccountLedgerLoading={deleteAccountLedgerLoading}
      deleteWarning={deleteWarning}
      totalCount={totalCount}
    />
  );
};
export default AccountLedgerContainer;
