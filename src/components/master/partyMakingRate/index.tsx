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
  onPerPageChange,
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
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={Percent}
        title="Party Making Rate"
        description="Manage making rates assigned to parties."
        badge={
          <PageCountBadge
            count={totalCount}
            singular="rate"
            plural="rates"
          />
        }
        action={
          <PageActionButton onPress={() => setIsOpen(true)}>
            Add Party Making Rate
          </PageActionButton>
        }
      />

      <PartyMakingRateForm
        addPartyMakingRateLoading={addPartyMakingRateLoading}
        updatePartyMakingRateLoading={updatePartyMakingRateLoading}
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
      />

      <PartyMakingRateTable
        loading={loading}
        handleEditData={handleEditData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        lastPage={lastPage}
        perPage={perPage}
        onPerPageChange={onPerPageChange}
        tableInput={tableInput}
        handleFilterTableData={handleFilterTableData}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        setTempDeleteId={setTempDeleteId}
        handleShowDeleteDialog={handleShowDeleteDialog}
        handleDeletePartyMakingRate={handleDeletePartyMakingRate}
        deletePartyMakingRateLoading={deletePartyMakingRateLoading}
        deleteWarning={deleteWarning}
      />
    </PageShell>
  );
};

export default PartyMakingRate;
