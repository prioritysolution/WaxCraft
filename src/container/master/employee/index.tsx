"use client";

import Employee from "@/components/master/employee";
import { useEmployee } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";

const EmployeeContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getEmployeeApiCall,
    addEmployeeLoading,
    updateEmployeeLoading,
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
    employeeTableInput,
    handleFilterTableData,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteEmployee,
    deleteEmployeeLoading,
    deleteWarning,
    totalCount,
  } = useEmployee();

  useEffect(() => {
    if (token && orgId) {
      getEmployeeApiCall(orgId, currentPage, employeeTableInput, "TABLE");
    }
  }, [token, orgId, currentPage, perPage]);

  return (
    <Employee
      addEmployeeLoading={addEmployeeLoading}
      updateEmployeeLoading={updateEmployeeLoading}
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
      employeeTableInput={employeeTableInput}
      handleFilterTableData={handleFilterTableData}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      setTempDeleteId={setTempDeleteId}
      handleShowDeleteDialog={handleShowDeleteDialog}
      handleDeleteEmployee={handleDeleteEmployee}
      deleteEmployeeLoading={deleteEmployeeLoading}
      deleteWarning={deleteWarning}
      totalCount={totalCount}
    />
  );
};
export default EmployeeContainer;
