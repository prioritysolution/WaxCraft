"use client";

import WorkProcess from "@/components/master/workProcess";
import { useWorkProcess } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";

const WorkProcessContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getWorkProcessApiCall,
    addWorkProcessLoading,
    updateWorkProcessLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteWorkProcess,
    deleteWorkProcessLoading,
    deleteWarning,
    totalCount,
  } = useWorkProcess();

  useEffect(() => {
    if (token && orgId) getWorkProcessApiCall(orgId);
  }, [token, orgId]);

  return (
    <WorkProcess
      addWorkProcessLoading={addWorkProcessLoading}
      updateWorkProcessLoading={updateWorkProcessLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      editData={editData}
      handleEditData={handleEditData}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleShowDeleteDialog={handleShowDeleteDialog}
      handleDeleteWorkProcess={handleDeleteWorkProcess}
      deleteWorkProcessLoading={deleteWorkProcessLoading}
      deleteWarning={deleteWarning}
      totalCount={totalCount}
    />
  );
};
export default WorkProcessContainer;
