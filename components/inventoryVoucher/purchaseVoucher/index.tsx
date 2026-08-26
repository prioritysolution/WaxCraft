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
            />
        </Tab>
      </Tabs>
    </PageShell>
  );
};
export default PurchaseVoucher;
