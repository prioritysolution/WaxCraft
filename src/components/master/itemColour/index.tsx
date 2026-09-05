"use client";

import { ItemColourProps } from "@/types/master/ItemColourTypes";
import { Palette } from "lucide-react";
import { FC } from "react";
import {
  PageActionButton,
  PageCountBadge,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import ItemColourForm from "./ItemColourForm";
import ItemColourTable from "./ItemColourTable";

const ItemColour: FC<ItemColourProps> = ({
  addItemColourLoading,
  updateItemColourLoading,
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
  perPage,
  onPerPageChange,
  colourTableInput,
  handleFilterTableData,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteItemColour,
  deleteItemColourLoading,
  deleteWarning,
  totalCount,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={Palette}
        title="Item Colour"
        description="Manage colour names used across item masters."
        badge={<PageCountBadge count={totalCount} singular="colour" plural="colours" />}
        action={
          <PageActionButton onPress={() => setIsOpen(true)}>
            Add Item Colour
          </PageActionButton>
        }
      />

      <ItemColourForm
        addItemColourLoading={addItemColourLoading}
        updateItemColourLoading={updateItemColourLoading}
        form={form}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={editData}
      />

      <ItemColourTable
        loading={loading}
        handleEditData={handleEditData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        lastPage={lastPage}
        perPage={perPage}
        onPerPageChange={onPerPageChange}
        colourTableInput={colourTableInput}
        handleFilterTableData={handleFilterTableData}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        setTempDeleteId={setTempDeleteId}
        handleShowDeleteDialog={handleShowDeleteDialog}
        handleDeleteItemColour={handleDeleteItemColour}
        deleteItemColourLoading={deleteItemColourLoading}
        deleteWarning={deleteWarning}
      />
    </PageShell>
  );
};

export default ItemColour;
