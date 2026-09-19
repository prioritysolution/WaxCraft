"use client";

import { PurchaseVoucherProps } from "@/types/inventoryVoucher/PurchaseVoucherTypes";
import { Tab, Tabs } from "@heroui/react";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { tabsClassNames } from "@/lib/uiStyles";
import { FileInput } from "lucide-react";
import { FC } from "react";
import PurchaseVoucherForm from "./PurchaseVoucherForm";
import PurchaseVoucherTable from "./PurchaseVoucherTable";
import { OrderBookingSuccessModal } from "@/components/inventoryVoucher/orderBooking/OrderBookingSuccessModal";

const PurchaseVoucher: FC<PurchaseVoucherProps> = ({
  addPurchaseVoucherLoading,
  deletePurchaseVoucherLoading,
  loading,
  form,
  handleSubmit,
  selected,
  setSelected,
  purchaseTableData,
  handleDeletePurchaseTableData,
  handleUpdatePurchaseTableRate,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeletePurchase,
  handleAddPurchase,
  purchaseType,
  handleSearchItem,
  handleScrollItem,
  handleSearchPurchaseParty,
  handleScrollPurchaseParty,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  purchasePartyInput,
  setPurchasePartyInput,
  itemInput,
  setItemInput,
  orderPurchaseType,
  handleOrderPurchaseTypeChange,
  showRequisitionModal,
  setShowRequisitionModal,
  requisitionLoading,
  handleAddRequisitionItems,
  showSuccessDialog,
  setShowSuccessDialog,
  successMessage,
  successPurchaseNos,
  handleCloseSuccessDialog,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={FileInput}
        title="Purchase Voucher"
        description="Record purchases and review the active voucher list."
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
        <Tab key="form" title="New Purchase">
          <FormCard>
            <PurchaseVoucherForm
              addPurchaseVoucherLoading={addPurchaseVoucherLoading}
              form={form}
              handleSubmit={handleSubmit}
              purchaseTableData={purchaseTableData}
              handleDeletePurchaseTableData={handleDeletePurchaseTableData}
              handleUpdatePurchaseTableRate={handleUpdatePurchaseTableRate}
              purchaseType={purchaseType}
              handleAddPurchase={handleAddPurchase}
              handleSearchItem={handleSearchItem}
              handleScrollItem={handleScrollItem}
              handleSearchPurchaseParty={handleSearchPurchaseParty}
              handleScrollPurchaseParty={handleScrollPurchaseParty}
              purchasePartyInput={purchasePartyInput}
              setPurchasePartyInput={setPurchasePartyInput}
              itemInput={itemInput}
              setItemInput={setItemInput}
              orderPurchaseType={orderPurchaseType}
              handleOrderPurchaseTypeChange={handleOrderPurchaseTypeChange}
              showRequisitionModal={showRequisitionModal}
              setShowRequisitionModal={setShowRequisitionModal}
              requisitionLoading={requisitionLoading}
              handleAddRequisitionItems={handleAddRequisitionItems}
            />
          </FormCard>
        </Tab>

        <Tab key="table" title="Active Purchase List">
          <PurchaseVoucherTable
            loading={loading}
            handleShowDeleteDialog={handleShowDeleteDialog}
            showDeleteDialog={showDeleteDialog}
            setShowDeleteDialog={setShowDeleteDialog}
            setTempDeleteId={setTempDeleteId}
            handleDeletePurchase={handleDeletePurchase}
            deletePurchaseVoucherLoading={deletePurchaseVoucherLoading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            lastPage={lastPage}
            perPage={perPage}
            onPerPageChange={onPerPageChange}
          />
        </Tab>
      </Tabs>

      <OrderBookingSuccessModal
        isOpen={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        message={successMessage}
        orderIds={successPurchaseNos}
        onClose={handleCloseSuccessDialog}
        idLabel={
          successPurchaseNos.length > 1 ? "Purchase Nos." : "Purchase No."
        }
        fallbackMessage="Purchase added successfully"
      />
    </PageShell>
  );
};
export default PurchaseVoucher;
