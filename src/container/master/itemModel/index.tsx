"use client";

import ItemModel from "@/components/master/itemModel";
import { useItemModel } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";
import { useItemCategory } from "../itemCategory/Hooks";

const ItemModelContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getItemModelApiCall,
    addItemModelLoading,
    updateItemModelLoading,
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
  } = useItemModel();

  const {
    getItemCategoryApiCall,
    currentPage: currentCategoryPage,
    setCurrentPage: setCurrentCategoryPage,
    lastPage: lastCategoryPage,
    loading: getCategoryLoading,
  } = useItemCategory();

  const handleSearchCategory = () => {
    setCurrentCategoryPage(1);
    if (orgId) getItemCategoryApiCall(orgId, 1, categoryInput, "DROPDOWN");
  };

  const handleScrollCategory = () => {
    setCurrentCategoryPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (
      orgId &&
      currentCategoryPage > 1 &&
      currentCategoryPage <= lastCategoryPage
    )
      getItemCategoryApiCall(
        orgId,
        currentCategoryPage,
        categoryInput,
        "DROPDOWN"
      );
  }, [currentCategoryPage, orgId]);

  useEffect(() => {
    if (token && orgId) {
      getItemModelApiCall(orgId, currentPage);
    }
  }, [token, orgId, currentPage, perPage]);

  return (
    <ItemModel
      addItemModelLoading={addItemModelLoading}
      updateItemModelLoading={updateItemModelLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      editData={editData}
      handleEditData={handleEditData}
      handleSearchCategory={handleSearchCategory}
      handleScrollCategory={handleScrollCategory}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      perPage={perPage}
      onPerPageChange={handlePerPageChange}
      categoryInput={categoryInput}
      setCategoryInput={setCategoryInput}
      getCategoryLoading={getCategoryLoading}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleShowDeleteDialog={handleShowDeleteDialog}
      handleDeleteItemModel={handleDeleteItemModel}
      deleteItemModelLoading={deleteItemModelLoading}
      deleteWarning={deleteWarning}
      totalCount={totalCount}
    />
  );
};
export default ItemModelContainer;
