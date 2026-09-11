"use client";

import {
  PageActionButton,
  PageCountBadge,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { BookOpen } from "lucide-react";
import { FC } from "react";
import AccountLedgerForm from "./AccountLedgerForm";
import AccountLedgerTable from "./AccountLedgerTable";
import { AccountLedgerProps } from "@/types/master/AccountLedgerTypes";

const AccountLedger: FC<AccountLedgerProps> = ({
  addAccountLedgerLoading,
  updateAccountLedgerLoading,
  loading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  handleEditData,
  handleSearchMainHead,
  handleScrollMainHead,
  handleSearchHead,
  handleScrollHead,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  ledgerTableInput,
  handleFilterTableData,
  mainHeadInput,
  setMainHeadInput,
  headInput,
  setHeadInput,
  getMainHeadLoading,
  getHeadLoading,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteAccountLedger,
  deleteAccountLedgerLoading,
  deleteWarning,
  totalCount,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={BookOpen}
        title="Account Ledger"
        description="Create and update ledgers for accounting vouchers."
        badge={<PageCountBadge count={totalCount} singular="ledger" plural="ledgers" />}
        action={
          <PageActionButton onPress={() => setIsOpen(true)}>
            Add Account Ledger
          </PageActionButton>
        }
      />

      <AccountLedgerForm
        addAccountLedgerLoading={addAccountLedgerLoading}
        updateAccountLedgerLoading={updateAccountLedgerLoading}
        form={form}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={editData}
        handleSearchMainHead={handleSearchMainHead}
        handleScrollMainHead={handleScrollMainHead}
        handleSearchHead={handleSearchHead}
        handleScrollHead={handleScrollHead}
        mainHeadInput={mainHeadInput}
        setMainHeadInput={setMainHeadInput}
        headInput={headInput}
        setHeadInput={setHeadInput}
        getMainHeadLoading={getMainHeadLoading}
        getHeadLoading={getHeadLoading}
      />
      <AccountLedgerTable
          handleEditData={handleEditData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          lastPage={lastPage}
          perPage={perPage}
          onPerPageChange={onPerPageChange}
          ledgerTableInput={ledgerTableInput}
          handleFilterTableData={handleFilterTableData}
          loading={loading}
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
          setTempDeleteId={setTempDeleteId}
          handleShowDeleteDialog={handleShowDeleteDialog}
          handleDeleteAccountLedger={handleDeleteAccountLedger}
          deleteAccountLedgerLoading={deleteAccountLedgerLoading}
          deleteWarning={deleteWarning}
        />
    </PageShell>
  );
};
export default AccountLedger;
