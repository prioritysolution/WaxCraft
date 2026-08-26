"use client";

import { FC } from "react";
import { Layers } from "lucide-react";
import ItemCategoryForm from "./ItemCategoryForm";
import ItemCategoryTable from "./ItemCategoryTable";
import { ItemCategoryProps } from "@/types/master/ItemCategoryTypes";
import {
  PageActionButton,
  PageCountBadge,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";

const ItemCategory: FC<ItemCategoryProps> = ({
  addItemCategoryLoading,
  updateItemCategoryLoading,
  loading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  handleEditData,
  currentPage,
  setCurrentPage,
  lastPage,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteItemCategory,
  deleteItemCategoryLoading,
  deleteWarning,
  totalCount,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={Layers}
        title="Item Category"
        description="Master data used across items, sizes, models, and designs."
        badge={<PageCountBadge count={totalCount} singular="category" plural="categories" />}
        action={
          <PageActionButton onPress={() => setIsOpen(true)}>
            Add Category
          </PageActionButton>
        }
      />

      <ItemCategoryForm
        addItemCategoryLoading={addItemCategoryLoading}
        updateItemCategoryLoading={updateItemCategoryLoading}
        form={form}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={editData}
      />

      <ItemCategoryTable
        handleEditData={handleEditData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        lastPage={lastPage}
        loading={loading}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        setTempDeleteId={setTempDeleteId}
        handleShowDeleteDialog={handleShowDeleteDialog}
        handleDeleteItemCategory={handleDeleteItemCategory}
        deleteItemCategoryLoading={deleteItemCategoryLoading}
        deleteWarning={deleteWarning}
      />
    </PageShell>
  );
};

export default ItemCategory;
