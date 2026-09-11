"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { Printer, Receipt } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { TablePaginationBar } from "@/components/ui/table-pagination";

import {
  GstBillTableData,
  GstBillTableProps,
} from "@/types/inventoryVoucher/GstBillTypes";
import { formatTwoDecimals } from "@/utils/formatDecimal";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  Button,
} from "@heroui/react";
import { format, isValid, parseISO } from "date-fns";
import { FC } from "react";
import {
  getPaginatedTableRows,
  getTableSerialIndex,
  TableDeleteButton,
} from "@/components/ui/table-edit-button";
import { useSelector } from "react-redux";

interface GstBillState {
  gstBillData: GstBillTableData[];
}

interface RootState {
  gstBill: GstBillState;
}

const formatBillDate = (value?: string) => {
  if (!value) return "—";
  const parsed = value.includes("T") ? parseISO(value) : new Date(value);
  return isValid(parsed) ? format(parsed, "dd-MM-yyyy") : value;
};

const GstBillTable: FC<GstBillTableProps> = ({
  loading,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteGst,
  deleteGstBillLoading,
  handleShowPrint,
  printLoading = false,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
}) => {
  const gstBillData: GstBillTableData[] = useSelector(
    (state: RootState) => state?.gstBill?.gstBillData
  );

  const safeRows = Array.isArray(gstBillData) ? gstBillData : [];
  const { search, setSearch, filtered } = useClientTableSearch(safeRows);

  return (
    <div className="w-full">
      <Table
        removeWrapper
        aria-label="Active GST bills table"
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
            title="Active GST bills"
            description="Search, review, and manage existing GST bills."
            value={search}
            onValueChange={setSearch}
            placeholder="Search GST bill"
          />
        }
        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn className="w-[70px]">Serial No.</TableColumn>
          <TableColumn align="center">Bill Date</TableColumn>
          <TableColumn align="center">Bill No.</TableColumn>
          <TableColumn align="center">Party Name</TableColumn>
          <TableColumn align="center">Gross Amount</TableColumn>
          <TableColumn align="center">CGST</TableColumn>
          <TableColumn align="center">SGST</TableColumn>
          <TableColumn align="center">Total</TableColumn>
          <TableColumn align="center" className="w-[120px]">
            Actions
          </TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={Receipt}
              entity="GST bills"
              search={search}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {getPaginatedTableRows(filtered, loading).map((data, index) => {
            const gross = Number(data.Gross_Amt ?? 0);
            const cgst = Number(data.Cgst_Amt ?? 0);
            const sgst = Number(data.Sgst_Amt ?? 0);
            const total =
              data.Total != null && data.Total !== ""
                ? data.Total
                : gross + cgst + sgst + Number(data.Round_Amt ?? 0) - Number(data.Discount ?? 0);

            return (
              <TableRow key={`${data.Id}-${index}`}>
                <TableCell>
                  {getTableSerialIndex(index, currentPage, perPage) + 1}
                </TableCell>
                <TableCell>
                  {formatBillDate(data.Sales_Date || data.Bill_Date)}
                </TableCell>
                <TableCell>{data.Sales_No || data.Bill_No || "—"}</TableCell>
                <TableCell>{data.Party_Name || "—"}</TableCell>
                <TableCell>{formatTwoDecimals(data.Gross_Amt)}</TableCell>
                <TableCell>{formatTwoDecimals(data.Cgst_Amt)}</TableCell>
                <TableCell>{formatTwoDecimals(data.Sgst_Amt)}</TableCell>
                <TableCell>{formatTwoDecimals(total)}</TableCell>
                <TableCell align="center">
                  <div className="flex items-center justify-center gap-2">
                    <Tooltip content="Print" delay={200}>
                      <span className="inline-flex">
                        <Button
                          type="button"
                          isIconOnly
                          size="sm"
                          radius="md"
                          aria-label="Print"
                          className="h-8 w-8 min-w-8 bg-primary/10 text-primary shadow-none data-[hover=true]:bg-primary/20"
                          isLoading={printLoading}
                          isDisabled={printLoading}
                          onPress={() => handleShowPrint(data)}
                        >
                          <Printer className="h-3.5 w-3.5" strokeWidth={2} />
                        </Button>
                      </span>
                    </Tooltip>
                    <TableDeleteButton
                      onPress={() =>
                        handleShowDeleteDialog(
                          Number(data.Sales_Id ?? data.Id)
                        )
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <DeleteConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        message="Are you sure to delete this gst ?"
        isBusy={deleteGstBillLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteGst}
      />
    </div>
  );
};
export default GstBillTable;
