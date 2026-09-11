"use client";

import { CashBookTableProps } from "@/types/accountingReport/CashBookTypes";
import { FC } from "react";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { Wallet } from "lucide-react";
import { ResultsCard, SplitTableCard } from "@/components/ui/page-shell";
import {
  reportTableCellClassName,
  reportTableFooterClassName,
  reportTableHeadClassName,
} from "@/lib/uiStyles";
import { cn } from "@/lib/utils";

const cashBookColumns = [
  "Voucher No.",
  "Man. Voucher No.",
  "Ledger",
  "Particulars",
  "Amount",
];

const CashBookTable: FC<CashBookTableProps> = ({
  cashBookData,
  totalReceiptAmount,
  totalPaymentAmount,
}) => {
  const receipts = cashBookData[0]?.Receipt_Data || [];
  const payments = cashBookData[0]?.Payment_Data || [];

  return (
    <ResultsCard
      title="Cash book"
      description="Search receipts and payments."
    >
      <div className="flex w-full flex-col gap-4 xl:flex-row">
        <SplitTableCard>
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr>
                {cashBookColumns.map((column) => (
                  <th key={column} className={reportTableHeadClassName}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {receipts.length === 0 ? (
                <tr>
                  <td colSpan={5} className={cn(reportTableCellClassName, "py-8")}>
                    <TableEmptyState
                      icon={Wallet}
                      entity="receipts"
                    />
                  </td>
                </tr>
              ) : (
                receipts.map((data, index) => (
                  <tr key={index} className="hover:bg-[#F7F5F3]/80">
                    <td className={reportTableCellClassName}>{data?.Vouch_No}</td>
                    <td className={reportTableCellClassName}>
                      {data?.Manual_Voucher}
                    </td>
                    <td className={reportTableCellClassName}>
                      {data?.Ledger_Name}
                    </td>
                    <td className={reportTableCellClassName}>
                      {data?.Particular}
                    </td>
                    <td className={cn(reportTableCellClassName, "text-right")}>
                      {data?.Amount}
                    </td>
                  </tr>
                ))
              )}
              <tr>
                <td colSpan={4} className={reportTableFooterClassName}>
                  Total
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {totalReceiptAmount}
                </td>
              </tr>
              <tr>
                <td colSpan={4} className={reportTableFooterClassName}>
                  Opening Cash Balance
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {cashBookData[0]?.Opening_Cash}
                </td>
              </tr>
              <tr>
                <td colSpan={4} className={reportTableFooterClassName}>
                  Grand Total
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {totalReceiptAmount +
                    Number(cashBookData[0]?.Opening_Cash || "0")}
                </td>
              </tr>
            </tbody>
          </table>
        </SplitTableCard>

        <SplitTableCard>
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr>
                {cashBookColumns.map((column) => (
                  <th key={column} className={reportTableHeadClassName}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className={cn(reportTableCellClassName, "py-8")}>
                    <TableEmptyState
                      icon={Wallet}
                      entity="payments"
                    />
                  </td>
                </tr>
              ) : (
                payments.map((data, index) => (
                  <tr key={index} className="hover:bg-[#F7F5F3]/80">
                    <td className={reportTableCellClassName}>{data?.Vouch_No}</td>
                    <td className={reportTableCellClassName}>
                      {data?.Manual_Voucher}
                    </td>
                    <td className={reportTableCellClassName}>
                      {data?.Ledger_Name}
                    </td>
                    <td className={reportTableCellClassName}>
                      {data?.Particular}
                    </td>
                    <td className={cn(reportTableCellClassName, "text-right")}>
                      {data?.Amount}
                    </td>
                  </tr>
                ))
              )}
              <tr>
                <td colSpan={4} className={reportTableFooterClassName}>
                  Total
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {totalPaymentAmount}
                </td>
              </tr>
              <tr>
                <td colSpan={4} className={reportTableFooterClassName}>
                  Closing Cash Balance
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {cashBookData[0]?.Closing_Cash}
                </td>
              </tr>
              <tr>
                <td colSpan={4} className={reportTableFooterClassName}>
                  Grand Total
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {totalPaymentAmount +
                    Number(cashBookData[0]?.Closing_Cash || "0")}
                </td>
              </tr>
            </tbody>
          </table>
        </SplitTableCard>
      </div>
    </ResultsCard>
  );
};
export default CashBookTable;
