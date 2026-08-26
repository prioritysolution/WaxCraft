"use client";

import {
  PageActionButton,
  PageCountBadge,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { Ruler } from "lucide-react";
import { FC } from "react";
import ItemUnitTable from "./ItemUnitTable";
import { ItemUnitProps } from "@/types/master/ItemUnitTypes";
import ItemUnitForm from "./ItemUnitForm";

const ItemUnit: FC<ItemUnitProps> = ({
  addItemUnitLoading,
  updateItemUnitLoading,
  loading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  handleEditData,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteItemUnit,
  deleteItemUnitLoading,
  deleteWarning,
  totalCount,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={Ruler}
        title="Item Unit"
        description="Define measurement units used across items and vouchers."
        badge={<PageCountBadge count={totalCount} singular="unit" plural="units" />}
        action={
          <PageActionButton onPress={() => setIsOpen(true)}>
            Add Item Unit
          </PageActionButton>
        }
      />

      <ItemUnitForm
        addItemUnitLoading={addItemUnitLoading}
        updateItemUnitLoading={updateItemUnitLoading}
        form={form}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={editData}
      />
      <ItemUnitTable
        loading={loading}
        handleEditData={handleEditData}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        setTempDeleteId={setTempDeleteId}
        handleShowDeleteDialog={handleShowDeleteDialog}
        handleDeleteItemUnit={handleDeleteItemUnit}
        deleteItemUnitLoading={deleteItemUnitLoading}
        deleteWarning={deleteWarning}
      />
    </PageShell>
  );
};
export default ItemUnit;
