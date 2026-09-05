"use client";

import {
  PageActionButton,
  PageCountBadge,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { Shapes } from "lucide-react";
import { FC } from "react";
import ItemModelForm from "./ItemModelForm";
import ItemModelTable from "./ItemModelTable";
import { ItemModelProps } from "@/types/master/ItemModelTypes";

const ItemModel: FC<ItemModelProps> = ({
  addItemModelLoading,
  updateItemModelLoading,
  loading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  handleEditData,
  handleSearchCategory,
  handleScrollCategory,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  getCategoryLoading,
  categoryInput,
  setCategoryInput,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteItemModel,
  deleteItemModelLoading,
  deleteWarning,
  totalCount,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={Shapes}
        title="Item Model"
        description="Create models under each item category."
        badge={<PageCountBadge count={totalCount} singular="model" plural="models" />}
        action={
          <PageActionButton onPress={() => setIsOpen(true)}>
            Add Item Model
          </PageActionButton>
        }
      />

      <ItemModelForm
        addItemModelLoading={addItemModelLoading}
        updateItemModelLoading={updateItemModelLoading}
        form={form}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={editData}
        handleSearchCategory={handleSearchCategory}
        handleScrollCategory={handleScrollCategory}
        getCategoryLoading={getCategoryLoading}
        categoryInput={categoryInput}
        setCategoryInput={setCategoryInput}
      />
      <ItemModelTable
        handleEditData={handleEditData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        lastPage={lastPage}
        perPage={perPage}
        onPerPageChange={onPerPageChange}
        loading={loading}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        setTempDeleteId={setTempDeleteId}
        handleShowDeleteDialog={handleShowDeleteDialog}
        handleDeleteItemModel={handleDeleteItemModel}
        deleteItemModelLoading={deleteItemModelLoading}
        deleteWarning={deleteWarning}
      />
    </PageShell>
  );
};
export default ItemModel;
