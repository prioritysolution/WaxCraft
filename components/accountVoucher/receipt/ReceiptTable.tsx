"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { HandCoins } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

import {
  ReceiptTableData,
  ReceiptTableProps,
} from "@/types/accountVoucher/ReceiptTypes";
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

interface ReceiptState {
  receiptData: ReceiptTableData[];
}

interface RootState {
  receipt: ReceiptState;
}

const ReceiptTable: FC<ReceiptTableProps> = ({
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteReceipt,
  deleteReceiptLoading,
  currentPage,
  setCurrentPage,
  lastPage,
  loading,
}) => {
  const receiptData: ReceiptTableData[] = useSelector(
    (state: RootState) => state?.receipt?.receiptData
  );

  const { search, setSearch, filtered } = useClientTableSearch(receiptData);

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
            title="Active receipts"
            description="Search, review, and manage existing receipts."
            value={search}
            onValueChange={setSearch}
            placeholder="Search receipt"
            />
        }

        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn className="w-[100px]">Serial No.</TableColumn>
          <TableColumn align="center">Receipt Date</TableColumn>
          <TableColumn align="center">Vouch No.</TableColumn>
          <TableColumn align="center">Ref. Vouch No.</TableColumn>
          <TableColumn align="center">Particular</TableColumn>
          <TableColumn align="center">Amount</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={HandCoins}
              entity="receipts"
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
        message="Are you sure to delete this receipt ?"
        isBusy={deleteReceiptLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteReceipt}
      />
    </div>
  );
};
export default ReceiptTable;
