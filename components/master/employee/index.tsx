"use client";

import {
  PageActionButton,
  PageCountBadge,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { UserRound } from "lucide-react";
import { FC } from "react";
import EmployeeTable from "./EmployeeTable";
import { EmployeeProps } from "@/types/master/EmployeeTypes";
import EmployeeForm from "./EmployeeForm";

const Employee: FC<EmployeeProps> = ({
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
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={UserRound}
        title="Employee"
        description="Keep employee records used in work process and production."
        badge={<PageCountBadge count={totalCount} singular="employee" plural="employees" />}
        action={
          <PageActionButton onPress={() => setIsOpen(true)}>
            Add Employee
          </PageActionButton>
        }
      />

      <EmployeeForm
        addEmployeeLoading={addEmployeeLoading}
        updateEmployeeLoading={updateEmployeeLoading}
        form={form}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={editData}
      />
      <EmployeeTable
          handleEditData={handleEditData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          lastPage={lastPage}
          employeeTableInput={employeeTableInput}
          handleFilterTableData={handleFilterTableData}
          loading={loading}
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
          setTempDeleteId={setTempDeleteId}
          handleShowDeleteDialog={handleShowDeleteDialog}
          handleDeleteEmployee={handleDeleteEmployee}
          deleteEmployeeLoading={deleteEmployeeLoading}
          deleteWarning={deleteWarning}
        />
    </PageShell>
  );
};
export default Employee;
