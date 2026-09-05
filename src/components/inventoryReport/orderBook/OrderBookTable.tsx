"use client";

import { TableEmptyState } from "@/components/ui/table-empty-state";
import { Notebook } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import { OrderBookTableProps } from "@/types/inventoryReport/OrderBookTypes";
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

const OrderBookTable: FC<OrderBookTableProps> = ({
  loading,
  orderBookData,
}) => {
  return (
    <Table
      removeWrapper
      aria-label="Example static collection table"
      topContent={
        <div>
          <h2 className="text-[15px] font-semibold text-foreground">
            Order book
          </h2>
          <p className="text-sm text-muted-foreground">
            Search and review order book entries.
          </p>
        </div>
      }

      classNames={tableClassNames}
    >
      <TableHeader>
        <TableColumn className="w-[50px]">Sl. No.</TableColumn>
        <TableColumn align="center">Order Date</TableColumn>
        <TableColumn align="center">Order No.</TableColumn>
        <TableColumn align="center">Party Name</TableColumn>
        <TableColumn align="center">Design Name</TableColumn>
        <TableColumn align="center">Quantity</TableColumn>
        <TableColumn align="center">Amount</TableColumn>
        <TableColumn align="center">Material Source</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={
          <TableEmptyState
            icon={Notebook}
            entity="orders"
          />
        }
        loadingContent={<Spinner size="lg" color="primary" />}
        loadingState={loading ? "loading" : "idle"}
      >
        {(orderBookData || []).map((data, index) => (
          <TableRow key={data.Id}>
            <TableCell className="w-[100px]">{index + 1}</TableCell>
            <TableCell>
              {data?.Order_Date ? format(data?.Order_Date, "dd-MM-yyyy") : ""}
            </TableCell>
            <TableCell>{data?.Order_No}</TableCell>
            <TableCell>{data?.Party_Name}</TableCell>
            <TableCell>{data?.Design_Name}</TableCell>
            <TableCell>{data?.Order_Qnty}</TableCell>
            <TableCell>{data?.Order_Amount}</TableCell>
            <TableCell>{data?.Order_Type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default OrderBookTable;
