"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import {
  TableDeleteButton,
  TableEditButton,
  TableNameCell,
  formatTableSerial,
  getPaginatedTableRows,
} from "@/components/ui/table-edit-button";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { TablePaginationBar } from "@/components/ui/table-pagination";
import { BookOpen } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import {
  AccountLedgerTableData,
  AccountLedgerTableProps,
} from "@/types/master/AccountLedgerTypes";
import { formatTwoDecimals } from "@/utils/formatDecimal";
import {
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

interface AccountLedgerState {
  accountLedgerData: AccountLedgerTableData[];
}

interface RootState {
  accountLedger: AccountLedgerState;
}

const AccountLedgerTable: FC<AccountLedgerTableProps> = ({
  handleEditData,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  ledgerTableInput,
  handleFilterTableData,
  loading,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteAccountLedger,
  deleteAccountLedgerLoading,
  deleteWarning,
}) => {
  const accountLedgerData: AccountLedgerTableData[] = useSelector(
    (state: RootState) => state?.accountLedger?.accountLedgerData
  );

  return (
    <>
      <Table
        removeWrapper
        aria-label="Example static collection table"
        bottomContent={
          <TablePaginationBar
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={setCurrentPage}
            perPage={perPage}
            onPerPageChange={onPerPageChange}
          />
        }
        topContent={
          <TableSearchInput
            title="All account ledgers"
            description="Search, review, and update existing ledgers."
            value={ledgerTableInput}
            onValueChange={handleFilterTableData}
            placeholder="Search by ledger name"
            />
        }
        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn align="center">Serial No.</TableColumn>
          <TableColumn align="center">Ledger Name</TableColumn>
          <TableColumn align="center">Opening Balance</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={BookOpen}
              entity="ledgers"
              search={ledgerTableInput}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {getPaginatedTableRows(accountLedgerData, loading).map((data, index) => (
            <TableRow key={data.Id}>
              <TableCell>{formatTableSerial(index, { currentPage, perPage })}</TableCell>
              <TableCell><TableNameCell name={data.Ledger_Name} /></TableCell>
              <TableCell>
                {formatTwoDecimals(data.Open_Balance, "0.00")}
              </TableCell>
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
        message="Are you sure to delete this account ledger?"
        warning={deleteWarning}
        isBusy={deleteAccountLedgerLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteAccountLedger}
      />
    </>
  );
};
export default AccountLedgerTable;
