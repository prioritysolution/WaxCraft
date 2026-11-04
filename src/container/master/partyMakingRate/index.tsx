"use client";

import PartyMakingRate from "@/components/master/partyMakingRate";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { usePartyMakingRate } from "./Hooks";

const PartyMakingRateContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getPartyMakingRateApiCall,
    addPartyMakingRateLoading,
    updatePartyMakingRateLoading,
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
    tableInput,
    handleFilterTableData,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeletePartyMakingRate,
    deletePartyMakingRateLoading,
    deleteWarning,
    totalCount,
    partyOptions,
    partyInput,
    setPartyInput,
    handleSearchParty,
    handleScrollParty,
    getPartyLoading,
  } = usePartyMakingRate();

  useEffect(() => {
    if (token && orgId)
      getPartyMakingRateApiCall(orgId, currentPage, tableInput);
  }, [token, orgId, currentPage, perPage]);

  return (
    <PartyMakingRate
      addPartyMakingRateLoading={addPartyMakingRateLoading}
      updatePartyMakingRateLoading={updatePartyMakingRateLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      editData={editData}
      handleEditData={handleEditData}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      perPage={perPage}
      onPerPageChange={handlePerPageChange}
      tableInput={tableInput}
      handleFilterTableData={handleFilterTableData}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleShowDeleteDialog={handleShowDeleteDialog}
      handleDeletePartyMakingRate={handleDeletePartyMakingRate}
      deletePartyMakingRateLoading={deletePartyMakingRateLoading}
      deleteWarning={deleteWarning}
      totalCount={totalCount}
      partyOptions={partyOptions}
      partyInput={partyInput}
      setPartyInput={setPartyInput}
      handleSearchParty={handleSearchParty}
      handleScrollParty={handleScrollParty}
      getPartyLoading={getPartyLoading}
    />
  );
};

export default PartyMakingRateContainer;
