"use client";

import { PartyMakingRateProps } from "@/types/master/PartyMakingRateTypes";
import { Percent } from "lucide-react";
import { FC } from "react";
import {
  PageActionButton,
  PageCountBadge,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import PartyMakingRateForm from "./PartyMakingRateForm";
import PartyMakingRateTable from "./PartyMakingRateTable";

const PartyMakingRate: FC<PartyMakingRateProps> = ({
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
  onPerPageChange,
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
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={Percent}
        title="Party Making Rate"
        description="Set WT rate, ghat, and polish once per party, then enter a making rate for each item model."
        badge={
          <PageCountBadge
            count={totalCount}
            singular="party"
            plural="parties"
          />
        }
        action={
          <PageActionButton onPress={handleOpenAdd}>
            Add Party Making Rate
          </PageActionButton>
        }
      />

      <PartyMakingRateForm
        savePartyMakingRateLoading={savePartyMakingRateLoading}
        rowsLoading={rowsLoading}
        form={form}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={editData}
        partyOptions={partyOptions}
        partyInput={partyInput}
        setPartyInput={setPartyInput}
        handleSearchParty={handleSearchParty}
        handleScrollParty={handleScrollParty}
        getPartyLoading={getPartyLoading}
        getModelLoading={getModelLoading}
      />

      <PartyMakingRateTable
        loading={loading}
        rows={visibleParties}
        filterPartyOptions={filterPartyOptions}
        filterPartyLoading={filterPartyLoading}
        partyFilterId={partyFilterId}
        onPartyFilterChange={onPartyFilterChange}
        handleEditData={handleEditData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        lastPage={lastPage}
        perPage={perPage}
        onPerPageChange={onPerPageChange}
        tableInput={tableInput}
        handleFilterTableData={handleFilterTableData}
      />
    </PageShell>
  );
};

export default PartyMakingRate;
