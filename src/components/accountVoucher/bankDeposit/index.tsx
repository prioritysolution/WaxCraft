"use client";

import { BankDepositProps } from "@/types/accountVoucher/BankDepositTypes";
import { Tab, Tabs } from "@heroui/react";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { tabsClassNames } from "@/lib/uiStyles";
import { ArrowUpFromLine } from "lucide-react";
import { FC } from "react";
import BankDepositForm from "./BankDepositForm";
import BankDepositTable from "./BankDepositTable";

const BankDeposit: FC<BankDepositProps> = ({
  addBankDepositLoading,
  deleteBankDepositLoading,
  loading,
  form,
  handleSubmit,
  selected,
  setSelected,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteBankDeposit,
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
        icon={ArrowUpFromLine}
        title="Bank Deposit"
        description="Record deposits and review the active deposit list."
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
        <Tab key="form" title="New Deposit">
          <FormCard>
            <BankDepositForm
              addBankDepositLoading={addBankDepositLoading}
              form={form}
              handleSubmit={handleSubmit}
              getBankAccountLoading={getBankAccountLoading}
            />
          </FormCard>
        </Tab>

        <Tab key="table" title="Active Deposit List">
          <BankDepositTable
              handleShowDeleteDialog={handleShowDeleteDialog}
              showDeleteDialog={showDeleteDialog}
              setShowDeleteDialog={setShowDeleteDialog}
              setTempDeleteId={setTempDeleteId}
              handleDeleteBankDeposit={handleDeleteBankDeposit}
              deleteBankDepositLoading={deleteBankDepositLoading}
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
export default BankDeposit;
