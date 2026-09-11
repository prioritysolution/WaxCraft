"use client";

import {
  PageActionButton,
  PageCountBadge,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { Landmark } from "lucide-react";
import { FC } from "react";
import BankAccountForm from "./BankAccountForm";
import BankAccountTable from "./BankAccountTable";
import { BankAccountProps } from "@/types/master/BankAccountTypes";

const BankAccount: FC<BankAccountProps> = ({
  addBankAccountLoading,
  updateBankAccountLoading,
  loading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  handleEditData,
  getBankLedgerLoading,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteBankAccount,
  deleteBankAccountLoading,
  deleteWarning,
  totalCount,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={Landmark}
        title="Bank Account"
        description="Store bank accounts used in deposits, withdrawals, and transfers."
        badge={<PageCountBadge count={totalCount} singular="account" plural="accounts" />}
        action={
          <PageActionButton onPress={() => setIsOpen(true)}>
            Add Bank Account
          </PageActionButton>
        }
      />

      <BankAccountForm
        addBankAccountLoading={addBankAccountLoading}
        updateBankAccountLoading={updateBankAccountLoading}
        form={form}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={editData}
        getBankLedgerLoading={getBankLedgerLoading}
      />
      <BankAccountTable
        handleEditData={handleEditData}
        loading={loading}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        setTempDeleteId={setTempDeleteId}
        handleShowDeleteDialog={handleShowDeleteDialog}
        handleDeleteBankAccount={handleDeleteBankAccount}
        deleteBankAccountLoading={deleteBankAccountLoading}
        deleteWarning={deleteWarning}
      />
    </PageShell>
  );
};
export default BankAccount;
