"use client";

import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { tableClassNames } from "@/lib/uiStyles";
import { cn } from "@/lib/utils";
import {
  ItemRequisitionRow,
  RequisitionModalProps,
} from "@/types/inventoryVoucher/PurchaseVoucherTypes";
import { formatTwoDecimals } from "@/utils/formatDecimal";
import {
  Button,
  Checkbox,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { ChevronRight, ClipboardList } from "lucide-react";
import { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

interface PurchaseVoucherState {
  itemRequisitionData: ItemRequisitionRow[];
}

interface RootState {
  purchaseVoucher: PurchaseVoucherState;
}

interface RequisitionOrderGroup {
  key: string;
  orderNo: string;
  partyName: string;
  rows: ItemRequisitionRow[];
  totalQty: number;
}

const nestedHeadClassName =
  "px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground";
const nestedCellClassName =
  "px-3 py-2.5 text-center text-sm text-foreground";

const pickQuantity = (row: ItemRequisitionRow) =>
  row.Item_Qnty ?? row.Qnty ?? row.Quantity;

const pickRate = (row: ItemRequisitionRow) =>
  row.Item_Rate ?? row.Rate ?? row.Pur_Rate;

const orderKey = (row: ItemRequisitionRow, index: number) =>
  String(row.Order_No || row.Req_No || row.Req_Id || `row-${index}`);

const RequisitionModal: FC<RequisitionModalProps> = ({
  isOpen,
  onOpenChange,
  loading,
  onAddItems,
}) => {
  const itemRequisitionData: ItemRequisitionRow[] = useSelector(
    (state: RootState) => state?.purchaseVoucher?.itemRequisitionData
  );
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedKeys([]);
      setExpandedKey(null);
    }
  }, [isOpen]);

  const orderGroups = useMemo(() => {
    const groups = new Map<string, RequisitionOrderGroup>();
    (itemRequisitionData ?? []).forEach((row, index) => {
      const key = orderKey(row, index);
      const group = groups.get(key) ?? {
        key,
        orderNo: String(row.Order_No || row.Req_No || ""),
        partyName: String(row.Party_Name || ""),
        rows: [],
        totalQty: 0,
      };
      group.rows.push(row);
      group.totalQty += Number(pickQuantity(row)) || 0;
      groups.set(key, group);
    });
    return Array.from(groups.values());
  }, [itemRequisitionData]);

  const allOrderKeys = useMemo(
    () => orderGroups.map((group) => group.key),
    [orderGroups]
  );

  const selectedRows = useMemo(
    () =>
      orderGroups
        .filter((group) => selectedKeys.includes(group.key))
        .flatMap((group) => group.rows),
    [orderGroups, selectedKeys]
  );

  const isAllSelected =
    allOrderKeys.length > 0 &&
    allOrderKeys.every((key) => selectedKeys.includes(key));
  const isIndeterminate = selectedKeys.length > 0 && !isAllSelected;

  const toggleOrder = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const toggleSelectAll = (selected: boolean) => {
    setSelectedKeys(selected ? allOrderKeys : []);
  };

  const toggleExpand = (key: string) => {
    setExpandedKey((current) => (current === key ? null : key));
  };

  return (
    <FormModal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
      <FormModalHeader
        title="Item Requisition list"
        description="Select orders to add all of their items to this ordered purchase."
        onClose={() => onOpenChange(false)}
      />
      <FormModalBody>
        <Table
          removeWrapper
          aria-label="Item requisition list"
          classNames={tableClassNames}
        >
          <TableHeader>
            <TableColumn key="select">
              <Checkbox
                aria-label="Select all requisition orders"
                isSelected={isAllSelected}
                isIndeterminate={isIndeterminate}
                isDisabled={allOrderKeys.length === 0 || loading}
                onValueChange={toggleSelectAll}
              />
            </TableColumn>
            <TableColumn key="expand" className="w-[56px]">
              {" "}
            </TableColumn>
            <TableColumn key="serial">Serial No.</TableColumn>
            <TableColumn key="orderNo">Order / Req. No.</TableColumn>
            <TableColumn key="party">Party Name</TableColumn>
            <TableColumn key="items" align="center">
              Items
            </TableColumn>
            <TableColumn key="quantity" align="center">
              Total Quantity
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <TableEmptyState
                icon={ClipboardList}
                entity="requisition orders"
              />
            }
            loadingContent={<Spinner size="lg" color="primary" />}
            loadingState={loading ? "loading" : "idle"}
          >
            {orderGroups.flatMap((group, index) => {
              const isExpanded = expandedKey === group.key;
              const rows = [
                <TableRow key={group.key}>
                  <TableCell>
                    <Checkbox
                      key={`check-${group.key}`}
                      aria-label={`Select order ${group.orderNo}`}
                      isSelected={selectedKeys.includes(group.key)}
                      onValueChange={() => toggleOrder(group.key)}
                    />
                  </TableCell>
                  <TableCell className="w-[56px]">
                    <Button
                      type="button"
                      isIconOnly
                      size="sm"
                      radius="md"
                      variant="light"
                      aria-expanded={isExpanded}
                      aria-label={
                        isExpanded ? "Collapse order items" : "Expand order items"
                      }
                      className="h-8 w-8 min-w-8 text-muted-foreground"
                      onPress={() => toggleExpand(group.key)}
                    >
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          isExpanded && "rotate-90",
                        )}
                      />
                    </Button>
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{group.orderNo || "—"}</TableCell>
                  <TableCell>{group.partyName || "—"}</TableCell>
                  <TableCell>{group.rows.length}</TableCell>
                  <TableCell>{formatTwoDecimals(group.totalQty, "")}</TableCell>
                </TableRow>,
              ];

              if (isExpanded) {
                rows.push(
                  <TableRow key={`${group.key}-items`}>
                    <TableCell colSpan={7} className="bg-[#F7F5F3]/70 px-5 py-3">
                      <div className="overflow-hidden rounded-xl border border-black/[0.06] bg-white">
                        <table className="w-full border-collapse text-center">
                          <thead>
                            <tr className="bg-[#F7F5F3]/50">
                              <th className={cn(nestedHeadClassName, "w-[50%] text-left")}>
                                Item Name
                              </th>
                              <th className={nestedHeadClassName}>Quantity</th>
                              <th className={nestedHeadClassName}>Rate</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.rows.map((row, itemIndex) => (
                              <tr
                                key={`${group.key}-${row.Item_Id ?? row.Id}-${itemIndex}`}
                                className="border-b border-black/[0.05] last:border-b-0"
                              >
                                <td className={cn(nestedCellClassName, "text-left")}>
                                  {row.Item_Name || ""}
                                </td>
                                <td className={nestedCellClassName}>
                                  {formatTwoDecimals(pickQuantity(row), "")}
                                </td>
                                <td className={nestedCellClassName}>
                                  {formatTwoDecimals(pickRate(row), "")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TableCell>
                  </TableRow>,
                );
              }

              return rows;
            })}
          </TableBody>
        </Table>
      </FormModalBody>
      <FormModalFooter
        onCancel={() => onOpenChange(false)}
        submitLabel="Add To Table"
        submitType="button"
        onSubmitPress={() => onAddItems(selectedRows)}
      />
    </FormModal>
  );
};

export default RequisitionModal;
