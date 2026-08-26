"use client";

import ItemUnit from "@/components/master/itemUnit";
import { useItemUnit } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";

const ItemUnitContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getItemUnitApiCall,
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
  } = useItemUnit();

  useEffect(() => {
    if (token && orgId) getItemUnitApiCall(orgId);
  }, [token, orgId]);

  return (
    <ItemUnit
      addItemUnitLoading={addItemUnitLoading}
      updateItemUnitLoading={updateItemUnitLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      editData={editData}
      handleEditData={handleEditData}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleShowDeleteDialog={handleShowDeleteDialog}
      handleDeleteItemUnit={handleDeleteItemUnit}
      deleteItemUnitLoading={deleteItemUnitLoading}
      deleteWarning={deleteWarning}
      totalCount={totalCount}
    />
  );
};
export default ItemUnitContainer;
