"use client";

import { TableEmptyState } from "@/components/ui/table-empty-state";
import { BookOpen } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import { AccountLedgerTableProps } from "@/types/accountingReport/AccountLedgerTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { format } from "date-fns";
import { FC } from "react";

const AccountLedgerTable: FC<AccountLedgerTableProps> = ({
  accountLedgerData,
}) => {
  return (
    <Table
      removeWrapper
      aria-label="Example static collection table"
      topContent={
        <div>
          <h2 className="text-[15px] font-semibold text-foreground">
            Account ledger
          </h2>
          <p className="text-sm text-muted-foreground">
            Search and review account ledger entries.
          </p>
        </div>
      }

      classNames={tableClassNames}
    >
      <TableHeader>
        <TableColumn className="w-[50px]">Sl. No.</TableColumn>
        <TableColumn align="center">Trans. Date</TableColumn>
        <TableColumn align="center">Voucher No.</TableColumn>
        <TableColumn align="center">Particular</TableColumn>
        <TableColumn align="center">Debit</TableColumn>
        <TableColumn align="center">Credit</TableColumn>
        <TableColumn align="center">Balance</TableColumn>
      </TableHeader>
      <TableBody emptyContent={<TableEmptyState icon={BookOpen} entity="ledger entries" />}>
        {accountLedgerData?.length > 0 ? (
          <>
            {accountLedgerData.map((data, index) => (
              <TableRow key={index}>
                <TableCell className="w-[50px]">{index + 1}</TableCell>
                <TableCell>
                  {data?.Trans_Date
                    ? format(new Date(data?.Trans_Date), "dd-MM-yyyy")
                    : ""}
                </TableCell>
                <TableCell>{data?.Vouch_No}</TableCell>
                <TableCell>{data?.Particular}</TableCell>
                <TableCell>{data?.Debit}</TableCell>
                <TableCell>{data?.Credit}</TableCell>
                <TableCell>
                  {data?.Balance} {data?.Balance_Type === "C" ? "Cr" : "Dr"}
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={4} className="font-semibold">
                Total
              </TableCell>
              <TableCell>
                {accountLedgerData?.reduce((sum, entry) => {
                  return sum + (parseFloat(entry.Debit) || 0); // Convert Debit to float, default to 0 if null
                }, 0)}
              </TableCell>
              <TableCell>
                {accountLedgerData?.reduce((sum, entry) => {
                  return sum + (parseFloat(entry.Credit) || 0); // Convert Debit to float, default to 0 if null
                }, 0)}
              </TableCell>
              <TableCell> </TableCell>
            </TableRow>
          </>
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="py-10">
              <TableEmptyState
                icon={BookOpen}
                entity="ledger entries"
              />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
export default AccountLedgerTable;
