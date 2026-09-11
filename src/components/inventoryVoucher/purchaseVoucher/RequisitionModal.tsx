"use client";

import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { tableClassNames } from "@/lib/uiStyles";
import {
  ItemRequisitionRow,
  RequisitionModalProps,
} from "@/types/inventoryVoucher/PurchaseVoucherTypes";
import { formatTwoDecimals } from "@/utils/formatDecimal";
import {
  Checkbox,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { ClipboardList } from "lucide-react";
import { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

interface PurchaseVoucherState {
  itemRequisitionData: ItemRequisitionRow[];
}

interface RootState {
  purchaseVoucher: PurchaseVoucherState;
}

const rowKey = (row: ItemRequisitionRow, index: number) =>
  row.Row_Key ||
  [
    "req",
    row.Req_Id,
    row.Order_No,
    row.Req_No,
    row.Item_Id,
    row.Id,
    index,
  ]
    .filter((part) => part !== undefined && part !== null && part !== "")
    .join("-");

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

  useEffect(() => {
    if (!isOpen) {
      setSelectedKeys([]);
    }
  }, [isOpen]);

  const allRowKeys = useMemo(
    () => itemRequisitionData.map((row, index) => rowKey(row, index)),
    [itemRequisitionData]
  );

  const selectedRows = useMemo(
    () =>
      itemRequisitionData.filter((row, index) =>
        selectedKeys.includes(rowKey(row, index))
      ),
    [itemRequisitionData, selectedKeys]
  );

  const isAllSelected =
    allRowKeys.length > 0 && allRowKeys.every((key) => selectedKeys.includes(key));
  const isIndeterminate =
    selectedKeys.length > 0 && !isAllSelected;

  const toggleRow = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const toggleSelectAll = (selected: boolean) => {
    setSelectedKeys(selected ? allRowKeys : []);
  };

  return (
    <FormModal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
      <FormModalHeader
        title="Item Requisition list"
        description="Select requisition items to add to this ordered purchase."
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
                aria-label="Select all requisition items"
                isSelected={isAllSelected}
                isIndeterminate={isIndeterminate}
                isDisabled={allRowKeys.length === 0 || loading}
                onValueChange={toggleSelectAll}
              />
            </TableColumn>
            <TableColumn key="serial">Serial No.</TableColumn>
            <TableColumn key="orderNo">Order / Req. No.</TableColumn>
            <TableColumn key="party">Party Name</TableColumn>
            <TableColumn key="item">Item Name</TableColumn>
            <TableColumn key="quantity" align="center">
              Quantity
            </TableColumn>
            <TableColumn key="rate" align="center">
              Rate
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <TableEmptyState
                icon={ClipboardList}
                entity="requisition items"
              />
            }
            loadingContent={<Spinner size="lg" color="primary" />}
            loadingState={loading ? "loading" : "idle"}
          >
            {itemRequisitionData.map((row, index) => {
              const key = rowKey(row, index);
              return (
                <TableRow key={key}>
                  <TableCell>
                    <Checkbox
                      key={`check-${key}`}
                      isSelected={selectedKeys.includes(key)}
                      onValueChange={() => toggleRow(key)}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.Order_No || row.Req_No || ""}</TableCell>
                  <TableCell>{row.Party_Name || ""}</TableCell>
                  <TableCell>{row.Item_Name || ""}</TableCell>
                  <TableCell>
                    {formatTwoDecimals(
                      row.Item_Qnty ?? row.Qnty ?? row.Quantity,
                      "",
                    )}
                  </TableCell>
                  <TableCell>
                    {formatTwoDecimals(
                      row.Item_Rate ?? row.Rate ?? row.Pur_Rate,
                      "",
                    )}
                  </TableCell>
                </TableRow>
              );
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
