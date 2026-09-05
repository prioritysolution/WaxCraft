"use client";

import ItemCategory from "@/components/master/itemCategory";
import { useItemCategory } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";

const ItemCategoryContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getItemCategoryApiCall,
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
    perPage,
    handlePerPageChange,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteItemCategory,
    deleteItemCategoryLoading,
    deleteWarning,
    totalCount,
  } = useItemCategory();

  useEffect(() => {
    if (token && orgId) getItemCategoryApiCall(orgId, currentPage, "", "TABLE");
  }, [token, orgId, currentPage, perPage]);

  return (
    <ItemCategory
      addItemCategoryLoading={addItemCategoryLoading}
      updateItemCategoryLoading={updateItemCategoryLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      editData={editData}
      handleEditData={handleEditData}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      perPage={perPage}
      onPerPageChange={handlePerPageChange}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleShowDeleteDialog={handleShowDeleteDialog}
      handleDeleteItemCategory={handleDeleteItemCategory}
      deleteItemCategoryLoading={deleteItemCategoryLoading}
      deleteWarning={deleteWarning}
      totalCount={totalCount}
    />
  );
};
export default ItemCategoryContainer;
