"use client";

import { Tab, Tabs } from "@heroui/react";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { tabsClassNames } from "@/lib/uiStyles";
import { FileSpreadsheet } from "lucide-react";
import { FC } from "react";
import { SalesVoucherProps } from "@/types/inventoryVoucher/SalesVoucherTypes";
import SalesVoucherForm from "./SalesVoucherForm";
import InvoiceTable from "./InvoiceTable";

const SalesVoucher: FC<SalesVoucherProps> = ({
  loading,
  deleteInvoiceLoading,
  handleSalesVoucherProcess,
  form,
  parentSelected,
  setParentSelected,
  selected,
  handleIsSelected,
  partyId,
  tabSelected,
  setTabSelected,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteInvoiceData,
  showInvoiceDialog,
  setShowInvoiceDialog,
  handleShowInvoiceDialog,
  handleSearchOrderParty,
  handleScrollOrderParty,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  orderPartyInput,
  setOrderPartyInput,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={FileSpreadsheet}
        title="Sales Voucher"
        description="Create invoices and manage active sales documents."
      />
      <Tabs
        aria-label="Options"
        selectedKey={tabSelected}
        onSelectionChange={(key) => setTabSelected(String(key))}
        color="primary"
        size="md"
        radius="lg"
        classNames={tabsClassNames}
      >
        <Tab key="form" title="New Invoice">
          <FormCard>
            <SalesVoucherForm
              form={form}
              parentSelected={parentSelected}
              setParentSelected={setParentSelected}
              selected={selected}
              handleIsSelected={handleIsSelected}
              partyId={partyId}
              handleSalesVoucherProcess={handleSalesVoucherProcess}
              handleSearchOrderParty={handleSearchOrderParty}
              handleScrollOrderParty={handleScrollOrderParty}
              orderPartyInput={orderPartyInput}
              setOrderPartyInput={setOrderPartyInput}
            />
          </FormCard>
        </Tab>

        <Tab key="table" title="Active Invoice">
          <InvoiceTable
              deleteInvoiceLoading={deleteInvoiceLoading}
              handleShowDeleteDialog={handleShowDeleteDialog}
              showDeleteDialog={showDeleteDialog}
              setShowDeleteDialog={setShowDeleteDialog}
              setTempDeleteId={setTempDeleteId}
              handleDeleteInvoiceData={handleDeleteInvoiceData}
              showInvoiceDialog={showInvoiceDialog}
              setShowInvoiceDialog={setShowInvoiceDialog}
              handleShowInvoiceDialog={handleShowInvoiceDialog}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              lastPage={lastPage}
              perPage={perPage}
              onPerPageChange={onPerPageChange}
              loading={loading}
            />
        </Tab>
      </Tabs>
    </PageShell>
  );
};
export default SalesVoucher;
