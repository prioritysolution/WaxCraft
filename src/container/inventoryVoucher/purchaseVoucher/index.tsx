"use client";

import PurchaseVoucher from "@/components/inventoryVoucher/purchaseVoucher";
import { usePurchaseVoucher } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";
import { useItem } from "@/container/master/item/Hooks";
import { useBankAccount } from "@/container/master/bankAccount/Hooks";

const PurchaseVoucherContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getPurchaseVoucherApiCall,
    getPurchasePartyApiCall,
    addPurchaseVoucherLoading,
    deletePurchaseVoucherLoading,
    loading,
    form,
    handleSubmit,
    selected,
    setSelected,
    handleAddPurchase,
    purchaseTableData,
    handleDeletePurchaseTableData,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeletePurchase,
    purchaseType,
    currentPurchasePartyPage,
    setCurrentPurchasePartyPage,
    lastPurchasePartyPage,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    purchasePartyInput,
    setPurchasePartyInput,
    itemInput,
    setItemInput,
    orderPurchaseType,
    handleOrderPurchaseTypeChange,
    showRequisitionModal,
    setShowRequisitionModal,
    requisitionLoading,
    handleAddRequisitionItems,
  } = usePurchaseVoucher();

  const {
    getItemApiCall,
    currentPage: currentItemPage,
    setCurrentPage: setCurrentItemPage,
    lastPage: lastItemPage,
  } = useItem();
  const { getBankAccountApiCall } = useBankAccount();

  const handleSearchItem = () => {
    setCurrentItemPage(1);
    if (orgId) getItemApiCall(orgId, 1, itemInput, "DROPDOWN");
  };

  const handleScrollItem = () => {
    setCurrentItemPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (orgId && currentItemPage > 1 && currentItemPage <= lastItemPage)
      getItemApiCall(orgId, currentItemPage, itemInput, "DROPDOWN");
  }, [currentItemPage, orgId]);

  const handleSearchPurchaseParty = () => {
    setCurrentPurchasePartyPage(1);
    if (orgId) getPurchasePartyApiCall(orgId, 1, purchasePartyInput);
  };

  const handleScrollPurchaseParty = () => {
    setCurrentPurchasePartyPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (
      orgId &&
      currentPurchasePartyPage > 1 &&
      currentPurchasePartyPage <= lastPurchasePartyPage
    )
      getPurchasePartyApiCall(
        orgId,
        currentPurchasePartyPage,
        purchasePartyInput
      );
  }, [currentPurchasePartyPage, orgId]);

  useEffect(() => {
    if (token && orgId) {
      getBankAccountApiCall(orgId);
    }
  }, [token, orgId]);

  useEffect(() => {
    if (token && orgId && selected === "table") {
      getPurchaseVoucherApiCall(orgId, currentPage, "");
    }
  }, [token, orgId, selected, currentPage, perPage]);

  return (
    <PurchaseVoucher
      addPurchaseVoucherLoading={addPurchaseVoucherLoading}
      deletePurchaseVoucherLoading={deletePurchaseVoucherLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      selected={selected}
      setSelected={setSelected}
      handleAddPurchase={handleAddPurchase}
      purchaseTableData={purchaseTableData}
      handleDeletePurchaseTableData={handleDeletePurchaseTableData}
      handleShowDeleteDialog={handleShowDeleteDialog}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleDeletePurchase={handleDeletePurchase}
      purchaseType={purchaseType}
      handleSearchItem={handleSearchItem}
      handleScrollItem={handleScrollItem}
      handleSearchPurchaseParty={handleSearchPurchaseParty}
      handleScrollPurchaseParty={handleScrollPurchaseParty}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      perPage={perPage}
      onPerPageChange={handlePerPageChange}
      purchasePartyInput={purchasePartyInput}
      setPurchasePartyInput={setPurchasePartyInput}
      itemInput={itemInput}
      setItemInput={setItemInput}
      orderPurchaseType={orderPurchaseType}
      handleOrderPurchaseTypeChange={handleOrderPurchaseTypeChange}
      showRequisitionModal={showRequisitionModal}
      setShowRequisitionModal={setShowRequisitionModal}
      requisitionLoading={requisitionLoading}
      handleAddRequisitionItems={handleAddRequisitionItems}
    />
  );
};
export default PurchaseVoucherContainer;
