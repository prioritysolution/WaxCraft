"use client";

import { TableDateFilter } from "@/components/ui/table-date-filter";
import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { getPaginatedTableRows, getTableSerialIndex } from "@/components/ui/table-edit-button";
import { filterBySearch } from "@/lib/useClientTableSearch";
import { toApiDate } from "@/lib/voucherTableDate";
import { ListFilter, Printer, RotateCcw } from "lucide-react";
import { tableClassNames } from "@/lib/uiStyles";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { TablePaginationBar } from "@/components/ui/table-pagination";
import {
  SamplePrintTableData,
  SamplePrintTableProps,
} from "@/types/inventoryVoucher/SamplePrintTypes";
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
import { format, parseISO, isValid } from "date-fns";
import { FC } from "react";
import { TableDeleteButton } from "@/components/ui/table-edit-button";
import { useSelector } from "react-redux";

interface SamplePrintPartyOption {
  Id: number;
  Party_Name: string;
}

interface SamplePrintState {
  samplePrintData: SamplePrintTableData[];
}

interface OrderBookingState {
  orderPartyData: SamplePrintPartyOption[];
}

interface RootState {
  samplePrint: SamplePrintState;
  orderBooking: OrderBookingState;
}

const filterSelectClassName =
  "h-10 min-w-[148px] rounded-full border border-black/15 bg-white px-3 text-sm text-foreground outline-none focus:border-black/25";

const formatPrintDate = (value?: string) => {
  if (!value) return "";
  const parsed = value.includes("T") ? parseISO(value) : new Date(value);
  return isValid(parsed) ? format(parsed, "dd-MM-yyyy") : value;
};

const SamplePrintTable: FC<SamplePrintTableProps> = ({
  loading,
  handleShowPrintFromHistory,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteSamplePrint,
  deleteSamplePrintLoading,
  printLoading = false,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  samplePrintTableInput,
  handleFilterSamplePrintTable,
  samplePrintFromDate,
  samplePrintToDate,
  onSamplePrintFromDateChange,
  onSamplePrintToDateChange,
  samplePrintPartyFilter,
  onSamplePrintPartyFilterChange,
  onResetSamplePrintFilters,
}) => {
  const samplePrintData: SamplePrintTableData[] = useSelector(
    (state: RootState) => state?.samplePrint?.samplePrintData
  );
  const orderPartyData: SamplePrintPartyOption[] =
    useSelector(
      (state: RootState) => state?.orderBooking?.orderPartyData,
    ) ?? [];

  const search = samplePrintTableInput;
  const fromDay = toApiDate(samplePrintFromDate);
  const toDay = toApiDate(samplePrintToDate);
  const selectedParty = orderPartyData.find(
    (party) => String(party.Id) === samplePrintPartyFilter,
  );
  const safeRows = Array.isArray(samplePrintData) ? samplePrintData : [];
  const filtered = filterBySearch(
    safeRows.filter((row) => {
      if (samplePrintPartyFilter) {
        const rowPartyId = row.Party_Id;
        if (rowPartyId != null && String(rowPartyId).trim() !== "") {
          if (String(rowPartyId) !== samplePrintPartyFilter) return false;
        } else if (
          selectedParty &&
          String(row.Party_Name ?? "").trim().toLowerCase() !==
            String(selectedParty.Party_Name ?? "").trim().toLowerCase()
        ) {
          return false;
        }
      }
      const rawDate = String(row.Print_Date ?? "");
      const printDay = toApiDate(
        rawDate.includes("T") ? parseISO(rawDate) : new Date(rawDate),
      );
      if (fromDay && (!printDay || printDay < fromDay)) return false;
      if (toDay && (!printDay || printDay > toDay)) return false;
      return true;
    }),
    search,
  );
  const hasActiveFilters = Boolean(
    search ||
      samplePrintFromDate ||
      samplePrintToDate ||
      samplePrintPartyFilter,
  );
  const effectiveLastPage =
    filtered.length < perPage
      ? Math.max(1, currentPage)
      : Math.max(lastPage, currentPage);

  return (
    <div className="w-full">
      <Table
        removeWrapper
        aria-label="Sample print history"
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
                Sample print history
              </h2>
              <p className="text-sm text-muted-foreground">
                Saved sample PDFs for previously generated proposals.
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 rounded-xl border border-black/[0.08] bg-white p-3">
              <span className="inline-flex shrink-0 items-center gap-1.5 pr-1 text-sm font-medium text-foreground">
                <ListFilter className="h-4 w-4 text-primary" />
                Filter
              </span>
              <TableSearchInput
                value={search}
                onValueChange={handleFilterSamplePrintTable}
                placeholder="Search sample print"
                className="w-auto shrink-0 justify-start"
              />
              <TableDateFilter
                fromDate={samplePrintFromDate}
                toDate={samplePrintToDate}
                onFromDateChange={onSamplePrintFromDateChange}
                onToDateChange={onSamplePrintToDateChange}
              />
              <select
                aria-label="Party"
                value={samplePrintPartyFilter}
                onChange={(event) =>
                  onSamplePrintPartyFilterChange(event.target.value)
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
                onPress={onResetSamplePrintFilters}
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
          <TableColumn align="center">Print Date</TableColumn>
          <TableColumn align="center">Sample No.</TableColumn>
          <TableColumn align="center">Party Name</TableColumn>
          <TableColumn align="center">Design Name</TableColumn>
          <TableColumn align="center">Design No.</TableColumn>
          <TableColumn align="center">Total Rate</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={Printer}
              entity="sample prints"
              search={search}
              emptyHint="Generate a sample PDF to see it listed here."
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {getPaginatedTableRows(filtered, loading).map((data, index) => (
            <TableRow key={data.Id || index}>
              <TableCell>
                {getTableSerialIndex(index, currentPage, perPage) + 1}
              </TableCell>
              <TableCell>{formatPrintDate(data.Print_Date)}</TableCell>
              <TableCell>{data.Sample_No || "—"}</TableCell>
              <TableCell>{data.Party_Name || "—"}</TableCell>
              <TableCell>
                {(() => {
                  const names = (data.DesignRow || [])
                    .map((row) => String(row.Design_Name || "").trim())
                    .filter(Boolean);
                  if (names.length > 0) return names.join(", ");
                  return data.Design_Name || "—";
                })()}
              </TableCell>
              <TableCell>
                {(() => {
                  const nos = (data.DesignRow || [])
                    .map((row) => String(row.Design_No || "").trim())
                    .filter(Boolean);
                  if (nos.length > 0) return nos.join(", ");
                  return data.Design_No || "—";
                })()}
              </TableCell>
              <TableCell>{formatTwoDecimals(data.Total)}</TableCell>
              <TableCell>
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
                        onPress={() => handleShowPrintFromHistory(data)}
                      >
                        <Printer className="h-3.5 w-3.5" strokeWidth={2} />
                      </Button>
                    </span>
                  </Tooltip>
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
        message="Are you sure to delete this sample print?"
        isBusy={deleteSamplePrintLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteSamplePrint}
      />
    </div>
  );
};

export default SamplePrintTable;
