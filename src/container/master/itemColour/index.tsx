"use client";

import ItemColour from "@/components/master/itemColour";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useItemColour } from "./Hooks";

const ItemColourContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getItemColourApiCall,
    addItemColourLoading,
    updateItemColourLoading,
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
    colourTableInput,
    handleFilterTableData,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteItemColour,
    deleteItemColourLoading,
    deleteWarning,
    totalCount,
  } = useItemColour();

  useEffect(() => {
    if (token && orgId)
      getItemColourApiCall(orgId, currentPage, colourTableInput);
  }, [token, orgId, currentPage, perPage]);

  return (
    <ItemColour
      addItemColourLoading={addItemColourLoading}
      updateItemColourLoading={updateItemColourLoading}
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
      colourTableInput={colourTableInput}
      handleFilterTableData={handleFilterTableData}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleShowDeleteDialog={handleShowDeleteDialog}
      handleDeleteItemColour={handleDeleteItemColour}
      deleteItemColourLoading={deleteItemColourLoading}
      deleteWarning={deleteWarning}
      totalCount={totalCount}
    />
  );
};

export default ItemColourContainer;
