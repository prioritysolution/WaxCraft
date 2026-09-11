"use client";

import {
  PageActionButton,
  PageCountBadge,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { Users } from "lucide-react";
import { FC } from "react";
import PartyTable from "./PartyTable";
import { PartyProps } from "@/types/master/PartyTypes";
import PartyForm from "./PartyForm";

const Party: FC<PartyProps> = ({
  addPartyLoading,
  updatePartyLoading,
  loading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  handleEditData,
  partyTableInput,
  handleFilterTableData,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  getPartyLedgerLoading,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteParty,
  deletePartyLoading,
  deleteWarning,
  totalCount,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={Users}
        title="Party"
        description="Maintain customers and suppliers used in bookings and vouchers."
        badge={<PageCountBadge count={totalCount} singular="party" plural="parties" />}
        action={
          <PageActionButton onPress={() => setIsOpen(true)}>
            Add Party
          </PageActionButton>
        }
      />

      <PartyForm
        addPartyLoading={addPartyLoading}
        updatePartyLoading={updatePartyLoading}
        form={form}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={editData}
        getPartyLedgerLoading={getPartyLedgerLoading}
      />
      <PartyTable
          handleEditData={handleEditData}
          partyTableInput={partyTableInput}
          handleFilterTableData={handleFilterTableData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          lastPage={lastPage}
          perPage={perPage}
          onPerPageChange={onPerPageChange}
          loading={loading}
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
          setTempDeleteId={setTempDeleteId}
          handleShowDeleteDialog={handleShowDeleteDialog}
          handleDeleteParty={handleDeleteParty}
          deletePartyLoading={deletePartyLoading}
          deleteWarning={deleteWarning}
        />
    </PageShell>
  );
};
export default Party;
