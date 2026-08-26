"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import {
  TableDeleteButton,
  TableEditButton,
  TableNameCell,
  formatTableSerial,
} from "@/components/ui/table-edit-button";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { UserRound } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import {
  EmployeeTableData,
  EmployeeTableProps,
} from "@/types/master/EmployeeTypes";
import {
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { FC } from "react";
import { useSelector } from "react-redux";

interface EmployeeState {
  employeeData: EmployeeTableData[];
}

interface RootState {
  employee: EmployeeState;
}

const EmployeeTable: FC<EmployeeTableProps> = ({
  handleEditData,
  currentPage,
  setCurrentPage,
  lastPage,
  employeeTableInput,
  handleFilterTableData,
  loading,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteEmployee,
  deleteEmployeeLoading,
  deleteWarning,
}) => {
  const employeeData: EmployeeTableData[] = useSelector(
    (state: RootState) => state?.employee?.employeeData
  );

  return (
    <>
      <Table
        removeWrapper
        aria-label="Example static collection table"
        bottomContent={
          employeeData?.length > 0 && (
            <div className="flex w-full justify-end">
              <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={currentPage}
              total={lastPage}
              onChange={(page) => setCurrentPage(page)}
              />
            </div>
          )
        }
        topContent={
          <TableSearchInput
            title="All employees"
            description="Search, review, and update existing employees."
            value={employeeTableInput}
            onValueChange={handleFilterTableData}
            placeholder="Search by ledger name"
            />
        }
        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn align="center">Serial No.</TableColumn>
          <TableColumn align="center">Employee Name</TableColumn>
          <TableColumn align="center">Employee Type</TableColumn>
          <TableColumn align="center">Address</TableColumn>
          <TableColumn align="center">Phone No.</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={UserRound}
              entity="employees"
              search={employeeTableInput}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {employeeData?.map((data, index) => (
            <TableRow key={data.Id}>
              <TableCell>{formatTableSerial(index)}</TableCell>
              <TableCell><TableNameCell name={data.Emp_Name} /></TableCell>
              <TableCell>{data.Employee_type}</TableCell>
              <TableCell>{data.Emp_Address}</TableCell>
              <TableCell>{data.Emp_Mobile}</TableCell>
              <TableCell className="text-center">
                <div className="inline-flex items-center gap-2">
                  <TableEditButton onPress={() => handleEditData(data)} />
                  <TableDeleteButton
                    onPress={() => handleShowDeleteDialog(data.Id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        message="Are you sure to delete this employee?"
        warning={deleteWarning}
        isBusy={deleteEmployeeLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteEmployee}
      />
    </>
  );
};
export default EmployeeTable;
