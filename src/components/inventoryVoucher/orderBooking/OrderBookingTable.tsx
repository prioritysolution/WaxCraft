"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import {
  TableCancelButton,
  TableNameCell,
  formatTableSerial,
  getPaginatedTableRows,
} from "@/components/ui/table-edit-button";
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { ChevronRight, ClipboardCheck } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

import { cn } from "@/lib/utils";
import {
  OrderBookingTableData,
  OrderBookingTableProps,
} from "@/types/inventoryVoucher/OrderBookingTypes";
import { formatTwoDecimals } from "@/utils/formatDecimal";
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
} from "@heroui/react";
import { format } from "date-fns";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TablePaginationBar } from "@/components/ui/table-pagination";

interface OrderBookingState {
  orderBookingData: OrderBookingTableData[];
}

interface RootState {
  orderBooking: OrderBookingState;
}

const nestedHeadClassName =
  "px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground";
const nestedCellClassName =
  "px-3 py-2.5 text-center text-sm text-foreground";

const OrderBookingTable: FC<OrderBookingTableProps> = ({
  loading,
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
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const toggleRow = (id: number) => {
    setExpandedOrderId((current) => (current === id ? null : id));
  };

  const orderBookingData: OrderBookingTableData[] = useSelector(
    (state: RootState) => state?.orderBooking?.orderBookingData
  ) ?? [];

  const safeOrderBookingData = Array.isArray(orderBookingData)
    ? orderBookingData
    : [];

  const { search, setSearch, filtered } = useClientTableSearch(safeOrderBookingData);

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
            lastPage={lastPage}
            perPage={perPage}
            onPerPageChange={onPerPageChange}
            onPageChange={(page) => {
              setExpandedOrderId(null);
              setCurrentPage(page);
            }}
          />
        }
        topContent={
          <TableSearchInput
            title="Active orders"
            description="Search, review, and manage existing orders."
            value={search}
            onValueChange={setSearch}
            placeholder="Search order"
          />
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
          <TableColumn align="center">Party Name</TableColumn>
          <TableColumn align="center">Order Amount</TableColumn>
          <TableColumn align="center">Order Status</TableColumn>
          <TableColumn align="center" className="w-[100px]">
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
                  <div className="flex justify-center">
                    <TableNameCell name={data.Party_Name} />
                  </div>
                </TableCell>
                <TableCell>{data.Total_Order}</TableCell>
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
                <TableCell className="w-[100px]">
                    <div className="flex justify-center">
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
                    colSpan={8}
                    className="bg-[#F7F5F3]/70 px-5 py-3"
                  >
                    {designs.length ? (
                      <div className="space-y-3">
                        {designs.map((design) => {
                          const items = design.ItemRow ?? [];

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
                                        Design Rate
                                      </th>
                                      <th className={nestedHeadClassName}>
                                        WT
                                      </th>
                                      <th className={nestedHeadClassName}>
                                        WT Rate
                                      </th>
                                      <th className={nestedHeadClassName}>
                                        Total Wt
                                      </th>
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
                                        {formatTwoDecimals(design.Design_Rate)}
                                      </td>
                                      <td className={nestedCellClassName}>
                                        {formatTwoDecimals(design.Wt)}
                                      </td>
                                      <td className={nestedCellClassName}>
                                        {formatTwoDecimals(design.Wt_Rate)}
                                      </td>
                                      <td className={nestedCellClassName}>
                                        {formatTwoDecimals(design.Tot_Wt)}
                                      </td>
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
                                          Making Rate
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
                                              {formatTwoDecimals(
                                                child.Item_Rate,
                                              )}
                                            </td>
                                            <td className={nestedCellClassName}>
                                              {formatTwoDecimals(
                                                child.Making_Rate,
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
                                            colSpan={5}
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
    </div>
  );
};
export default OrderBookingTable;
