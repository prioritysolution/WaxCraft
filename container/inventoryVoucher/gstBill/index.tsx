"use client";

import GstBill from "@/components/inventoryVoucher/gstBill";
import { useGstBill } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useOrderBooking } from "../orderBooking/Hooks";
import { useItemUnit } from "@/container/master/itemUnit/Hooks";

const GstBillContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getGstBillApiCall,
    addGstBillLoading,
    deleteGstBillLoading,
    loading,
    form,
    handleSubmit,
    selected,
    setSelected,
    itemTableData,
    handleDeleteItemTableData,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeleteGst,
    currentPage,
    setCurrentPage,
    lastPage,
    itemGrandTotal,
    itemGst,
    itemRoundOff,
    handleAddGstBill,
    showInvoice,
    setShowInvoice,
    invoiceData,
    setInvoiceData,
    orderPartyInput,
    setOrderPartyInput,
  } = useGstBill();

  const {
    getOrderPartyApiCall,
    currentOrderPartyPage,
    setCurrentOrderPartyPage,
    lastOrderPartyPage,
    loading: getOrderPartyLoading,
  } = useOrderBooking();

  const { getItemUnitApiCall, loading: getUnitLoading } = useItemUnit();

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

  useEffect(() => {
    if (token && orgId && selected === "table") {
      getGstBillApiCall(orgId, currentPage, "");
    }
  }, [token, orgId, selected, currentPage]);

  useEffect(() => {
    if (token && orgId) getItemUnitApiCall(orgId);
  }, [token, orgId]);

  return (
    <GstBill
      addGstBillLoading={addGstBillLoading}
      deleteGstBillLoading={deleteGstBillLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      selected={selected}
      setSelected={setSelected}
      itemTableData={itemTableData}
      handleDeleteItemTableData={handleDeleteItemTableData}
      handleShowDeleteDialog={handleShowDeleteDialog}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleDeleteGst={handleDeleteGst}
      handleSearchOrderParty={handleSearchOrderParty}
      handleScrollOrderParty={handleScrollOrderParty}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      orderPartyInput={orderPartyInput}
      setOrderPartyInput={setOrderPartyInput}
      itemGrandTotal={itemGrandTotal}
      itemGst={itemGst}
      itemRoundOff={itemRoundOff}
      handleAddGstBill={handleAddGstBill}
      showInvoice={showInvoice}
      setShowInvoice={setShowInvoice}
      invoiceData={invoiceData}
      setInvoiceData={setInvoiceData}
      getOrderPartyLoading={getOrderPartyLoading}
      getUnitLoading={getUnitLoading}
    />
  );
};
export default GstBillContainer;
