"use client";

import { TableDateFilter } from "@/components/ui/table-date-filter";
import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import {
  getPaginatedTableRows,
  getTableSerialIndex,
} from "@/components/ui/table-edit-button";
import { filterBySearch } from "@/lib/useClientTableSearch";
import { toApiDate } from "@/lib/voucherTableDate";
import { ChevronRight, FileInput, ListFilter, RotateCcw } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { TablePaginationBar } from "@/components/ui/table-pagination";
import { cn } from "@/lib/utils";
import { formatRate, formatTwoDecimals } from "@/utils/formatDecimal";
import { getPurchaseTypeLabel } from "@/utils/purchaseType";

import {
  PurchaseVoucherTableData,
  PurchaseVoucherTableProps,
} from "@/types/inventoryVoucher/PurchaseVoucherTypes";
import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { format } from "date-fns";
import { FC, useMemo, useState } from "react";
import {
  TableDeleteButton,
  TableEditButton,
} from "@/components/ui/table-edit-button";
import { useSelector } from "react-redux";

interface PurchasePartyOption {
  Id: number;
  Party_Name: string;
}

interface PurchaseVoucherState {
  purchaseVoucherData: PurchaseVoucherTableData[];
  purchasePartyData: PurchasePartyOption[];
}

interface RootState {
  purchaseVoucher: PurchaseVoucherState;
}

const PURCHASE_TYPE_OPTIONS = [
  { value: "ordered", label: "Ordered Purchase" },
  { value: "regular", label: "Regular Purchase" },
];

const filterSelectClassName =
  "h-10 min-w-[148px] rounded-full border border-black/15 bg-white px-3 text-sm text-foreground outline-none focus:border-black/25";

const nestedHeadClassName =
  "px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground";
const nestedCellClassName =
  "px-3 py-2.5 text-center text-sm text-foreground";

const COLUMN_COUNT = 8;

function itemTotal(quantity: string | number, rate: string | number) {
  const qty = Number(quantity);
  const itemRate = Number(rate);
  if (Number.isNaN(qty) || Number.isNaN(itemRate)) return "—";
  return formatTwoDecimals(qty * itemRate);
}

