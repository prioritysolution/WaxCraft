"use client";

import OrderBooking from "@/components/inventoryVoucher/orderBooking";
import { useOrderBooking } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";

const OrderBookingContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getOrderBookingApiCall,
    getOrderPartyApiCall,
    getOrderDesignApiCall,
    getDesignDetailsApiCall,
    addOrderBookingLoading,
    deleteOrderBookingLoading,
    loading,
    form,
    handleSubmit,
    selected,
    setSelected,
    addPartyLoading,
    isOpen,
    setIsOpen,
    partyForm,
    handlePartySubmit,
    handleShowPartyForm,
    designId,
    showDesignDialog,
    setShowDesignDialog,
    handleAddDesign,
    orderTableData,
    handleDeleteOrderTableData,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeleteOrder,
    currentOrderPartyPage,
    setCurrentOrderPartyPage,
    lastOrderPartyPage,
    currentOrderDesignPage,
    setCurrentOrderDesignPage,
    lastOrderDesignPage,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    orderPartyInput,
    setOrderPartyInput,
    orderDesignInput,
    setOrderDesignInput,
    getPartyLedgerLoading,
    getOrderPartyLoading,
    getOrderDesignLoading,
  } = useOrderBooking();

  const handleSearchOrderParty = () => {
    setCurrentOrderPartyPage(1);
    if (orgId) getOrderPartyApiCall(orgId, 1, orderPartyInput, "");
  };

  const handleScrollOrderParty = () => {
    setCurrentOrderPartyPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (
      orgId &&
      currentOrderPartyPage > 1 &&
      currentOrderPartyPage <= lastOrderPartyPage
    )
      getOrderPartyApiCall(orgId, currentOrderPartyPage, orderPartyInput, "");
  }, [currentOrderPartyPage, orgId]);

  const handleSearchOrderDesign = () => {
    setCurrentOrderDesignPage(1);
    if (orgId) getOrderDesignApiCall(orgId, 1, orderDesignInput.split("-")[0]);
  };

  const handleScrollOrderDesign = () => {
    setCurrentOrderDesignPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (
      orgId &&
      currentOrderDesignPage > 1 &&
      currentOrderDesignPage <= lastOrderDesignPage
    )
      getOrderDesignApiCall(
        orgId,
        currentOrderDesignPage,
        orderDesignInput.split("-")[0]
      );
  }, [currentOrderDesignPage, orgId]);

  useEffect(() => {
    if (token && orgId && selected === "table") {
      getOrderBookingApiCall(orgId, currentPage, "", perPage);
    }
  }, [token, orgId, selected, currentPage, perPage]);

  useEffect(() => {
    if (token && orgId && designId) {
      getDesignDetailsApiCall(orgId, designId).then(() => {
        setShowDesignDialog(true);
      });
    }
  }, [token, orgId, designId]);

  return (
    <OrderBooking
      addOrderBookingLoading={addOrderBookingLoading}
      deleteOrderBookingLoading={deleteOrderBookingLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      selected={selected}
      setSelected={setSelected}
      addPartyLoading={addPartyLoading}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      partyForm={partyForm}
      handlePartySubmit={handlePartySubmit}
      handleShowPartyForm={handleShowPartyForm}
      showDesignDialog={showDesignDialog}
      setShowDesignDialog={setShowDesignDialog}
      handleAddDesign={handleAddDesign}
      orderTableData={orderTableData}
      handleDeleteOrderTableData={handleDeleteOrderTableData}
      handleShowDeleteDialog={handleShowDeleteDialog}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleDeleteOrder={handleDeleteOrder}
      handleSearchOrderParty={handleSearchOrderParty}
      handleScrollOrderParty={handleScrollOrderParty}
      handleSearchOrderDesign={handleSearchOrderDesign}
      handleScrollOrderDesign={handleScrollOrderDesign}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      perPage={perPage}
      onPerPageChange={handlePerPageChange}
      orderPartyInput={orderPartyInput}
      setOrderPartyInput={setOrderPartyInput}
      orderDesignInput={orderDesignInput}
      setOrderDesignInput={setOrderDesignInput}
      getPartyLedgerLoading={getPartyLedgerLoading}
      getOrderPartyLoading={getOrderPartyLoading}
      getOrderDesignLoading={getOrderDesignLoading}
    />
  );
};
export default OrderBookingContainer;
