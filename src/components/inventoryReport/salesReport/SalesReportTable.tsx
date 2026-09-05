"use client";

import { TableEmptyState } from "@/components/ui/table-empty-state";
import { ShoppingCart } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import { SalesReportTableProps } from "@/types/inventoryReport/SalesReportTypes";
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
import { FC, Fragment } from "react";

const SalesReportTable: FC<SalesReportTableProps> = ({
  loading,
  salesReportData,
}) => {
  return (
    <Table
      removeWrapper
      aria-label="Example static collection table"
      topContent={
        <div>
          <h2 className="text-[15px] font-semibold text-foreground">
            Sales report
          </h2>
          <p className="text-sm text-muted-foreground">
            Search and review sales report entries.
          </p>
        </div>
      }

      classNames={tableClassNames}
    >
      <TableHeader>
        <TableColumn className="w-[50px]">Sl. No.</TableColumn>
        <TableColumn align="center">Sales Description</TableColumn>
        <TableColumn align="center">Design Name</TableColumn>
        <TableColumn align="center">Quantity</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={
          <TableEmptyState
            icon={ShoppingCart}
            entity="sales records"
          />
        }
        loadingContent={<Spinner size="lg" color="primary" />}
        loadingState={loading ? "loading" : "idle"}
      >
        {(salesReportData || []).map((data, index) => (
          <Fragment key={data.Id}>
            {/* Key is added here */}
            {/* Date Row */}
            <TableRow className="border">
              <TableCell colSpan={4} className="text-center">
                {data?.Sales_Date
                  ? format(new Date(data?.Sales_Date), "dd-MM-yyyy")
                  : ""}
              </TableCell>
              <TableCell className="hidden"> </TableCell>
              <TableCell className="hidden"> </TableCell>
              <TableCell className="hidden"> </TableCell>
            </TableRow>
            {/* Sales Info Row */}
            <TableRow className="border">
              <TableCell
                rowSpan={data?.Design_Data.length}
                className="text-center border"
              >
                {index + 1}
              </TableCell>
              <TableCell
                rowSpan={data?.Design_Data.length}
                className="space-y-1 border"
              >
                <p>Sales No : {data?.Sale_No}</p>
                <p>Party Name : {data?.Party_Name}</p>
                <p>Amount : {data?.Amount}</p>
              </TableCell>
              <TableCell>{data.Design_Data[0].Design_Name}</TableCell>
              <TableCell>{data.Design_Data[0].Qnty}</TableCell>
            </TableRow>
            {/* Additional Design Rows */}
            {data?.Design_Data.slice(1).map((design) => (
              <TableRow key={`design-${data.Id}-${design.Design_Id}`}>
                <TableCell className="hidden"> </TableCell>
                <TableCell className="hidden"> </TableCell>
                <TableCell>{design.Design_Name}</TableCell>
                <TableCell className="border">{design.Qnty}</TableCell>
              </TableRow>
            ))}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default SalesReportTable;
