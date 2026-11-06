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
    savePartyMakingRateLoading,
    rowsLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    handleOpenAdd,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    tableInput,
    handleFilterTableData,
    visibleParties,
    filterPartyOptions,
    filterPartyLoading,
    partyFilterId,
    onPartyFilterChange,
    totalCount,
    partyOptions,
    partyInput,
    setPartyInput,
    handleSearchParty,
    handleScrollParty,
    getPartyLoading,
    getModelLoading,
  } = usePartyMakingRate();

  useEffect(() => {
    if (token && orgId) getPartyMakingRateApiCall(orgId, 1, "");
  }, [token, orgId]);

  return (
    <PartyMakingRate
      savePartyMakingRateLoading={savePartyMakingRateLoading}
      rowsLoading={rowsLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      editData={editData}
      handleEditData={handleEditData}
      handleOpenAdd={handleOpenAdd}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      perPage={perPage}
      onPerPageChange={handlePerPageChange}
      tableInput={tableInput}
      handleFilterTableData={handleFilterTableData}
      visibleParties={visibleParties}
      filterPartyOptions={filterPartyOptions}
      filterPartyLoading={filterPartyLoading}
      partyFilterId={partyFilterId}
      onPartyFilterChange={onPartyFilterChange}
      totalCount={totalCount}
      partyOptions={partyOptions}
      partyInput={partyInput}
      setPartyInput={setPartyInput}
      handleSearchParty={handleSearchParty}
      handleScrollParty={handleScrollParty}
      getPartyLoading={getPartyLoading}
      getModelLoading={getModelLoading}
    />
  );
};

export default PartyMakingRateContainer;
