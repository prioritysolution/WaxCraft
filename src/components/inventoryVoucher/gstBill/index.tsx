"use client";

import { GstBillProps } from "@/types/inventoryVoucher/GstBillTypes";
import { Tab, Tabs } from "@heroui/react";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { tabsClassNames } from "@/lib/uiStyles";
import { Receipt } from "lucide-react";
import { FC } from "react";
import GstBillForm from "./GstBillForm";
import GstBillTable from "./GstBillTable";
import InvoiceModal from "./InvoiceModal";

const GstBill: FC<GstBillProps> = ({
  addGstBillLoading,
  deleteGstBillLoading,
  loading,
  form,
  handleSubmit,
  selected,
  setSelected,
  itemTableData,
  handleDeleteItemTableData,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteGst,
  handleShowPrint,
  printLoading,
  handleSearchOrderParty,
  handleScrollOrderParty,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  orderPartyInput,
  setOrderPartyInput,
  itemGrandTotal,
  itemGst,
  itemRoundOff,
  handleAddGstBill,
  showInvoice,
  setShowInvoice,
  invoiceData,
  setInvoiceData,
  getOrderPartyLoading,
  getUnitLoading,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={Receipt}
        title="GST Bill"
        description="Prepare GST bills and keep the active bill list updated."
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
        <Tab key="form" title="New GST">
          <FormCard>
            <GstBillForm
              addGstBillLoading={addGstBillLoading}
              form={form}
              handleSubmit={handleSubmit}
              itemTableData={itemTableData}
              handleDeleteItemTableData={handleDeleteItemTableData}
              handleSearchOrderParty={handleSearchOrderParty}
              handleScrollOrderParty={handleScrollOrderParty}
              orderPartyInput={orderPartyInput}
              setOrderPartyInput={setOrderPartyInput}
              itemGrandTotal={itemGrandTotal}
              itemGst={itemGst}
              itemRoundOff={itemRoundOff}
              handleAddGstBill={handleAddGstBill}
              getOrderPartyLoading={getOrderPartyLoading}
              getUnitLoading={getUnitLoading}
            />
          </FormCard>
        </Tab>

        <Tab key="table" title="Active GST List">
          <GstBillTable
              loading={loading}
              handleShowDeleteDialog={handleShowDeleteDialog}
              showDeleteDialog={showDeleteDialog}
              setShowDeleteDialog={setShowDeleteDialog}
              setTempDeleteId={setTempDeleteId}
              handleDeleteGst={handleDeleteGst}
              deleteGstBillLoading={deleteGstBillLoading}
              handleShowPrint={handleShowPrint}
              printLoading={printLoading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              lastPage={lastPage}
              perPage={perPage}
              onPerPageChange={onPerPageChange}
            />
        </Tab>
      </Tabs>

      <InvoiceModal
        showInvoice={showInvoice}
        setShowInvoice={setShowInvoice}
        invoiceData={invoiceData}
        setInvoiceData={setInvoiceData}
      />
    </PageShell>
  );
};
export default GstBill;
