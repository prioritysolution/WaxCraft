"use client";

import Party from "@/components/master/party";
import { useParty } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";

const PartyContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getPartyApiCall,
    getPartyLedgerApiCall,
    addPartyLoading,
    updatePartyLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    partyType,
    partyTableInput,
    handleFilterTableData,
    currentPage,
    setCurrentPage,
    lastPage,
    getPartyLedgerLoading,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteParty,
    deletePartyLoading,
    deleteWarning,
    totalCount,
  } = useParty();

  useEffect(() => {
    if (token && orgId) {
      getPartyApiCall(orgId, currentPage, partyTableInput);
    }
  }, [token, orgId, currentPage]);

  useEffect(() => {
    if (token && orgId && partyType) {
      getPartyLedgerApiCall(orgId, partyType);
    }
    // Don't wipe selected ledger during Edit.
    if (!editData) form.setValue("underLedger", "");
  }, [token, orgId, partyType]);

  return (
    <Party
      addPartyLoading={addPartyLoading}
      updatePartyLoading={updatePartyLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      editData={editData}
      handleEditData={handleEditData}
      partyTableInput={partyTableInput}
      handleFilterTableData={handleFilterTableData}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      getPartyLedgerLoading={getPartyLedgerLoading}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleShowDeleteDialog={handleShowDeleteDialog}
      handleDeleteParty={handleDeleteParty}
      deletePartyLoading={deletePartyLoading}
      deleteWarning={deleteWarning}
      totalCount={totalCount}
    />
  );
};
export default PartyContainer;
