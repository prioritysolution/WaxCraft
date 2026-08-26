"use client";

import {
  PageActionButton,
  PageCountBadge,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { FolderTree } from "lucide-react";
import { FC } from "react";
import AccountGroupForm from "./AccountGroupForm";
import AccountGroupTable from "./AccountGroupTable";
import { AccountGroupProps } from "@/types/master/AccountGroupTypes";

const AccountGroup: FC<AccountGroupProps> = ({
  addAccountGroupLoading,
  updateAccountGroupLoading,
  loading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  handleEditData,
  handleSearchMainHead,
  handleScrollMainHead,
  currentPage,
  setCurrentPage,
  lastPage,
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
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={FolderTree}
        title="Account Group"
        description="Organize ledgers under accounting heads and groups."
        badge={<PageCountBadge count={totalCount} singular="group" plural="groups" />}
        action={
          <PageActionButton onPress={() => setIsOpen(true)}>
            Add Account Group
          </PageActionButton>
        }
      />

      <AccountGroupForm
        addAccountGroupLoading={addAccountGroupLoading}
        updateAccountGroupLoading={updateAccountGroupLoading}
        form={form}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={editData}
        handleSearchMainHead={handleSearchMainHead}
        handleScrollMainHead={handleScrollMainHead}
        mainHeadInput={mainHeadInput}
        setMainHeadInput={setMainHeadInput}
        getMainHeadLoading={getMainHeadLoading}
      />
      <AccountGroupTable
          handleEditData={handleEditData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          lastPage={lastPage}
          loading={loading}
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
          setTempDeleteId={setTempDeleteId}
          handleShowDeleteDialog={handleShowDeleteDialog}
          handleDeleteAccountGroup={handleDeleteAccountGroup}
          deleteAccountGroupLoading={deleteAccountGroupLoading}
          deleteWarning={deleteWarning}
        />
    </PageShell>
  );
};
export default AccountGroup;
