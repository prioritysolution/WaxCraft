"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableDateFilter } from "@/components/ui/table-date-filter";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import {
  getPaginatedTableRows,
  getTableSerialIndex,
  TableDeleteButton,
} from "@/components/ui/table-edit-button";
import { useClientVoucherTableFilter } from "@/lib/useClientTableSearch";
import { parseVoucherDate } from "@/lib/voucherTableDate";
import { ArrowUpFromLine } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { TablePaginationBar } from "@/components/ui/table-pagination";

import {
  BankDepositTableData,
  BankDepositTableProps,
} from "@/types/accountVoucher/BankDepositTypes";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { format } from "date-fns";
import { FC } from "react";
import { useSelector } from "react-redux";

interface BankDepositState {
  depositData: BankDepositTableData[];
}

interface RootState {
  bankDeposit: BankDepositState;
}

const BankDepositTable: FC<BankDepositTableProps> = ({
  loading,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteBankDeposit,
  deleteBankDepositLoading,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}) => {
  const depositData: BankDepositTableData[] = useSelector(
    (state: RootState) => state?.bankDeposit?.depositData
  );

  const { search, setSearch, filtered } = useClientVoucherTableFilter(
    depositData as unknown as Record<string, unknown>[],
    { fromDate, toDate },
  );

  return (
    <div className="w-full">
      <Table
        removeWrapper
        aria-label="Active deposits table"
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
            title="Active deposits"
            description="Search, review, and manage existing deposits."
            value={search}
            onValueChange={setSearch}
            placeholder="Search deposit"
            filters={
              <TableDateFilter
                fromDate={fromDate}
                toDate={toDate}
                onFromDateChange={(value) => {
                  setFromDate(value);
                  setCurrentPage(1);
                }}
                onToDateChange={(value) => {
                  setToDate(value);
                  setCurrentPage(1);
                }}
              />
            }
          />
        }
        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn className="w-[100px]">Serial No.</TableColumn>
          <TableColumn align="center">Deposit Date</TableColumn>
          <TableColumn align="center">Vouch No.</TableColumn>
          <TableColumn align="center">Ref. Vouch No.</TableColumn>
          <TableColumn align="center">Particular</TableColumn>
          <TableColumn align="center">Amount</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={ArrowUpFromLine}
              entity="deposits"
              search={search}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {getPaginatedTableRows(
            filtered as unknown as BankDepositTableData[],
            loading,
          ).map((data, index) => {
            const date = parseVoucherDate(data?.Trans_Date);
            return (
              <TableRow key={data.Id}>
                <TableCell className="w-[100px]">
                  {getTableSerialIndex(index, currentPage, perPage) + 1}
                </TableCell>
                <TableCell>
                  {date ? format(date, "dd-MM-yyyy") : ""}
                </TableCell>
                <TableCell>{data?.Vouch_No}</TableCell>
                <TableCell>{data?.Ref_Vouch_No}</TableCell>
                <TableCell>{data?.Particular}</TableCell>
                <TableCell>{data?.Amount}</TableCell>
                <TableCell align="center" className=" flex justify-center">
                  <TableDeleteButton
                    onPress={() => handleShowDeleteDialog(data?.Id)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <DeleteConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        message="Are you sure to delete this deposit ?"
        isBusy={deleteBankDepositLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteBankDeposit}
      />
    </div>
  );
};
export default BankDepositTable;
