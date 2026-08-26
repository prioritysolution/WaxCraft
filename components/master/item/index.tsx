"use client";

import { FC } from "react";
import ItemTable from "./ItemTable";
import { ItemProps } from "@/types/master/ItemTypes";
import ItemForm from "./ItemForm";
import {
  PageActionButton,
  PageCountBadge,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { Package } from "lucide-react";

const Item: FC<ItemProps> = ({
  addItemLoading,
  updateItemLoading,
  loading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  handleEditData,
  categoryId,
  modelId,
  sizeId,
  colourId,
  itemTableInput,
  handleFilterTableData,
  handleSearchCategory,
  handleScrollCategory,
  handleSearchPurchaseLedger,
  handleScrollPurchaseLedger,
  handleSearchSalesLedger,
  handleScrollSalesLedger,
  currentPage,
  setCurrentPage,
  lastPage,
  categoryInput,
  setCategoryInput,
  purchaseLedgerInput,
  setPurchaseLedgerInput,
  salesLedgerInput,
  setSalesLedgerInput,
  getPurchaseLedgerLoading,
  getSalesLedgerLoading,
  getCategoryLoading,
  getModelLoading,
  getSizeLoading,
  getColourLoading,
  getUnitLoading,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteItem,
  deleteItemLoading,
  deleteWarning,
  totalCount,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={Package}
        title="Item"
        description="Create and manage product items used across vouchers and reports."
        badge={<PageCountBadge count={totalCount} singular="item" plural="items" />}
        action={
          <PageActionButton onPress={() => setIsOpen(true)}>
            Add Item
          </PageActionButton>
        }
      />

      <ItemForm
        addItemLoading={addItemLoading}
        updateItemLoading={updateItemLoading}
        form={form}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={editData}
        categoryId={categoryId}
        modelId={modelId}
        sizeId={sizeId}
        colourId={colourId}
        handleSearchCategory={handleSearchCategory}
        handleScrollCategory={handleScrollCategory}
        handleSearchPurchaseLedger={handleSearchPurchaseLedger}
        handleScrollPurchaseLedger={handleScrollPurchaseLedger}
        handleSearchSalesLedger={handleSearchSalesLedger}
        handleScrollSalesLedger={handleScrollSalesLedger}
        categoryInput={categoryInput}
        setCategoryInput={setCategoryInput}
        purchaseLedgerInput={purchaseLedgerInput}
        setPurchaseLedgerInput={setPurchaseLedgerInput}
        salesLedgerInput={salesLedgerInput}
        setSalesLedgerInput={setSalesLedgerInput}
        getPurchaseLedgerLoading={getPurchaseLedgerLoading}
        getSalesLedgerLoading={getSalesLedgerLoading}
        getCategoryLoading={getCategoryLoading}
        getModelLoading={getModelLoading}
        getSizeLoading={getSizeLoading}
        getColourLoading={getColourLoading}
        getUnitLoading={getUnitLoading}
      />
      <ItemTable
          handleEditData={handleEditData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          lastPage={lastPage}
          itemTableInput={itemTableInput}
          handleFilterTableData={handleFilterTableData}
          loading={loading}
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
          setTempDeleteId={setTempDeleteId}
          handleShowDeleteDialog={handleShowDeleteDialog}
          handleDeleteItem={handleDeleteItem}
          deleteItemLoading={deleteItemLoading}
          deleteWarning={deleteWarning}
        />
    </PageShell>
  );
};
export default Item;
