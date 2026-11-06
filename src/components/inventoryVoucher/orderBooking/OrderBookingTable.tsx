"use client";

import { TableDateFilter } from "@/components/ui/table-date-filter";
import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import {
  TableCancelButton,
  TableEditButton,
  TableNameCell,
  formatTableSerial,
  getPaginatedTableRows,
} from "@/components/ui/table-edit-button";
import { filterBySearch } from "@/lib/useClientTableSearch";
import { toApiDate } from "@/lib/voucherTableDate";
import {
  ChevronRight,
  ClipboardCheck,
  ListFilter,
  Printer,
  RotateCcw,
} from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

import { cn } from "@/lib/utils";
import {
  OrderBookingTableData,
  OrderBookingTableProps,
} from "@/types/inventoryVoucher/OrderBookingTypes";
import { getDesignGhat } from "@/utils/designGhat";
import { getOrderItemType } from "@/utils/orderItemType";
import { formatRate, formatTwoDecimals } from "@/utils/formatDecimal";
import {
  Button,
  Chip,
  Image,
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
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TablePaginationBar } from "@/components/ui/table-pagination";
import JobSheetModal from "./JobSheetModal";

interface OrderPartyOption {
  Id: number;
  Party_Name: string;
}

interface OrderBookingState {
  orderBookingData: OrderBookingTableData[];
  orderPartyData: OrderPartyOption[];
}

const ORDER_STATUS_OPTIONS = [
  "Ordered",
  "In Process",
  "Product Ready",
  "Shipped",
  "Out for Delivery",
  "Cancelled",
];

const filterSelectClassName =
  "h-10 min-w-[148px] rounded-full border border-black/15 bg-white px-3 text-sm text-foreground outline-none focus:border-black/25";

interface RootState {
  orderBooking: OrderBookingState;
}

const nestedHeadClassName =
  "px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground";
const nestedCellClassName =
  "px-3 py-2.5 text-center text-sm text-foreground";

