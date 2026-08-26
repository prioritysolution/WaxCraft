"use client";

import { BankTransferProps } from "@/types/accountVoucher/BankTransferTypes";
import { Tab, Tabs } from "@heroui/react";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { tabsClassNames } from "@/lib/uiStyles";
import { ArrowLeftRight } from "lucide-react";
import { FC } from "react";
import BankTransferForm from "./BankTransferForm";
import BankTransferTable from "./BankTransferTable";

const BankTransfer: FC<BankTransferProps> = ({
  addBankTransferLoading,
  deleteBankTransferLoading,
  loading,
  form,
  handleSubmit,
  selected,
  setSelected,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteBankTransfer,
  currentPage,
  setCurrentPage,
  lastPage,
  getBankAccountLoading,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={ArrowLeftRight}
        title="Bank Transfer"
        description="Move funds between accounts and review transfers."
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
        <Tab key="form" title="New Transfer">
          <FormCard>
            <BankTransferForm
              getBankAccountLoading={getBankAccountLoading}
              addBankTransferLoading={addBankTransferLoading}
              form={form}
              handleSubmit={handleSubmit}
            />
          </FormCard>
        </Tab>

        <Tab key="table" title="Active Transfer List">
          <BankTransferTable
              handleShowDeleteDialog={handleShowDeleteDialog}
              showDeleteDialog={showDeleteDialog}
              setShowDeleteDialog={setShowDeleteDialog}
              setTempDeleteId={setTempDeleteId}
              handleDeleteBankTransfer={handleDeleteBankTransfer}
              deleteBankTransferLoading={deleteBankTransferLoading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              lastPage={lastPage}
              loading={loading}
            />
        </Tab>
      </Tabs>
    </PageShell>
  );
};

export default BankTransfer;
