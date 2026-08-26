"use client";

import SizeColour from "@/components/master/sizeColour";
import { useSizeColour } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";
import { useItemCategory } from "../itemCategory/Hooks";
import { useItemModel } from "../itemModel/Hooks";
import { useItemSize } from "../itemSize/Hooks";

const SizeColourContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getSizeColourApiCall,
    getItemColourListApiCall,
    addSizeColourLoading,
    updateSizeColourLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    categoryId,
    modelId,
    categoryInput,
    setCategoryInput,
    colourOptions,
    getColourLoading,
    currentPage,
    setCurrentPage,
    lastPage,
    sizeColourTableInput,
    handleFilterTableData,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteSizeColour,
    deleteSizeColourLoading,
    deleteWarning,
    totalCount,
  } = useSizeColour();

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

  const { getItemModelUnderCategoryApiCall, loading: getModelLoading } =
    useItemModel();

  const { getItemSizeUnderModelApiCall, loading: getSizeLoading } =
    useItemSize();

  useEffect(() => {
    if (token && orgId)
      getSizeColourApiCall(orgId, currentPage, sizeColourTableInput);
  }, [token, orgId, currentPage]);

  useEffect(() => {
    if (token && orgId) {
      getItemColourListApiCall(orgId);
    }
  }, [token, orgId]);

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

  useEffect(() => {
    if (token && orgId && modelId) {
      getItemSizeUnderModelApiCall(orgId, modelId);
    }

    const isEditHydrate =
      !!editData &&
      Object.keys(editData).length > 0 &&
      String(editData.Mod_Id) === String(modelId);

    if (!isEditHydrate) {
      form.setValue("sizeId", "");
    }
  }, [token, orgId, modelId]);

  return (
    <SizeColour
      addSizeColourLoading={addSizeColourLoading}
      updateSizeColourLoading={updateSizeColourLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      editData={editData}
      handleEditData={handleEditData}
      categoryId={categoryId}
      modelId={modelId}
      handleSearchCategory={handleSearchCategory}
      handleScrollCategory={handleScrollCategory}
      getCategoryLoading={getCategoryLoading}
      getModelLoading={getModelLoading}
      getSizeLoading={getSizeLoading}
      categoryInput={categoryInput}
      setCategoryInput={setCategoryInput}
      colourOptions={colourOptions}
      getColourLoading={getColourLoading}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      sizeColourTableInput={sizeColourTableInput}
      handleFilterTableData={handleFilterTableData}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleShowDeleteDialog={handleShowDeleteDialog}
      handleDeleteSizeColour={handleDeleteSizeColour}
      deleteSizeColourLoading={deleteSizeColourLoading}
      deleteWarning={deleteWarning}
      totalCount={totalCount}
    />
  );
};
export default SizeColourContainer;