const PurchaseVoucherTable: FC<PurchaseVoucherTableProps> = ({
  loading,
  handleEditPurchase,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeletePurchase,
  deletePurchaseVoucherLoading,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  purchaseTableInput,
  handleFilterPurchaseTable,
  purchaseFromDate,
  purchaseToDate,
  onPurchaseFromDateChange,
  onPurchaseToDateChange,
  purchasePartyFilter,
  onPurchasePartyFilterChange,
  purchaseTypeFilter,
  onPurchaseTypeFilterChange,
  onResetPurchaseFilters,
}) => {
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});

  const toggleRow = (rowKey: string) => {
    setOpenRows((prev) => ({
      ...prev,
      [rowKey]: !prev[rowKey],
    }));
  };

  const purchaseVoucherData = useSelector(
    (state: RootState) => state?.purchaseVoucher?.purchaseVoucherData,
  );
  const purchasePartyData: PurchasePartyOption[] =
    useSelector(
      (state: RootState) => state?.purchaseVoucher?.purchasePartyData,
    ) ?? [];

  const safeRows = useMemo(() => {
    if (Array.isArray(purchaseVoucherData)) return purchaseVoucherData;
    if (
      purchaseVoucherData &&
      typeof purchaseVoucherData === "object" &&
      Array.isArray(
        (purchaseVoucherData as { data?: PurchaseVoucherTableData[] }).data,
      )
    ) {
      return (purchaseVoucherData as { data: PurchaseVoucherTableData[] }).data;
    }
    return [];
  }, [purchaseVoucherData]);

  const search = purchaseTableInput;
  const fromDay = toApiDate(purchaseFromDate);
  const toDay = toApiDate(purchaseToDate);
  const selectedParty = purchasePartyData.find(
    (party) => String(party.Id) === purchasePartyFilter,
  );
  const selectedTypeLabel = PURCHASE_TYPE_OPTIONS.find(
    (option) => option.value === purchaseTypeFilter,
  )?.label;
  const filtered = filterBySearch(
    safeRows.filter((purchase) => {
      if (purchasePartyFilter) {
        const rowPartyId = purchase.Party_Id;
        if (rowPartyId != null && String(rowPartyId).trim() !== "") {
          if (String(rowPartyId) !== purchasePartyFilter) return false;
        } else if (
          selectedParty &&
          String(purchase.Party_Name ?? "").trim().toLowerCase() !==
            String(selectedParty.Party_Name ?? "").trim().toLowerCase()
        ) {
          return false;
        }
      }
      if (
        selectedTypeLabel &&
        getPurchaseTypeLabel(purchase).toLowerCase() !==
          selectedTypeLabel.toLowerCase()
      ) {
        return false;
      }
      const purchaseDay = toApiDate(new Date(purchase.Purchase_Date));
      if (fromDay && (!purchaseDay || purchaseDay < fromDay)) return false;
      if (toDay && (!purchaseDay || purchaseDay > toDay)) return false;
      return true;
    }),
    search,
  );
  const hasActiveFilters = Boolean(
    search ||
      purchaseFromDate ||
      purchaseToDate ||
      purchasePartyFilter ||
      purchaseTypeFilter,
  );
  const effectiveLastPage =
    filtered.length < perPage
      ? Math.max(1, currentPage)
      : Math.max(lastPage, currentPage);

  return (
    <div className="w-full">
      <Table
        removeWrapper
        aria-label="Purchase vouchers table"
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
                Active purchases
              </h2>
              <p className="text-sm text-muted-foreground">
                Search, review, and manage existing purchases.
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 rounded-xl border border-black/[0.08] bg-white p-3">
              <span className="inline-flex shrink-0 items-center gap-1.5 pr-1 text-sm font-medium text-foreground">
                <ListFilter className="h-4 w-4 text-primary" />
                Filter
              </span>
              <TableSearchInput
                value={search}
                onValueChange={handleFilterPurchaseTable}
                placeholder="Search purchase"
                className="w-auto shrink-0 justify-start"
              />
              <TableDateFilter
                fromDate={purchaseFromDate}
                toDate={purchaseToDate}
                onFromDateChange={onPurchaseFromDateChange}
                onToDateChange={onPurchaseToDateChange}
              />
              <select
                aria-label="Party"
                value={purchasePartyFilter}
                onChange={(event) =>
                  onPurchasePartyFilterChange(event.target.value)
                }
                className={filterSelectClassName}
              >
                <option value="">All parties</option>
                {purchasePartyData.map((party) => (
                  <option key={party.Id} value={String(party.Id)}>
                    {party.Party_Name}
                  </option>
                ))}
              </select>
              <select
                aria-label="Purchase type"
                value={purchaseTypeFilter}
                onChange={(event) =>
                  onPurchaseTypeFilterChange(event.target.value)
                }
                className={filterSelectClassName}
              >
                <option value="">All purchase types</option>
                {PURCHASE_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
                onPress={onResetPurchaseFilters}
              >
                Reset
              </Button>
            </div>
          </div>
        }
        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn align="center" className="w-[56px]">
            {" "}
          </TableColumn>
          <TableColumn className="w-[100px]">Serial No.</TableColumn>
          <TableColumn align="center" className="w-[120px]">
            Purchase Date
          </TableColumn>
          <TableColumn align="center">Purchase No.</TableColumn>
          <TableColumn align="center">Party Name</TableColumn>
          <TableColumn align="center">Purchase Type</TableColumn>
          <TableColumn align="center">Purchase Amount</TableColumn>
          <TableColumn align="center" className="w-[100px]">
            Actions
          </TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={FileInput}
              entity="purchase vouchers"
              search={search}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {getPaginatedTableRows(filtered, loading).flatMap((data, index) => {
            const rowKey = `purchase-${data.Id ?? "x"}-${index}`;
            const isOpen = Boolean(openRows[rowKey]);
            const items = data.ItemRow ?? [];
            const rows = [
              <TableRow key={rowKey}>
                <TableCell className="w-[56px]">
                  <Button
                    type="button"
                    isIconOnly
                    size="sm"
                    radius="md"
                    variant="light"
                    aria-expanded={isOpen}
                    aria-label={
                      isOpen
                        ? "Collapse purchase details"
                        : "Expand purchase details"
                    }
                    className="h-8 w-8 min-w-8 text-muted-foreground"
                    onPress={() => toggleRow(rowKey)}
                  >
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen && "rotate-90",
                      )}
                    />
                  </Button>
                </TableCell>
                <TableCell className="w-[100px]">
                  {getTableSerialIndex(index, currentPage, perPage) + 1}
                </TableCell>
                <TableCell>
                  {data.Purchase_Date
                    ? format(data.Purchase_Date, "dd-MM-yyyy")
                    : "—"}
                </TableCell>
                <TableCell>{data.Purchase_No}</TableCell>
                <TableCell>{data.Party_Name}</TableCell>
                <TableCell>{getPurchaseTypeLabel(data)}</TableCell>
                <TableCell>{formatTwoDecimals(data.Total_Amount)}</TableCell>
                <TableCell align="center" className="w-[100px]">
                  <div className="inline-flex items-center justify-center gap-2">
                    <TableEditButton
                      label="Edit purchase"
                      onPress={() => handleEditPurchase(data)}
                    />
                    <TableDeleteButton
                      onPress={() => handleShowDeleteDialog(data.Id)}
                    />
                  </div>
                </TableCell>
              </TableRow>,
            ];

            if (isOpen) {
              rows.push(
                <TableRow key={`${rowKey}-details`}>
                  <TableCell
                    colSpan={COLUMN_COUNT}
                    className="bg-[#F7F5F3]/70 px-5 py-3"
                  >
                    <div className="w-full overflow-hidden rounded-xl border border-black/[0.06] bg-white">
                      <div className="bg-[#F7F5F3] px-4 py-2 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Item details
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] border-collapse text-center">
                          <thead>
                            <tr className="bg-[#F7F5F3]/50">
                              <th
                                className={cn(
                                  nestedHeadClassName,
                                  "w-[38%] text-left",
                                )}
                              >
                                Item Name
                              </th>
                              <th className={nestedHeadClassName}>Quantity</th>
                              <th className={nestedHeadClassName}>Rate</th>
                              <th className={nestedHeadClassName}>Total</th>
                              <th className={nestedHeadClassName}>CGST</th>
                              <th className={nestedHeadClassName}>SGST</th>
                              <th className={nestedHeadClassName}>IGST</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length ? (
                              items.map((child, itemIndex) => (
                                <tr
                                  key={`${rowKey}-item-${child.Item_Id ?? "x"}-${itemIndex}`}
                                  className="border-b border-black/[0.05] last:border-b-0"
                                >
                                  <td
                                    className={cn(
                                      nestedCellClassName,
                                      "text-left",
                                    )}
                                  >
                                    {child.Item_Name || "—"}
                                  </td>
                                  <td className={nestedCellClassName}>
                                    {formatTwoDecimals(child.Item_Qnty)}
                                  </td>
                                  <td className={nestedCellClassName}>
                                    {formatRate(child.Item_Rate)}
                                  </td>
                                  <td className={nestedCellClassName}>
                                    {itemTotal(
                                      child.Item_Qnty,
                                      child.Item_Rate,
                                    )}
                                  </td>
                                  <td className={nestedCellClassName}>
                                    {formatTwoDecimals(child.Item_CGST)}
                                  </td>
                                  <td className={nestedCellClassName}>
                                    {formatTwoDecimals(child.Item_SGST)}
                                  </td>
                                  <td className={nestedCellClassName}>
                                    {formatTwoDecimals(child.Item_IGST || 0)}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={7}
                                  className="px-4 py-6 text-center text-sm text-muted-foreground"
                                >
                                  No items found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>,
              );
            }

            return rows;
          })}
        </TableBody>
      </Table>
      <DeleteConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        message="Are you sure to delete this purchase ?"
        isBusy={deletePurchaseVoucherLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeletePurchase}
      />
    </div>
  );
};
export default PurchaseVoucherTable;
