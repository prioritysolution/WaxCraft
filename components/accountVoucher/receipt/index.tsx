"use client";

import { ReceiptProps } from "@/types/accountVoucher/ReceiptTypes";
import { Tab, Tabs } from "@heroui/react";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { tabsClassNames } from "@/lib/uiStyles";
import { HandCoins } from "lucide-react";
import { FC } from "react";
import ReceiptForm from "./ReceiptForm";
import ReceiptTable from "./ReceiptTable";

const Receipt: FC<ReceiptProps> = ({
  addReceiptLoading,
  deleteReceiptLoading,
  loading,
  form,
  handleSubmit,
  selected,
  setSelected,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteReceipt,
  handleSearchReceiptLedger,
  handleScrollReceiptLedger,
  currentPage,
  setCurrentPage,
  lastPage,
  receiptLedgerInput,
  setReceiptLedgerInput,
  getReceiptLedgerLoading,
  checkReceiptPartyLoading,
  getBankAccountLoading,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={HandCoins}
        title="Receipt"
        description="Record receipts and review the active receipt list."
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
        <Tab key="form" title="New Receipt">
          <FormCard>
            <ReceiptForm
              addReceiptLoading={addReceiptLoading}
              form={form}
              handleSubmit={handleSubmit}
              handleSearchReceiptLedger={handleSearchReceiptLedger}
              handleScrollReceiptLedger={handleScrollReceiptLedger}
              receiptLedgerInput={receiptLedgerInput}
              setReceiptLedgerInput={setReceiptLedgerInput}
              getReceiptLedgerLoading={getReceiptLedgerLoading}
              checkReceiptPartyLoading={checkReceiptPartyLoading}
              getBankAccountLoading={getBankAccountLoading}
            />
          </FormCard>
        </Tab>

        <Tab key="table" title="Active Receipt List">
          <ReceiptTable
              handleShowDeleteDialog={handleShowDeleteDialog}
              showDeleteDialog={showDeleteDialog}
              setShowDeleteDialog={setShowDeleteDialog}
              setTempDeleteId={setTempDeleteId}
              handleDeleteReceipt={handleDeleteReceipt}
              deleteReceiptLoading={deleteReceiptLoading}
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
export default Receipt;
