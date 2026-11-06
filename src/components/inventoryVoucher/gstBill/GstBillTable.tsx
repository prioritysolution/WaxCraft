"use client";

import { TableDateFilter } from "@/components/ui/table-date-filter";
import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { filterBySearch } from "@/lib/useClientTableSearch";
import { toApiDate } from "@/lib/voucherTableDate";
import { ListFilter, Printer, Receipt, RotateCcw } from "lucide-react";

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

interface GstBillPartyOption {
  Id: number;
  Party_Name: string;
}

interface GstBillState {
  gstBillData: GstBillTableData[];
}

interface OrderBookingState {
  orderPartyData: GstBillPartyOption[];
}

interface RootState {
  gstBill: GstBillState;
  orderBooking: OrderBookingState;
}

const filterSelectClassName =
  "h-10 min-w-[148px] rounded-full border border-black/15 bg-white px-3 text-sm text-foreground outline-none focus:border-black/25";

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
  gstBillTableInput,
  handleFilterGstBillTable,
  gstBillFromDate,
  gstBillToDate,
  onGstBillFromDateChange,
  onGstBillToDateChange,
  gstBillPartyFilter,
  onGstBillPartyFilterChange,
  onResetGstBillFilters,
}) => {
  const gstBillData: GstBillTableData[] = useSelector(
    (state: RootState) => state?.gstBill?.gstBillData
  );
  const orderPartyData: GstBillPartyOption[] =
    useSelector(
      (state: RootState) => state?.orderBooking?.orderPartyData,
    ) ?? [];

  const safeRows = Array.isArray(gstBillData) ? gstBillData : [];
  const search = gstBillTableInput;
  const fromDay = toApiDate(gstBillFromDate);
  const toDay = toApiDate(gstBillToDate);
  const selectedParty = orderPartyData.find(
    (party) => String(party.Id) === gstBillPartyFilter,
  );
  const filtered = filterBySearch(
    safeRows.filter((bill) => {
      if (gstBillPartyFilter) {
        const rowPartyId = bill.Party_Id;
        if (rowPartyId != null && String(rowPartyId).trim() !== "") {
          if (String(rowPartyId) !== gstBillPartyFilter) return false;
        } else if (
          selectedParty &&
          String(bill.Party_Name ?? "").trim().toLowerCase() !==
            String(selectedParty.Party_Name ?? "").trim().toLowerCase()
        ) {
          return false;
        }
      }
      const rawDate = String(bill.Sales_Date || bill.Bill_Date || "");
      const billDay = toApiDate(
        rawDate.includes("T") ? parseISO(rawDate) : new Date(rawDate),
      );
      if (fromDay && (!billDay || billDay < fromDay)) return false;
      if (toDay && (!billDay || billDay > toDay)) return false;
      return true;
    }),
    search,
  );
  const hasActiveFilters = Boolean(
    search || gstBillFromDate || gstBillToDate || gstBillPartyFilter,
  );
  const effectiveLastPage =
    filtered.length < perPage
      ? Math.max(1, currentPage)
      : Math.max(lastPage, currentPage);

  return (
    <div className="w-full">
      <Table
        removeWrapper
        aria-label="Active GST bills table"
        bottomContent={
          <TablePaginationBar
            currentPage={currentPage}
            lastPage={effectiveLastPage}
            onPageChange={setCurrentPage}
            perPage={perPage}
            onPerPageChange={onPerPageChange}
          />
        }
        topContent={
          <div className="flex w-full flex-col gap-3">
            <div className="min-w-0">
              <h2 className="text-[15px] font-semibold text-foreground">
                Active GST bills
              </h2>
              <p className="text-sm text-muted-foreground">
                Search, review, and manage existing GST bills.
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 rounded-xl border border-black/[0.08] bg-white p-3">
              <span className="inline-flex shrink-0 items-center gap-1.5 pr-1 text-sm font-medium text-foreground">
                <ListFilter className="h-4 w-4 text-primary" />
                Filter
              </span>
              <TableSearchInput
                value={search}
                onValueChange={handleFilterGstBillTable}
                placeholder="Search GST bill"
                className="w-auto shrink-0 justify-start"
              />
              <TableDateFilter
                fromDate={gstBillFromDate}
                toDate={gstBillToDate}
                onFromDateChange={onGstBillFromDateChange}
                onToDateChange={onGstBillToDateChange}
              />
              <select
                aria-label="Party"
                value={gstBillPartyFilter}
                onChange={(event) =>
                  onGstBillPartyFilterChange(event.target.value)
                }
                className={filterSelectClassName}
              >
                <option value="">All parties</option>
                {orderPartyData.map((party) => (
                  <option key={party.Id} value={String(party.Id)}>
                    {party.Party_Name}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="bordered"
                radius="full"
                className="h-10 min-w-[108px] border-black/15 bg-white px-3 text-sm font-medium"
                startContent={<RotateCcw className="h-4 w-4" />}
                isDisabled={!hasActiveFilters}
                onPress={onResetGstBillFilters}
              >
                Reset
              </Button>
            </div>
          </div>
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
