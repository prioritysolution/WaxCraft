"use client";

import { DayBookTableProps } from "@/types/accountingReport/DayBookTypes";
import { FC } from "react";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { CalendarDays } from "lucide-react";
import { ResultsCard, SplitTableCard } from "@/components/ui/page-shell";
import {
  reportTableCellClassName,
  reportTableFooterClassName,
  reportTableHeadClassName,
} from "@/lib/uiStyles";
import { cn } from "@/lib/utils";

const DayBookTable: FC<DayBookTableProps> = ({
  dayBookData,
  totalReceiptCash,
  totalReceiptTransfer,
  totalReceiptTotal,
  totalPaymentCash,
  totalPaymentTransfer,
  totalPaymentTotal,
}) => {
  const receipts = dayBookData[0]?.Receipt_Data || [];
  const payments = dayBookData[0]?.Payment_Data || [];

  return (
    <ResultsCard
      title="Day book"
      description="Search daily receipts and payments."
    >
      <div className="flex w-full flex-col gap-4 xl:flex-row">
        <SplitTableCard>
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr>
                <th
                  rowSpan={2}
                  className={cn(reportTableHeadClassName, "w-[70px]")}
                >
                  V. No.
                </th>
                <th rowSpan={2} className={reportTableHeadClassName}>
                  Particulars
                </th>
                <th colSpan={3} className={reportTableHeadClassName}>
                  Receipt
                </th>
              </tr>
              <tr>
                <th className={reportTableHeadClassName}>Cash</th>
                <th className={reportTableHeadClassName}>Transfer</th>
                <th className={reportTableHeadClassName}>Total</th>
              </tr>
            </thead>
            <tbody>
              {receipts.length === 0 ? (
                <tr>
                  <td colSpan={5} className={cn(reportTableCellClassName, "py-8")}>
                    <TableEmptyState
                      icon={CalendarDays}
                      entity="receipts"
                    />
                  </td>
                </tr>
              ) : (
                receipts.map((data, index) => (
                  <tr key={index} className="hover:bg-[#F7F5F3]/80">
                    <td className={cn(reportTableCellClassName, "w-[70px]")}>
                      {data?.Vouch_No}
                    </td>
                    <td className={reportTableCellClassName}>
                      {data?.Ledger_Name}
                    </td>
                    <td className={cn(reportTableCellClassName, "text-right")}>
                      {data?.Cash_Amt}
                    </td>
                    <td className={cn(reportTableCellClassName, "text-right")}>
                      {data?.Trf_Amt}
                    </td>
                    <td className={cn(reportTableCellClassName, "text-right")}>
                      {data?.Tot_Amt}
                    </td>
                  </tr>
                ))
              )}
              <tr>
                <td colSpan={2} className={reportTableFooterClassName}>
                  Total
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {totalReceiptCash}
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {totalReceiptTransfer}
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {totalReceiptTotal}
                </td>
              </tr>
              <tr>
                <td colSpan={2} className={reportTableFooterClassName}>
                  Opening Cash Balance
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {dayBookData[0]?.Opening_Cash}
                </td>
                <td className={reportTableFooterClassName}></td>
                <td className={reportTableFooterClassName}></td>
              </tr>
              <tr>
                <td colSpan={2} className={reportTableFooterClassName}>
                  Grand Total
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {totalReceiptCash + Number(dayBookData[0]?.Opening_Cash || "0")}
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {totalReceiptTransfer}
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {totalReceiptCash +
                    totalReceiptTransfer +
                    Number(dayBookData[0]?.Opening_Cash || "0")}
                </td>
              </tr>
            </tbody>
          </table>
        </SplitTableCard>

        <SplitTableCard>
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr>
                <th
                  rowSpan={2}
                  className={cn(reportTableHeadClassName, "w-[70px]")}
                >
                  V. No.
                </th>
                <th rowSpan={2} className={reportTableHeadClassName}>
                  Particulars
                </th>
                <th colSpan={3} className={reportTableHeadClassName}>
                  Payment
                </th>
              </tr>
              <tr>
                <th className={reportTableHeadClassName}>Cash</th>
                <th className={reportTableHeadClassName}>Transfer</th>
                <th className={reportTableHeadClassName}>Total</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className={cn(reportTableCellClassName, "py-8")}>
                    <TableEmptyState
                      icon={CalendarDays}
                      entity="payments"
                    />
                  </td>
                </tr>
              ) : (
                payments.map((data, index) => (
                  <tr key={index} className="hover:bg-[#F7F5F3]/80">
                    <td className={cn(reportTableCellClassName, "w-[70px]")}>
                      {data?.Vouch_No}
                    </td>
                    <td className={reportTableCellClassName}>
                      {data?.Ledger_Name}
                    </td>
                    <td className={cn(reportTableCellClassName, "text-right")}>
                      {data?.Cash_Amt}
                    </td>
                    <td className={cn(reportTableCellClassName, "text-right")}>
                      {data?.Trf_Amt}
                    </td>
                    <td className={cn(reportTableCellClassName, "text-right")}>
                      {data?.Tot_Amt}
                    </td>
                  </tr>
                ))
              )}
              <tr>
                <td colSpan={2} className={reportTableFooterClassName}>
                  Total
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {totalPaymentCash}
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {totalPaymentTransfer}
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {totalPaymentTotal}
                </td>
              </tr>
              <tr>
                <td colSpan={2} className={reportTableFooterClassName}>
                  Closing Cash Balance
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {dayBookData[0]?.Closing_Cash}
                </td>
                <td className={reportTableFooterClassName}></td>
                <td className={reportTableFooterClassName}></td>
              </tr>
              <tr>
                <td colSpan={2} className={reportTableFooterClassName}>
                  Grand Total
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {totalPaymentCash + Number(dayBookData[0]?.Closing_Cash || "0")}
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {totalPaymentTransfer}
                </td>
                <td className={cn(reportTableFooterClassName, "text-right")}>
                  {totalPaymentCash +
                    totalPaymentTransfer +
                    Number(dayBookData[0]?.Closing_Cash || "0")}
                </td>
              </tr>
            </tbody>
          </table>
        </SplitTableCard>
      </div>
    </ResultsCard>
  );
};
export default DayBookTable;
