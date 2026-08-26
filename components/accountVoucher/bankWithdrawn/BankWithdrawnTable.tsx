"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { ArrowDownToLine } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

import {
  BankWithdrawnTableData,
  BankWithdrawnTableProps,
} from "@/types/accountVoucher/BankWithdrawnTypes";
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

interface BankWithdrawnState {
  withdrawnData: BankWithdrawnTableData[];
}

interface RootState {
  bankWithdrawn: BankWithdrawnState;
}

const BankWithdrawnTable: FC<BankWithdrawnTableProps> = ({
  loading,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteBankWithdrawn,
  deleteBankWithdrawnLoading,
  currentPage,
  setCurrentPage,
  lastPage,
}) => {
  const withdrawnData: BankWithdrawnTableData[] = useSelector(
    (state: RootState) => state?.bankWithdrawn?.withdrawnData
  );

  const { search, setSearch, filtered } = useClientTableSearch(withdrawnData);

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
            title="Active withdrawals"
            description="Search, review, and manage existing withdrawals."
            value={search}
            onValueChange={setSearch}
            placeholder="Search withdrawal"
            />
        }

        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn className="w-[100px]">Serial No.</TableColumn>
          <TableColumn align="center">Withdrawn Date</TableColumn>
          <TableColumn align="center">Vouch No.</TableColumn>
          <TableColumn align="center">Ref. Vouch No.</TableColumn>
          <TableColumn align="center">Particular</TableColumn>
          <TableColumn align="center">Amount</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={ArrowDownToLine}
              entity="withdrawals"
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
        message="Are you sure to delete this withdrawn ?"
        isBusy={deleteBankWithdrawnLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteBankWithdrawn}
      />
    </div>
  );
};
export default BankWithdrawnTable;