const OrderBookingTable: FC<OrderBookingTableProps> = ({
  loading,
  handleEditOrder,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteOrder,
  deleteOrderBookingLoading,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  orderTableInput,
  handleFilterOrderTable,
  orderFromDate,
  orderToDate,
  onOrderFromDateChange,
  onOrderToDateChange,
  orderPartyFilter,
  onOrderPartyFilterChange,
  orderItemTypeFilter,
  onOrderItemTypeFilterChange,
  orderStatusFilter,
  onOrderStatusFilterChange,
  onResetOrderFilters,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [jobSheetOrder, setJobSheetOrder] =
    useState<OrderBookingTableData | null>(null);
  const [showJobSheetDialog, setShowJobSheetDialog] = useState(false);

  const toggleRow = (id: number) => {
    setExpandedOrderId((current) => (current === id ? null : id));
  };

  const handlePrintJobSheet = (order: OrderBookingTableData) => {
    setJobSheetOrder(order);
    setShowJobSheetDialog(true);
  };

  const orderBookingData: OrderBookingTableData[] = useSelector(
    (state: RootState) => state?.orderBooking?.orderBookingData
  ) ?? [];
  const orderPartyData: OrderPartyOption[] = useSelector(
    (state: RootState) => state?.orderBooking?.orderPartyData
  ) ?? [];

  const safeOrderBookingData = Array.isArray(orderBookingData)
    ? orderBookingData
    : [];

  const search = orderTableInput;
  const fromDay = toApiDate(orderFromDate);
  const toDay = toApiDate(orderToDate);
  const filtered = filterBySearch(
    safeOrderBookingData.filter((order) => {
      if (orderPartyFilter && String(order.Party_Id) !== orderPartyFilter) {
        return false;
      }
      if (
        orderItemTypeFilter &&
        getOrderItemType(order).toLowerCase() !== orderItemTypeFilter
      ) {
        return false;
      }
      if (
        orderStatusFilter &&
        String(order.Order_Status ?? "").trim().toLowerCase() !==
          orderStatusFilter.trim().toLowerCase()
      ) {
        return false;
      }
      const orderDay = toApiDate(new Date(order.Order_Date));
      if (fromDay && (!orderDay || orderDay < fromDay)) return false;
      if (toDay && (!orderDay || orderDay > toDay)) return false;
      return true;
    }),
    search,
  );
  const hasActiveFilters = Boolean(
    search ||
      orderFromDate ||
      orderToDate ||
      orderPartyFilter ||
      orderItemTypeFilter ||
      orderStatusFilter,
  );
  // A short page is the last page. Filtered lists under the page size must
  // not keep the unfiltered API page count.
  const effectiveLastPage =
    filtered.length < perPage
      ? Math.max(1, currentPage)
      : Math.max(lastPage, currentPage);

  useEffect(() => {
    setExpandedOrderId(null);
  }, [currentPage, search, perPage]);

  return (
    <div className="w-full">
      <Table
        removeWrapper
        aria-label="Active order list"
        bottomContent={
          <TablePaginationBar
            currentPage={currentPage}
            lastPage={effectiveLastPage}
            perPage={perPage}
            onPerPageChange={onPerPageChange}
            onPageChange={(page) => {
              setExpandedOrderId(null);
              setCurrentPage(page);
            }}
          />
        }
        topContent={
          <div className="flex w-full flex-col gap-3">
            <div className="min-w-0">
              <h2 className="text-[15px] font-semibold text-foreground">
                Active orders
              </h2>
              <p className="text-sm text-muted-foreground">
                Search, review, and manage existing orders.
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 rounded-xl border border-black/[0.08] bg-white p-3">
              <span className="inline-flex shrink-0 items-center gap-1.5 pr-1 text-sm font-medium text-foreground">
                <ListFilter className="h-4 w-4 text-primary" />
                Filter
              </span>
              <TableSearchInput
                value={search}
                onValueChange={handleFilterOrderTable}
                placeholder="Search order"
                className="w-auto shrink-0 justify-start"
              />
              <TableDateFilter
                fromDate={orderFromDate}
                toDate={orderToDate}
                onFromDateChange={onOrderFromDateChange}
                onToDateChange={onOrderToDateChange}
              />
              <select
                aria-label="Party"
                value={orderPartyFilter}
                onChange={(event) => onOrderPartyFilterChange(event.target.value)}
                className={filterSelectClassName}
              >
                <option value="">All parties</option>
                {orderPartyData.map((party) => (
                  <option key={party.Id} value={String(party.Id)}>
                    {party.Party_Name}
                  </option>
                ))}
              </select>
              <select
                aria-label="Item type"
                value={orderItemTypeFilter}
                onChange={(event) =>
                  onOrderItemTypeFilterChange(event.target.value)
                }
                className={filterSelectClassName}
              >
                <option value="">All item types</option>
                <option value="own">Own</option>
                <option value="party">Party</option>
              </select>
              <select
                aria-label="Order status"
                value={orderStatusFilter}
                onChange={(event) =>
                  onOrderStatusFilterChange(event.target.value)
                }
                className={filterSelectClassName}
              >
                <option value="">All statuses</option>
                {ORDER_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
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
                onPress={onResetOrderFilters}
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
          <TableColumn align="center">Serial No.</TableColumn>
          <TableColumn align="center">Order Date</TableColumn>
          <TableColumn align="center">Order No.</TableColumn>
          <TableColumn align="center">Design Name - No.</TableColumn>
          <TableColumn align="center">Party Name</TableColumn>
          <TableColumn align="center">Order Amount</TableColumn>
          <TableColumn align="center">Item Type</TableColumn>
          <TableColumn align="center">Order Status</TableColumn>
          <TableColumn align="center" className="w-[120px]">
            Actions
          </TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={ClipboardCheck}
              entity="orders"
              search={search}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {getPaginatedTableRows(filtered, loading).flatMap((data, index) => {
            const isOpen = expandedOrderId === data.Id;
            const designs = data.DesignRow ?? [];
            const designLabels = Array.from(
              new Set(
                designs
                  .map((design) =>
                    [
                      String(design.Design_Name ?? "").trim(),
                      String(design.Design_No ?? "").trim(),
                    ]
                      .filter(Boolean)
                      .join(" - "),
                  )
                  .filter(Boolean),
              ),
            );
            const rows = [
              <TableRow key={data.Id}>
                <TableCell className="w-[56px]">
                  <Button
                    type="button"
                    isIconOnly
                    size="sm"
                    radius="md"
                    variant="light"
                    aria-expanded={isOpen}
                    aria-label={
                      isOpen ? "Collapse order details" : "Expand order details"
                    }
                    className="h-8 w-8 min-w-8 text-muted-foreground"
                    onPress={() => toggleRow(data.Id)}
                  >
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen && "rotate-90",
                      )}
                    />
                  </Button>
                </TableCell>
                <TableCell>
                  {formatTableSerial(index, { currentPage, perPage })}
                </TableCell>
                <TableCell>
                  {format(data.Order_Date, "dd-MM-yyyy")}
                </TableCell>
                <TableCell>{data.Order_No}</TableCell>
                <TableCell>
                  {designLabels.length ? (
                    <div className="mx-auto flex max-w-[220px] flex-col items-center gap-0.5 break-words">
                      {designLabels.map((label) => (
                        <span key={label}>{label}</span>
                      ))}
                    </div>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <TableNameCell name={data.Party_Name} />
                  </div>
                </TableCell>
                <TableCell>{data.Total_Order}</TableCell>
                <TableCell>{getOrderItemType(data)}</TableCell>
                <TableCell>
                  <Chip
                    className="capitalize"
                    color={
                      data.Order_Status !== "Ordered" ? "success" : "warning"
                    }
                    size="md"
                    variant="flat"
                  >
                    {data.Order_Status}
                  </Chip>
                </TableCell>
                <TableCell className="w-[120px]">
                  <div className="inline-flex items-center justify-center gap-2">
                    <Tooltip content="Print Job Sheet" delay={200}>
                      <span className="inline-flex">
                        <Button
                          type="button"
                          isIconOnly
                          size="sm"
                          radius="md"
                          aria-label="Print Job Sheet"
                          className="h-8 w-8 min-w-8 bg-[#E8F1FB] text-[#1D4ED8] shadow-none transition-colors data-[hover=true]:bg-[#D7E7F8] data-[hover=true]:text-[#1E40AF]"
                          onPress={() => handlePrintJobSheet(data)}
                        >
                          <Printer className="h-3.5 w-3.5" strokeWidth={2} />
                        </Button>
                      </span>
                    </Tooltip>
                    <TableEditButton
                      label="Edit order"
                      onPress={() => handleEditOrder(data)}
                      isDisabled={data.Order_Status !== "Ordered"}
                    />
                    <TableCancelButton
                      label="Cancel order"
                      onPress={() => handleShowDeleteDialog(data.Id)}
                      isDisabled={data.Order_Status !== "Ordered"}
                    />
                  </div>
                </TableCell>
              </TableRow>,
            ];

            if (isOpen) {
              rows.push(
                <TableRow key={`${data.Id}-details`}>
                  <TableCell
                    colSpan={10}
                    className="bg-[#F7F5F3]/70 px-5 py-3"
                  >
                    {designs.length ? (
                      <div className="space-y-3">
                        {designs.map((design) => {
                          const items = design.ItemRow ?? [];
                          const ghatInfo = getDesignGhat(design);

                          return (
                            <div
                              key={`${data.Id}-${design.Design_Id}`}
                              className="w-full overflow-hidden rounded-xl border border-black/[0.06] bg-white"
                            >
                              <div className="flex flex-wrap items-center gap-4 border-b border-black/[0.05] bg-[#F7F5F3]/60 px-4 py-3">
                                {design.Image ? (
                                  <Image
                                    src={design.Image}
                                    alt={design.Design_Name || "Design"}
                                    width={56}
                                    height={56}
                                    className="h-14 w-14 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#F7F5F3] text-xs text-muted-foreground">
                                    —
                                  </div>
                                )}
                                <div className="min-w-0 flex-1 text-left">
                                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                    Design
                                  </p>
                                  <p className="truncate text-sm font-semibold text-foreground">
                                    {design.Design_Name || "—"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    No. {design.Design_No || "—"}
                                  </p>
                                </div>
                              </div>

                              <div className="overflow-x-auto">
                                <table className="w-full min-w-[720px] border-collapse text-center">
                                  <thead>
                                    <tr className="bg-[#F7F5F3]">
                                      <th className={nestedHeadClassName}>
                                        Order Qty
                                      </th>
                                      <th className={nestedHeadClassName}>
                                        WT
                                      </th>
                                      <th className={nestedHeadClassName}>
                                        Total Wt
                                      </th>
                                      {ghatInfo ? (
                                        <>
                                          <th className={nestedHeadClassName}>
                                            Ghat
                                          </th>
                                          <th className={nestedHeadClassName}>
                                            Total Ghat
                                          </th>
                                        </>
                                      ) : null}
                                      <th className={nestedHeadClassName}>
                                        Polish
                                      </th>
                                      <th className={nestedHeadClassName}>
                                        Total Polish
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className={nestedCellClassName}>
                                        {formatTwoDecimals(design.Order_Qnty)}
                                      </td>
                                      <td className={nestedCellClassName}>
                                        {formatTwoDecimals(design.Wt)}
                                      </td>
                                      <td className={nestedCellClassName}>
                                        {formatTwoDecimals(design.Tot_Wt)}
                                      </td>
                                      {ghatInfo ? (
                                        <>
                                          <td className={nestedCellClassName}>
                                            {formatTwoDecimals(ghatInfo.ghat)}
                                          </td>
                                          <td className={nestedCellClassName}>
                                            {formatTwoDecimals(ghatInfo.total)}
                                          </td>
                                        </>
                                      ) : null}
                                      <td className={nestedCellClassName}>
                                        {formatTwoDecimals(design.Polish)}
                                      </td>
                                      <td className={nestedCellClassName}>
                                        {formatTwoDecimals(design.Tot_Polish)}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>

                              <div className="border-t border-black/[0.05]">
                                <div className="bg-[#F7F5F3] px-4 py-2 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                  Item details
                                </div>
                                <div className="overflow-x-auto">
                                  <table className="w-full min-w-[640px] border-collapse text-center">
                                    <thead>
                                      <tr className="bg-[#F7F5F3]/50">
                                        <th
                                          className={cn(
                                            nestedHeadClassName,
                                            "w-[40%] text-left",
                                          )}
                                        >
                                          Item Name
                                        </th>
                                        <th className={nestedHeadClassName}>
                                          Quantity
                                        </th>
                                        <th className={nestedHeadClassName}>
                                          Item Rate
                                        </th>
                                        <th className={nestedHeadClassName}>
                                          Item Total
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {items.length ? (
                                        items.map((child, i) => (
                                          <tr
                                            key={`${data.Id}-${design.Design_Id}-${child.Item_Id}-${i}`}
                                            className="border-b border-black/[0.05] last:border-b-0"
                                          >
                                            <td
                                              className={cn(
                                                nestedCellClassName,
                                                "text-left",
                                              )}
                                            >
                                              {child.Item_Name}
                                            </td>
                                            <td className={nestedCellClassName}>
                                              {formatTwoDecimals(
                                                child.Item_Qnty,
                                              )}
                                            </td>
                                            <td className={nestedCellClassName}>
                                              {formatRate(
                                                child.Item_Rate,
                                              )}
                                            </td>
                                            <td className={nestedCellClassName}>
                                              {formatTwoDecimals(
                                                child.Item_Tot,
                                              )}
                                            </td>
                                          </tr>
                                        ))
                                      ) : (
                                        <tr>
                                          <td
                                            colSpan={4}
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
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-black/[0.06] bg-white px-4 py-6 text-center text-sm text-muted-foreground">
                        No design details found.
                      </div>
                    )}
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
        message="Are you sure to cancel this order?"
        isBusy={deleteOrderBookingLoading}
        cancelLabel="No"
        confirmLabel="Cancel"
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteOrder}
      />

      <JobSheetModal
        order={jobSheetOrder}
        isOpen={showJobSheetDialog}
        onOpenChange={(open) => {
          setShowJobSheetDialog(open);
          if (!open) setJobSheetOrder(null);
        }}
      />
    </div>
  );
};
export default OrderBookingTable;
