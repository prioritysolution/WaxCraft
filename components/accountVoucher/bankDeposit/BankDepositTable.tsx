"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { ArrowUpFromLine } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

import {
  BankDepositTableData,
  BankDepositTableProps,
} from "@/types/accountVoucher/BankDepositTypes";
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
import { format } from "date-fns";
import { FC } from "react";
import { TableDeleteButton } from "@/components/ui/table-edit-button";
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
}) => {
  const depositData: BankDepositTableData[] = useSelector(
    (state: RootState) => state?.bankDeposit?.depositData
  );

  const { search, setSearch, filtered } = useClientTableSearch(depositData);

  return (
    <div className="w-full">
      <Table
        removeWrapper
        aria-label="Example static collection table"
        bottomContent={
          filtered.length > 0 && (
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
            title="Active deposits"
            description="Search, review, and manage existing deposits."
            value={search}
            onValueChange={setSearch}
            placeholder="Search deposit"
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
          {filtered.map((data, index) => (
            <TableRow key={data.Id}>
              <TableCell className="w-[100px]">{index + 1}</TableCell>
              <TableCell>
                {data?.Trans_Date ? format(data?.Trans_Date, "dd-MM-yyyy") : ""}
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
          ))}
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
