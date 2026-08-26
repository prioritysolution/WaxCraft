"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { ArrowLeftRight } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

import {
  BankTransferTableData,
  BankTransferTableProps,
} from "@/types/accountVoucher/BankTransferTypes";
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

interface BankTransferState {
  transferData: BankTransferTableData[];
}

interface RootState {
  bankTransfer: BankTransferState;
}

const BankTransferTable: FC<BankTransferTableProps> = ({
  loading,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteBankTransfer,
  deleteBankTransferLoading,
  currentPage,
  setCurrentPage,
  lastPage,
}) => {
  const transferData: BankTransferTableData[] = useSelector(
    (state: RootState) => state?.bankTransfer?.transferData
  );

  const { search, setSearch, filtered } = useClientTableSearch(transferData);

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
            title="Active transfers"
            description="Search, review, and manage existing transfers."
            value={search}
            onValueChange={setSearch}
            placeholder="Search transfer"
            />
        }

        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn className="w-[100px]">Serial No.</TableColumn>
          <TableColumn align="center">Transfer Date</TableColumn>
          <TableColumn align="center">Vouch No.</TableColumn>
          <TableColumn align="center">Ref. Vouch No.</TableColumn>
          <TableColumn align="center">Particular</TableColumn>
          <TableColumn align="center">Amount</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={ArrowLeftRight}
              entity="transfers"
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
        message="Are you sure to delete this transfer ?"
        isBusy={deleteBankTransferLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteBankTransfer}
      />
    </div>
  );
};
export default BankTransferTable;
