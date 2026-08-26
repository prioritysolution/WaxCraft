"use client";

import Item from "@/components/master/item";
import { useItem } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useItemCategory } from "../itemCategory/Hooks";
import { useItemModel } from "../itemModel/Hooks";
import { useItemSize } from "../itemSize/Hooks";
import { useItemUnit } from "../itemUnit/Hooks";
import { useItemColour } from "../itemColour/Hooks";

const ItemContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getItemApiCall,
    getPurchaseLedgerApiCall,
    getSalesLedgerApiCall,
    addItemLoading,
    updateItemLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    categoryId,
    modelId,
    sizeId,
    colourId,
    itemTableInput,
    handleFilterTableData,
    currentPage,
    setCurrentPage,
    lastPage,
    currentPurchaseLedgerPage,
    setCurrentPurchaseLedgerPage,
    lastPurchaseLedgerPage,
    currentSalesLedgerPage,
    setCurrentSalesLedgerPage,
    lastSalesLedgerPage,
    purchaseLedgerInput,
    setPurchaseLedgerInput,
    salesLedgerInput,
    setSalesLedgerInput,
    categoryInput,
    setCategoryInput,
    getPurchaseLedgerLoading,
    getSalesLedgerLoading,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteItem,
    deleteItemLoading,
    deleteWarning,
    totalCount,
  } = useItem();

  const {
    getItemCategoryApiCall,
    currentPage: currentCategoryPage,
    setCurrentPage: setCurrentCategoryPage,
    lastPage: lastCategoryPage,
    loading: getCategoryLoading,
  } = useItemCategory();

  const { getItemModelUnderCategoryApiCall, loading: getModelLoading } =
    useItemModel();

  const { getItemSizeUnderModelApiCall, loading: getSizeLoading } =
    useItemSize();

  const { getItemUnitApiCall, loading: getUnitLoading } = useItemUnit();

  const { getItemColourApiCall, loading: getColourLoading } = useItemColour();

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

  const handleSearchPurchaseLedger = () => {
    setCurrentPurchaseLedgerPage(1);
    if (orgId) getPurchaseLedgerApiCall(orgId, 1, purchaseLedgerInput);
  };

  const handleScrollPurchaseLedger = () => {
    setCurrentPurchaseLedgerPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (
      orgId &&
      currentPurchaseLedgerPage > 1 &&
      currentPurchaseLedgerPage <= lastPurchaseLedgerPage
    )
      getPurchaseLedgerApiCall(
        orgId,
        currentPurchaseLedgerPage,
        purchaseLedgerInput
      );
  }, [currentPurchaseLedgerPage, orgId]);

  const handleSearchSalesLedger = () => {
    setCurrentSalesLedgerPage(1);
    if (orgId) getSalesLedgerApiCall(orgId, 1, salesLedgerInput);
  };

  const handleScrollSalesLedger = () => {
    setCurrentSalesLedgerPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (
      orgId &&
      currentSalesLedgerPage > 1 &&
      currentSalesLedgerPage <= lastSalesLedgerPage
    )
      getSalesLedgerApiCall(orgId, currentSalesLedgerPage, salesLedgerInput);
  }, [currentSalesLedgerPage, orgId]);

  useEffect(() => {
    if (token && orgId) {
      getItemUnitApiCall(orgId);
    }
  }, [token, orgId]);

  useEffect(() => {
    if (token && orgId)
      getItemApiCall(orgId, currentPage, itemTableInput, "TABLE");
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

  useEffect(() => {
    if (token && orgId && modelId) {
      getItemSizeUnderModelApiCall(orgId, modelId);
    }

    const isEditHydrate =
      !!editData &&
      Object.keys(editData).length > 0 &&
      String(editData.Model_Id) === String(modelId);

    if (!isEditHydrate) {
      form.setValue("sizeId", "");
    }
  }, [token, orgId, modelId]);

  useEffect(() => {
    if (token && orgId && isOpen) {
      getItemColourApiCall(orgId, 1, "", 500);
    }
  }, [token, orgId, isOpen]);

  return (
    <Item
      addItemLoading={addItemLoading}
      updateItemLoading={updateItemLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      editData={editData}
      handleEditData={handleEditData}
      categoryId={categoryId}
      modelId={modelId}
      sizeId={sizeId}
      colourId={colourId}
      itemTableInput={itemTableInput}
      handleFilterTableData={handleFilterTableData}
      handleSearchCategory={handleSearchCategory}
      handleScrollCategory={handleScrollCategory}
      handleSearchPurchaseLedger={handleSearchPurchaseLedger}
      handleScrollPurchaseLedger={handleScrollPurchaseLedger}
      handleSearchSalesLedger={handleSearchSalesLedger}
      handleScrollSalesLedger={handleScrollSalesLedger}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      categoryInput={categoryInput}
      setCategoryInput={setCategoryInput}
      purchaseLedgerInput={purchaseLedgerInput}
      setPurchaseLedgerInput={setPurchaseLedgerInput}
      salesLedgerInput={salesLedgerInput}
      setSalesLedgerInput={setSalesLedgerInput}
      getPurchaseLedgerLoading={getPurchaseLedgerLoading}
      getSalesLedgerLoading={getSalesLedgerLoading}
      getCategoryLoading={getCategoryLoading}
      getModelLoading={getModelLoading}
      getSizeLoading={getSizeLoading}
      getColourLoading={getColourLoading}
      getUnitLoading={getUnitLoading}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleShowDeleteDialog={handleShowDeleteDialog}
      handleDeleteItem={handleDeleteItem}
      deleteItemLoading={deleteItemLoading}
      deleteWarning={deleteWarning}
      totalCount={totalCount}
    />
  );
};
export default ItemContainer;
