"use client";

import {
  PageActionButton,
  PageCountBadge,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { Maximize2 } from "lucide-react";
import { FC } from "react";
import ItemSizeTable from "./ItemSizeTable";
import { ItemSizeProps } from "@/types/master/ItemSizeTypes";
import ItemSizeForm from "./ItemSizeForm";

const ItemSize: FC<ItemSizeProps> = ({
  addItemSizeLoading,
  updateItemSizeLoading,
  loading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  handleEditData,
  categoryId,
  handleSearchCategory,
  handleScrollCategory,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  categoryInput,
  setCategoryInput,
  getItemCategoryLoading,
  getItemModelLoading,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteItemSize,
  deleteItemSizeLoading,
  deleteWarning,
  totalCount,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={Maximize2}
        title="Item Size"
        description="Maintain sizes linked to categories and models."
        badge={<PageCountBadge count={totalCount} singular="size" plural="sizes" />}
        action={
          <PageActionButton onPress={() => setIsOpen(true)}>
            Add Item Size
          </PageActionButton>
        }
      />

      <ItemSizeForm
        addItemSizeLoading={addItemSizeLoading}
        updateItemSizeLoading={updateItemSizeLoading}
        form={form}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={editData}
        categoryId={categoryId}
        handleSearchCategory={handleSearchCategory}
        handleScrollCategory={handleScrollCategory}
        categoryInput={categoryInput}
        setCategoryInput={setCategoryInput}
        getItemCategoryLoading={getItemCategoryLoading}
        getItemModelLoading={getItemModelLoading}
      />

      <ItemSizeTable
          loading={loading}
          handleEditData={handleEditData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          lastPage={lastPage}
          perPage={perPage}
          onPerPageChange={onPerPageChange}
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
          setTempDeleteId={setTempDeleteId}
          handleShowDeleteDialog={handleShowDeleteDialog}
          handleDeleteItemSize={handleDeleteItemSize}
          deleteItemSizeLoading={deleteItemSizeLoading}
          deleteWarning={deleteWarning}
        />
    </PageShell>
  );
};
export default ItemSize;
