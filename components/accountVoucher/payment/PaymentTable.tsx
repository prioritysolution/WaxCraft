"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { Banknote } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

import {
  PaymentTableData,
  PaymentTableProps,
} from "@/types/accountVoucher/PaymentTypes";
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

interface PaymentState {
  paymentData: PaymentTableData[];
}

interface RootState {
  payment: PaymentState;
}

const PaymentTable: FC<PaymentTableProps> = ({
  loading,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeletePayment,
  deletePaymentLoading,
  currentPage,
  setCurrentPage,
  lastPage,
}) => {
  const paymentData: PaymentTableData[] = useSelector(
    (state: RootState) => state?.payment?.paymentData
  );

  const { search, setSearch, filtered } = useClientTableSearch(paymentData);

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
            title="Active payments"
            description="Search, review, and manage existing payments."
            value={search}
            onValueChange={setSearch}
            placeholder="Search payment"
            />
        }

        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn className="w-[100px]">Serial No.</TableColumn>
          <TableColumn align="center">Payment Date</TableColumn>
          <TableColumn align="center">Vouch No.</TableColumn>
          <TableColumn align="center">Ref. Vouch No.</TableColumn>
          <TableColumn align="center">Particular</TableColumn>
          <TableColumn align="center">Amount</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={Banknote}
              entity="payments"
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
        message="Are you sure to delete this payment ?"
        isBusy={deletePaymentLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeletePayment}
      />
    </div>
  );
};
export default PaymentTable;
