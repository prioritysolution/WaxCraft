"use client";

import { TableEmptyState } from "@/components/ui/table-empty-state";
import { ShoppingBag } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import { PurchaseReportTableProps } from "@/types/inventoryReport/PurchaseReportTypes";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { format } from "date-fns";
import { FC } from "react";

const PurchaseReportTable: FC<PurchaseReportTableProps> = ({
  loading,
  purchaseReportData,
}) => {
  return (
    <Table
      removeWrapper
      aria-label="Purchase report table"
      topContent={
        <div>
          <h2 className="text-[15px] font-semibold text-foreground">
            Purchase report
          </h2>
          <p className="text-sm text-muted-foreground">
            Search and review purchase report entries.
          </p>
        </div>
      }
      classNames={tableClassNames}
    >
      <TableHeader>
        <TableColumn className="w-[50px]">Sl. No.</TableColumn>
        <TableColumn align="center">Purchase Description</TableColumn>
        <TableColumn align="center">Item Name</TableColumn>
        <TableColumn align="center">Quantity</TableColumn>
        <TableColumn align="center">Rate</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={
          <TableEmptyState icon={ShoppingBag} entity="purchase records" />
        }
        loadingContent={<Spinner size="lg" color="primary" />}
        loadingState={loading ? "loading" : "idle"}
      >
        {(purchaseReportData || []).flatMap((data, index) => {
          const items = data.Item_Data || [];
          const firstItem = items[0];
          const extraItems = items.slice(1);
          const purchaseDate = data?.Purchase_Date
            ? format(new Date(data.Purchase_Date), "dd-MM-yyyy")
            : "";

          return [
            <TableRow key={`date-${data.Id}`}>
              <TableCell
                colSpan={5}
                className="bg-[#F7F5F3] text-center font-semibold"
              >
                {purchaseDate}
              </TableCell>
            </TableRow>,
            <TableRow key={`purchase-${data.Id}`}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell className="space-y-1">
                <p>Purchase No : {data?.Purchase_No}</p>
                <p>Party Name : {data?.Party_Name}</p>
                <p>Amount : {data?.Amount}</p>
              </TableCell>
              <TableCell>{firstItem?.Item_Name || ""}</TableCell>
              <TableCell>{firstItem?.Qnty || ""}</TableCell>
              <TableCell>{firstItem?.Item_Rate || ""}</TableCell>
            </TableRow>,
            ...extraItems.map((item, itemIndex) => (
              <TableRow key={`item-${data.Id}-${item.Item_Id}-${itemIndex}`}>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
                <TableCell>{item.Item_Name}</TableCell>
                <TableCell>{item.Qnty}</TableCell>
                <TableCell>{item.Item_Rate}</TableCell>
              </TableRow>
            )),
          ];
        })}
      </TableBody>
    </Table>
  );
};

export default PurchaseReportTable;
