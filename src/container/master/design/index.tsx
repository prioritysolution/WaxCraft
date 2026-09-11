"use client";

import Design from "@/components/master/design";
import { useDesign } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useItemCategory } from "../itemCategory/Hooks";
import { useItem } from "../item/Hooks";

const DesignContainer = () => {
  const token = getCookieData<any>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getDesignApiCall,
    addDesignLoading,
    updateDesignLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    handleDeleteFormTableData,
    designFormTableData,
    categoryId,
    handleAddDesign,
    photoPreview,
    handlePhotoChange,
    currentPage,
    setCurrentPage,
    lastPage,
    designTableInput,
    handleFilterTableData,
    categoryInput,
    setCategoryInput,
    itemInput,
    setItemInput,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteDesign,
    deleteDesignLoading,
    deleteWarning,
    totalCount,
    perPage,
    handlePerPageChange,
  } = useDesign();

  const {
    getItemCategoryApiCall,
    currentPage: currentCategoryPage,
    setCurrentPage: setCurrentCategoryPage,
    lastPage: lastCategoryPage,
    loading: getCategoryLoading,
  } = useItemCategory();

  const { getItemUnderCategoryApiCall, loading: getItemLoading } = useItem();

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
      getDesignApiCall(orgId, currentPage, designTableInput);
    }
  }, [token, orgId, currentPage, perPage]);

  useEffect(() => {
    if (token && orgId && categoryId) {
      getItemUnderCategoryApiCall(orgId, categoryId);
    }
    form.setValue("itemId", "");
    setItemInput("");
  }, [token, orgId, categoryId]);

  return (
    <Design
      addDesignLoading={addDesignLoading}
      updateDesignLoading={updateDesignLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      editData={editData}
      handleEditData={handleEditData}
      handleDeleteFormTableData={handleDeleteFormTableData}
      designFormTableData={designFormTableData}
      handleAddDesign={handleAddDesign}
      photoPreview={photoPreview}
      handlePhotoChange={handlePhotoChange}
      handleSearchCategory={handleSearchCategory}
      handleScrollCategory={handleScrollCategory}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      designTableInput={designTableInput}
      handleFilterTableData={handleFilterTableData}
      categoryInput={categoryInput}
      setCategoryInput={setCategoryInput}
      itemInput={itemInput}
      setItemInput={setItemInput}
      getCategoryLoading={getCategoryLoading}
      getItemLoading={getItemLoading}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleShowDeleteDialog={handleShowDeleteDialog}
      handleDeleteDesign={handleDeleteDesign}
      deleteDesignLoading={deleteDesignLoading}
      deleteWarning={deleteWarning}
      totalCount={totalCount}
      perPage={perPage}
      onPerPageChange={handlePerPageChange}
    />
  );
};
export default DesignContainer;
