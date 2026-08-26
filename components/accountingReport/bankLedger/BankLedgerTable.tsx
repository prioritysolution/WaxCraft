"use client";

import { tableClassNames } from "@/lib/uiStyles";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { Landmark } from "lucide-react";

import { BankLedgerTableProps } from "@/types/accountingReport/BankLedgerTypes";
import {
  Card,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { format } from "date-fns";
import { FC } from "react";

const BankLedgerTable: FC<BankLedgerTableProps> = ({ bankLedgerData }) => {
  const transactionData = bankLedgerData[0]?.Transaction_Data || [];

  return (
    <div className="w-full">
      {bankLedgerData.length > 0 && (
        <Card
          radius="sm"
          className="w-full  p-2 px-5 mb-2 grid grid-cols-1 sm:grid-cols-2 text-sm gap-y-3 "
          classNames={{ base: "bg-blue-100" }}
        >
          <p>
            <span className="font-semibold">Bank Name :</span>{" "}
            {bankLedgerData[0]?.Bank_Name}
          </p>
          <p>
            <span className="font-semibold">Branch Name :</span>{" "}
            {bankLedgerData[0]?.Branch_Name}
          </p>
          <p>
            <span className="font-semibold">IFSC :</span>{" "}
            {bankLedgerData[0]?.Bank_IFSC}
          </p>
          <p>
            <span className="font-semibold">Account No. :</span>{" "}
            {bankLedgerData[0]?.Account_No}
          </p>
        </Card>
      )}
      <Table
        removeWrapper
        aria-label="Example static collection table"
        bottomContent={
          transactionData.length > 0 && (
            <div className="flex w-full justify-end">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={1}
                total={10}
                // onChange={(page) => setPage(page)}
              />
            </div>
          )
        }
        classNames={tableClassNames}
        topContent={
          <div>
            <h2 className="text-[15px] font-semibold text-foreground">
              Bank ledger
            </h2>
            <p className="text-sm text-muted-foreground">
              Search and review bank ledger entries.
            </p>
          </div>
        }
      >
        <TableHeader>
          <TableColumn className="w-[50px]">Sl. No.</TableColumn>
          <TableColumn align="center">Trans. Date</TableColumn>
          <TableColumn align="center">Particular</TableColumn>
          <TableColumn align="center">Debit</TableColumn>
          <TableColumn align="center">Credit</TableColumn>
          <TableColumn align="center">Balance</TableColumn>
        </TableHeader>
        <TableBody emptyContent={<TableEmptyState icon={Landmark} entity="bank ledger entries" />}>
          {transactionData.length > 0 ? (
            <>
              {transactionData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell className="w-[100px]">{index + 1}</TableCell>
                  <TableCell>
                    {data?.Trans_Date
                      ? format(new Date(data?.Trans_Date), "dd-MM-yyyy")
                      : ""}
                  </TableCell>
                  <TableCell>{data?.Particular}</TableCell>
                  <TableCell>{data?.Debit}</TableCell>
                  <TableCell>{data?.Credit}</TableCell>
                  <TableCell>
                    {data?.Balance} {data?.Balance_Type === "C" ? "Cr" : "Dr"}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell colSpan={3} className="font-semibold">
                  Total
                </TableCell>
                <TableCell>
                  {bankLedgerData[0]?.Transaction_Data.reduce((sum, entry) => {
                    return sum + (parseFloat(entry.Debit) || 0); // Convert Debit to float, default to 0 if null
                  }, 0)}
                </TableCell>
                <TableCell>
                  {bankLedgerData[0]?.Transaction_Data.reduce((sum, entry) => {
                    return sum + (parseFloat(entry.Credit) || 0); // Convert Debit to float, default to 0 if null
                  }, 0)}
                </TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="py-10">
                <TableEmptyState
                  icon={Landmark}
                  entity="bank ledger entries"
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
export default BankLedgerTable;
