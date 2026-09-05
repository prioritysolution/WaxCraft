"use client";

import AccountGroup from "@/components/master/accountGroup";
import { useAccountGroup } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";

const AccountGroupContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getAccountGroupApiCall,
    getAccountMainHeadApiCall,
    addAccountGroupLoading,
    updateAccountGroupLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    currentMainHeadPage,
    setCurrentMainHeadPage,
    lastMainHeadPage,
    currentGroupPage,
    setCurrentGroupPage,
    lastGroupPage,
    perPage,
    handlePerPageChange,
    mainHeadInput,
    setMainHeadInput,
    getMainHeadLoading,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteAccountGroup,
    deleteAccountGroupLoading,
    deleteWarning,
    totalCount,
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

  useEffect(() => {
    if (token && orgId) {
      getAccountGroupApiCall(orgId, currentGroupPage, "", "TABLE");
    }
  }, [token, orgId, currentGroupPage, perPage]);

  return (
    <AccountGroup
      addAccountGroupLoading={addAccountGroupLoading}
      updateAccountGroupLoading={updateAccountGroupLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      editData={editData}
      handleEditData={handleEditData}
      handleSearchMainHead={handleSearchMainHead}
      handleScrollMainHead={handleScrollMainHead}
      currentPage={currentGroupPage}
      setCurrentPage={setCurrentGroupPage}
      lastPage={lastGroupPage}
      perPage={perPage}
      onPerPageChange={handlePerPageChange}
      mainHeadInput={mainHeadInput}
      setMainHeadInput={setMainHeadInput}
      getMainHeadLoading={getMainHeadLoading}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleShowDeleteDialog={handleShowDeleteDialog}
      handleDeleteAccountGroup={handleDeleteAccountGroup}
      deleteAccountGroupLoading={deleteAccountGroupLoading}
      deleteWarning={deleteWarning}
      totalCount={totalCount}
    />
  );
};
export default AccountGroupContainer;
