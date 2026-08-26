"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { FileSpreadsheet } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import { cn } from "@/lib/utils";
import {
  SalesVoucherTableData,
  SalesVoucherTableProps,
} from "@/types/inventoryVoucher/SalesVoucherTypes";
import { formatTwoDecimals } from "@/utils/formatDecimal";
import {
  Checkbox,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { format } from "date-fns";
import { FC, Fragment, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";

interface SalesVoucherState {
  salesVoucherData: SalesVoucherTableData[];
}

interface RootState {
  salesVoucher: SalesVoucherState;
}

const SalesVoucherTable: FC<SalesVoucherTableProps> = ({
  parentSelected,
  setParentSelected,
  selected,
  handleIsSelected,
}) => {
  const [openRows, setOpenRows] = useState<Record<number, boolean>>({});

  // Toggle row visibility
  const toggleRow = (id: number) => {
    setOpenRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const salesVoucherData: SalesVoucherTableData[] = useSelector(
    (state: RootState) => state?.salesVoucher?.salesVoucherData
  );

  const isRowSelected = (data: SalesVoucherTableData) =>
    selected.some((row) => row.Id === data.Id);

  const { search, setSearch, filtered } = useClientTableSearch(salesVoucherData);

  return (
    <Table
      removeWrapper
      aria-label="Example static collection table"
      // selectionMode="multiple"
      // bottomContent={
      //   salesVoucherData?.length > 0 && (
      //     <Pagination
      //       isCompact
      //       showControls
      //       showShadow
      //       color="primary"
      //       page={1}
      //       total={10}
      //       // onChange={(page) => setPage(page)}
      //     />
      //   )
      // }
      topContent={
        <TableSearchInput
          title="Sales vouchers"
          description="Search and select vouchers to process."
          value={search}
          onValueChange={setSearch}
          placeholder="Search voucher"
          />
      }

      classNames={tableClassNames}
    >
      <TableHeader>
        <TableColumn className="w-[100px]"> </TableColumn>
        <TableColumn className="w-[70px]">Serial No.</TableColumn>
        <TableColumn align="center" className="w-[100px]">
          Order Date
        </TableColumn>
        <TableColumn align="center">Order No.</TableColumn>
        <TableColumn align="center">Party Name</TableColumn>
        <TableColumn align="center">Order Amount</TableColumn>
        <TableColumn align="center">Order Status</TableColumn>
        <TableColumn align="center" className="w-[100px]">
          <Tooltip content="Select All" color="primary">
            <Checkbox
              isSelected={parentSelected}
              onValueChange={setParentSelected}
            />
          </Tooltip>
        </TableColumn>
      </TableHeader>
      <TableBody emptyContent={<TableEmptyState icon={FileSpreadsheet} entity="sales vouchers" search={search} />}>
        {filtered.map((data, index) => (
          <Fragment key={data.Id}>
            <TableRow>
              <TableCell>
                <FaChevronRight
                  onClick={() => toggleRow(index)}
                  className={`transition-all duration-200 text-medium cursor-pointer ${
                    openRows[index] ? "rotate-90" : "rotate-0"
                  }`}
                />
              </TableCell>
              <TableCell className="w-[100px]">{index + 1}</TableCell>
              <TableCell>{format(data.Order_Date, "dd-MM-yyyy")}</TableCell>
              <TableCell>{data.Order_No}</TableCell>
              <TableCell>{data.Party_Name}</TableCell>
              <TableCell>{data.Total_Order}</TableCell>
              <TableCell>
                <Chip
                  className="capitalize"
                  color={
                    data.Order_Status === "Product Ready"
                      ? "success"
                      : "warning"
                  }
                  size="md"
                  variant="flat"
                >
                  {data.Order_Status}
                </Chip>
              </TableCell>
              <TableCell>
                <Checkbox
                  isSelected={isRowSelected(data)}
                  onValueChange={() => handleIsSelected(data)}
                />
              </TableCell>
            </TableRow>
            {openRows[index] && (
              <Fragment>
                <TableRow className="border-x border-t">
                  <TableCell className="font-medium w-[100px]">
                    Design Name
                  </TableCell>
                  <TableCell className="font-medium w-[70px]">
                    Design No
                  </TableCell>
                  <TableCell className="font-medium w-[100px]">
                    Order Quantity
                  </TableCell>
                  <TableCell className="font-medium">Design Rate</TableCell>
                  <TableCell className="font-medium">Wt</TableCell>
                  <TableCell className="font-medium">Total Wt</TableCell>
                  <TableCell className="font-medium">Polish</TableCell>
                  <TableCell className="font-medium">Total Polish</TableCell>
                </TableRow>
                <TableRow className="border-x">
                  <TableCell>{data.DesignRow[0].Design_Name}</TableCell>
                  <TableCell>{data.DesignRow[0].Design_No}</TableCell>
                  <TableCell>
                    {formatTwoDecimals(data.DesignRow[0].Order_Qnty)}
                  </TableCell>
                  <TableCell>
                    {formatTwoDecimals(data.DesignRow[0].Design_Rate)}
                  </TableCell>
                  <TableCell>
                    {formatTwoDecimals(data.DesignRow[0].Wt)}
                  </TableCell>
                  <TableCell>
                    {formatTwoDecimals(data.DesignRow[0].Tot_Wt)}
                  </TableCell>
                  <TableCell>
                    {formatTwoDecimals(data.DesignRow[0].Polish)}
                  </TableCell>
                  <TableCell className="w-[100px]">
                    {formatTwoDecimals(data.DesignRow[0].Tot_Polish)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-x">
                  <TableCell colSpan={2} className="w-[100px] font-medium">
                    Item Name
                  </TableCell>
                  <TableCell className="hidden"> </TableCell>
                  <TableCell className="font-medium">Item Quantity</TableCell>
                  <TableCell className="font-medium">Item Rate</TableCell>
                  <TableCell className="font-medium">Item Total</TableCell>
                  <TableCell className="hidden"> </TableCell>
                  <TableCell className="hidden"> </TableCell>
                  <TableCell className="hidden"> </TableCell>
                </TableRow>
                {data.DesignRow[0].ItemRow.map((child, i) => (
                  <TableRow
                    key={i}
                    className={cn("border-x", {
                      "border-b": data.DesignRow[0].ItemRow.length === i + 1,
                    })}
                  >
                    <TableCell colSpan={2} className="w-[100px]">
                      {child.Item_Name}
                    </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell>
                      {formatTwoDecimals(child.Item_Qnty)}
                    </TableCell>
                    <TableCell>
                      {formatTwoDecimals(child.Item_Rate)}
                    </TableCell>
                    <TableCell>
                      {formatTwoDecimals(child.Item_Tot)}
                    </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
};
export default SalesVoucherTable;
