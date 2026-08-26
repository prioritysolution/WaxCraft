"use client";

import ItemSize from "@/components/master/itemSize";
import { useItemSize } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";
import { useItemCategory } from "../itemCategory/Hooks";
import { useItemModel } from "../itemModel/Hooks";

const ItemSizeContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getItemSizeApiCall,
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
    currentPage,
    setCurrentPage,
    lastPage,
    categoryInput,
    setCategoryInput,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteItemSize,
    deleteItemSizeLoading,
    deleteWarning,
    totalCount,
  } = useItemSize();

  const {
    getItemCategoryApiCall,
    currentPage: currentCategoryPage,
    setCurrentPage: setCurrentCategoryPage,
    lastPage: lastCategoryPage,
    loading: getItemCategoryLoading,
  } = useItemCategory();

  const handleSearchCategory = () => {
    setCurrentPage(1);
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

  const { getItemModelUnderCategoryApiCall, loading: getItemModelLoading } =
    useItemModel();

  useEffect(() => {
    if (token && orgId) {
      getItemSizeApiCall(orgId, currentPage);
    }
  }, [token, orgId, currentPage]);

  useEffect(() => {
    if (token && orgId && categoryId) {
      getItemModelUnderCategoryApiCall(orgId, categoryId);
    }

    const isEditHydrate =
      !!editData &&
      Object.keys(editData).length > 0 &&
      String(editData.Cat_Id) === String(categoryId);

    if (!isEditHydrate) {
      form.setValue("modelId", "");
    }
  }, [token, orgId, categoryId]);

  return (
    <ItemSize
      addItemSizeLoading={addItemSizeLoading}
      updateItemSizeLoading={updateItemSizeLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      editData={editData}
      handleEditData={handleEditData}
      categoryId={categoryId}
      handleSearchCategory={handleSearchCategory}
      handleScrollCategory={handleScrollCategory}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      categoryInput={categoryInput}
      setCategoryInput={setCategoryInput}
      getItemCategoryLoading={getItemCategoryLoading}
      getItemModelLoading={getItemModelLoading}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleShowDeleteDialog={handleShowDeleteDialog}
      handleDeleteItemSize={handleDeleteItemSize}
      deleteItemSizeLoading={deleteItemSizeLoading}
      deleteWarning={deleteWarning}
      totalCount={totalCount}
    />
  );
};
export default ItemSizeContainer;
