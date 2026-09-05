"use client";

import { BankWithdrawnProps } from "@/types/accountVoucher/BankWithdrawnTypes";
import { Tab, Tabs } from "@heroui/react";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { tabsClassNames } from "@/lib/uiStyles";
import { ArrowDownToLine } from "lucide-react";
import { FC } from "react";
import BankWithdrawnForm from "./BankWithdrawnForm";
import BankWithdrawnTable from "./BankWithdrawnTable";

const BankWithdrawn: FC<BankWithdrawnProps> = ({
  addBankWithdrawnLoading,
  deleteBankWithdrawnLoading,
  loading,
  form,
  handleSubmit,
  selected,
  setSelected,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteBankWithdrawn,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  getBankAccountLoading,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={ArrowDownToLine}
        title="Bank Withdrawal"
        description="Record bank withdrawals and review the active list."
      />
      <Tabs
        aria-label="Options"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(String(key))}
        color="primary"
        size="md"
        radius="lg"
        classNames={tabsClassNames}
      >
        <Tab key="form" title="New Withdrawn">
          <FormCard>
            <BankWithdrawnForm
              getBankAccountLoading={getBankAccountLoading}
              addBankWithdrawnLoading={addBankWithdrawnLoading}
              form={form}
              handleSubmit={handleSubmit}
            />
          </FormCard>
        </Tab>

        <Tab key="table" title="Active Withdrawn List">
          <BankWithdrawnTable
              handleShowDeleteDialog={handleShowDeleteDialog}
              showDeleteDialog={showDeleteDialog}
              setShowDeleteDialog={setShowDeleteDialog}
              setTempDeleteId={setTempDeleteId}
              handleDeleteBankWithdrawn={handleDeleteBankWithdrawn}
              deleteBankWithdrawnLoading={deleteBankWithdrawnLoading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              lastPage={lastPage}
              perPage={perPage}
              onPerPageChange={onPerPageChange}
              loading={loading}
              fromDate={fromDate}
              toDate={toDate}
              setFromDate={setFromDate}
              setToDate={setToDate}
            />
        </Tab>
      </Tabs>
    </PageShell>
  );
};

export default BankWithdrawn;
