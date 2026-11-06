"use client";

import { TableDateFilter } from "@/components/ui/table-date-filter";
import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { getPaginatedTableRows, getTableSerialIndex } from "@/components/ui/table-edit-button";
import { filterBySearch } from "@/lib/useClientTableSearch";
import { toApiDate } from "@/lib/voucherTableDate";
import { FileSpreadsheet, ListFilter, Printer, RotateCcw } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { TablePaginationBar } from "@/components/ui/table-pagination";

import {
  InvoiceListData,
  InvoiceTableProps,
} from "@/types/inventoryVoucher/SalesVoucherTypes";
import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { format } from "date-fns";
import { FC } from "react";
import { TableCancelButton } from "@/components/ui/table-edit-button";
import { useSelector } from "react-redux";
import InvoiceModal from "./process/InvoiceModal";

interface InvoicePartyOption {
  Id: number;
  Party_Name: string;
}

interface InvoiceState {
  invoiceListData: InvoiceListData[];
}

interface OrderBookingState {
  orderPartyData: InvoicePartyOption[];
}

interface RootState {
  salesVoucher: InvoiceState;
  orderBooking: OrderBookingState;
}

const filterSelectClassName =
  "h-10 min-w-[148px] rounded-full border border-black/15 bg-white px-3 text-sm text-foreground outline-none focus:border-black/25";

const InvoiceTable: FC<InvoiceTableProps> = ({
  loading,
  deleteInvoiceLoading,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteInvoiceData,
  showInvoiceDialog,
  setShowInvoiceDialog,
  handleShowInvoiceDialog,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  invoiceTableInput,
  handleFilterInvoiceTable,
  invoiceFromDate,
  invoiceToDate,
  onInvoiceFromDateChange,
  onInvoiceToDateChange,
  invoicePartyFilter,
  onInvoicePartyFilterChange,
  onResetInvoiceFilters,
}) => {
  const invoiceData: InvoiceListData[] = useSelector(
    (state: RootState) => state?.salesVoucher?.invoiceListData
  );
  const orderPartyData: InvoicePartyOption[] =
    useSelector(
      (state: RootState) => state?.orderBooking?.orderPartyData,
    ) ?? [];

  const search = invoiceTableInput;
  const fromDay = toApiDate(invoiceFromDate);
  const toDay = toApiDate(invoiceToDate);
  const selectedParty = orderPartyData.find(
    (party) => String(party.Id) === invoicePartyFilter,
  );
  const safeInvoiceData = Array.isArray(invoiceData) ? invoiceData : [];
  const filtered = filterBySearch(
    safeInvoiceData.filter((invoice) => {
      if (invoicePartyFilter) {
        const rowPartyId = invoice.Party_Id;
        if (rowPartyId != null && String(rowPartyId).trim() !== "") {
          if (String(rowPartyId) !== invoicePartyFilter) return false;
        } else if (
          selectedParty &&
          String(invoice.Party_Name ?? "").trim().toLowerCase() !==
            String(selectedParty.Party_Name ?? "").trim().toLowerCase()
        ) {
          return false;
        }
      }
      const salesDay = toApiDate(new Date(invoice.Sales_Date));
      if (fromDay && (!salesDay || salesDay < fromDay)) return false;
      if (toDay && (!salesDay || salesDay > toDay)) return false;
      return true;
    }),
    search,
  );
  const hasActiveFilters = Boolean(
    search || invoiceFromDate || invoiceToDate || invoicePartyFilter,
  );
  const effectiveLastPage =
    filtered.length < perPage
      ? Math.max(1, currentPage)
      : Math.max(lastPage, currentPage);

  return (
    <div className="w-full">
      <Table
        removeWrapper
        aria-label="Example static collection table"
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
                Active invoices
              </h2>
              <p className="text-sm text-muted-foreground">
                Search, review, and manage existing invoices.
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 rounded-xl border border-black/[0.08] bg-white p-3">
              <span className="inline-flex shrink-0 items-center gap-1.5 pr-1 text-sm font-medium text-foreground">
                <ListFilter className="h-4 w-4 text-primary" />
                Filter
              </span>
              <TableSearchInput
                value={search}
                onValueChange={handleFilterInvoiceTable}
                placeholder="Search invoice"
                className="w-auto shrink-0 justify-start"
              />
              <TableDateFilter
                fromDate={invoiceFromDate}
                toDate={invoiceToDate}
                onFromDateChange={onInvoiceFromDateChange}
                onToDateChange={onInvoiceToDateChange}
              />
              <select
                aria-label="Party"
                value={invoicePartyFilter}
                onChange={(event) =>
                  onInvoicePartyFilterChange(event.target.value)
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
                onPress={onResetInvoiceFilters}
              >
                Reset
              </Button>
            </div>
          </div>
        }

        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn>Serial No.</TableColumn>
          <TableColumn align="center">Sales Date</TableColumn>
          <TableColumn align="center">Sales No.</TableColumn>
          <TableColumn align="center">Party Name</TableColumn>
          <TableColumn align="center">Party Address</TableColumn>
          <TableColumn align="center">Party GST</TableColumn>
          <TableColumn align="center">Party Mobile</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={FileSpreadsheet}
              entity="invoices"
              search={search}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {getPaginatedTableRows(filtered, loading).map((data, index) => (
            <TableRow key={data.Id}>
              <TableCell>
                {getTableSerialIndex(index, currentPage, perPage) + 1}
              </TableCell>
              <TableCell>{format(data.Sales_Date, "dd-MM-yyyy")}</TableCell>
              <TableCell>{data.Sales_No}</TableCell>
              <TableCell>{data.Party_Name}</TableCell>
              <TableCell>{data.Party_Add}</TableCell>
              <TableCell>{data.Party_Gst}</TableCell>
              <TableCell>{data.Party_Mob}</TableCell>
              <TableCell align="center" className=" flex justify-center">
                <div className="relative flex items-center gap-3">
                  <Tooltip color="primary" content="Print">
                    <span
                      onClick={() => handleShowInvoiceDialog(data.Id)}
                      className="text-xl text-primary cursor-pointer active:opacity-50"
                    >
                      <Printer className="h-5 w-5" />
                    </span>
                  </Tooltip>
                  <TableCancelButton
                    label="Cancel invoice"
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
        message="Are you sure to cancel this invoice?"
        isBusy={deleteInvoiceLoading}
        cancelLabel="No"
        confirmLabel="Cancel"
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteInvoiceData}
      />

      <InvoiceModal
        showInvoiceDialog={showInvoiceDialog}
        setShowInvoiceDialog={setShowInvoiceDialog}
      />
    </div>
  );
};
export default InvoiceTable;
