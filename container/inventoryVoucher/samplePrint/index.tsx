"use client";

import SamplePrint from "@/components/inventoryVoucher/samplePrint";
import { useSamplePrint } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useOrderBooking } from "../orderBooking/Hooks";

const SamplePrintContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getDesignDetailsApiCall,
    getSamplePrintApiCall,
    loading,
    addSamplePrintLoading,
    deleteSamplePrintLoading,
    form,
    handleSubmit,
    selected,
    setSelected,
    designId,
    showDesignDialog,
    setShowDesignDialog,
    handleAddDesign,
    showPrintDialog,
    setShowPrintDialog,
    printData,
    orderPartyInput,
    setOrderPartyInput,
    orderDesignInput,
    setOrderDesignInput,
    handleShowPrintFromHistory,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeleteSamplePrint,
    currentPage,
    setCurrentPage,
    lastPage,
  } = useSamplePrint();

  const {
    getOrderPartyApiCall,
    getOrderDesignApiCall,
    currentOrderPartyPage,
    setCurrentOrderPartyPage,
    lastOrderPartyPage,
    currentOrderDesignPage,
    setCurrentOrderDesignPage,
    lastOrderDesignPage,
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
    if (token && orgId && designId) {
      getDesignDetailsApiCall(orgId, designId).then(() => {
        setShowDesignDialog(true);
      });
    }
  }, [token, orgId, designId]);

  useEffect(() => {
    if (token && orgId && selected === "table") {
      getSamplePrintApiCall(orgId, currentPage, "");
    }
  }, [token, orgId, selected, currentPage]);

  return (
    <SamplePrint
      loading={loading}
      addSamplePrintLoading={addSamplePrintLoading}
      deleteSamplePrintLoading={deleteSamplePrintLoading}
      form={form}
      handleSubmit={handleSubmit}
      selected={selected}
      setSelected={setSelected}
      showDesignDialog={showDesignDialog}
      setShowDesignDialog={setShowDesignDialog}
      handleAddDesign={handleAddDesign}
      showPrintDialog={showPrintDialog}
      setShowPrintDialog={setShowPrintDialog}
      printData={printData}
      handleSearchOrderParty={handleSearchOrderParty}
      handleScrollOrderParty={handleScrollOrderParty}
      handleSearchOrderDesign={handleSearchOrderDesign}
      handleScrollOrderDesign={handleScrollOrderDesign}
      orderPartyInput={orderPartyInput}
      setOrderPartyInput={setOrderPartyInput}
      orderDesignInput={orderDesignInput}
      setOrderDesignInput={setOrderDesignInput}
      handleShowPrintFromHistory={handleShowPrintFromHistory}
      handleShowDeleteDialog={handleShowDeleteDialog}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleDeleteSamplePrint={handleDeleteSamplePrint}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
    />
  );
};
export default SamplePrintContainer;
