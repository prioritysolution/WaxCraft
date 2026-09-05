"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import {
  getPaginatedTableRows,
  getTableSerialIndex,
} from "@/components/ui/table-edit-button";
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { ChevronRight, FileInput } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { TablePaginationBar } from "@/components/ui/table-pagination";
import { cn } from "@/lib/utils";
import { formatTwoDecimals } from "@/utils/formatDecimal";

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
import { TableDeleteButton } from "@/components/ui/table-edit-button";
import { useSelector } from "react-redux";

interface PurchaseVoucherState {
  purchaseVoucherData: PurchaseVoucherTableData[];
}

interface RootState {
  purchaseVoucher: PurchaseVoucherState;
}

const nestedHeadClassName =
  "px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground";
const nestedCellClassName =
  "px-3 py-2.5 text-center text-sm text-foreground";

const COLUMN_COUNT = 8;

function purchaseTypeLabel(data: PurchaseVoucherTableData) {
  const raw = String(
    data.Purchase_Type ?? data.Pur_Type ?? data.Is_Order ?? "",
  ).trim();
  if (
    raw === "O" ||
    raw === "1" ||
    raw.toLowerCase().includes("order")
  ) {
    return "Ordered Purchase";
  }
  if (
    raw === "R" ||
    raw === "0" ||
    raw.toLowerCase().includes("regular")
  ) {
    return "Regular Purchase";
  }
  return raw || "—";
}

function itemTotal(quantity: string | number, rate: string | number) {
  const qty = Number(quantity);
  const itemRate = Number(rate);
  if (Number.isNaN(qty) || Number.isNaN(itemRate)) return "—";
  return formatTwoDecimals(qty * itemRate);
}

const PurchaseVoucherTable: FC<PurchaseVoucherTableProps> = ({
  loading,
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

  const { search, setSearch, filtered } = useClientTableSearch(safeRows);

  return (
    <div className="w-full">
      <Table
        removeWrapper
        aria-label="Purchase vouchers table"
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
            title="Active purchases"
            description="Search, review, and manage existing purchases."
            value={search}
            onValueChange={setSearch}
            placeholder="Search purchase"
          />
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
                <TableCell>{purchaseTypeLabel(data)}</TableCell>
                <TableCell>{formatTwoDecimals(data.Total_Amount)}</TableCell>
                <TableCell align="center" className="flex justify-center">
                  <TableDeleteButton
                    onPress={() => handleShowDeleteDialog(data.Id)}
                  />
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
                                    {formatTwoDecimals(child.Item_Rate)}
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
