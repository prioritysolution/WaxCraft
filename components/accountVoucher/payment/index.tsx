"use client";

import { PaymentProps } from "@/types/accountVoucher/PaymentTypes";
import { Tab, Tabs } from "@heroui/react";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { tabsClassNames } from "@/lib/uiStyles";
import { Banknote } from "lucide-react";
import { FC } from "react";
import PaymentForm from "./PaymentForm";
import PaymentTable from "./PaymentTable";

const Payment: FC<PaymentProps> = ({
  addPaymentLoading,
  deletePaymentLoading,
  loading,
  form,
  handleSubmit,
  selected,
  setSelected,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeletePayment,
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
        icon={Banknote}
        title="Payment"
        description="Record payments and review the active payment list."
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
        <Tab key="form" title="New Payment">
          <FormCard>
            <PaymentForm
              addPaymentLoading={addPaymentLoading}
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

        <Tab key="table" title="Active Payment List">
          <PaymentTable
              handleShowDeleteDialog={handleShowDeleteDialog}
              showDeleteDialog={showDeleteDialog}
              setShowDeleteDialog={setShowDeleteDialog}
              setTempDeleteId={setTempDeleteId}
              handleDeletePayment={handleDeletePayment}
              deletePaymentLoading={deletePaymentLoading}
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
export default Payment;
