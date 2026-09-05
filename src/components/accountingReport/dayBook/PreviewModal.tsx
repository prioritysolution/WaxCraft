"use client";

import {
  chunkPairedRows,
  PrintOrgHeader,
  PrintPage,
  PrintPreviewModal,
  PRINT_SPLIT_ROWS_PER_PAGE,
} from "@/components/ui/print-report";
import { PreviewModalProps } from "@/types/accountingReport/DayBookTypes";
import getCookieData from "@/utils/getCookieData";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const dayBookThClass =
  "border border-black/30 px-2 py-1.5 text-left align-middle text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground";
const dayBookTdClass =
  "border border-black/25 px-2 py-1.5 align-middle text-xs text-foreground";
const dayBookTotalTdClass =
  "border border-black/30 bg-[#F7F5F3] px-2 py-1.5 align-middle text-xs font-semibold text-foreground";

const PreviewModal: FC<PreviewModalProps> = ({
  dayBookData,
  showPrintDialog,
  setShowPrintDialog,
  asOnDate,
  totalReceiptCash,
  totalReceiptTransfer,
  totalReceiptTotal,
  totalPaymentCash,
  totalPaymentTransfer,
  totalPaymentTotal,
}) => {
  const [orgName, setOrgName] = useState<string | null>(null);
  const [orgAddress, setOrgAddress] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgName(getCookieData<string | null>("waxCraftClientOrgName"));
      setOrgAddress(getCookieData<string | null>("waxCraftClientOrgAddress"));
    }
  }, []);

  const generatePDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Day Book",
    pageStyle: `
      @page { size: A4 landscape; margin: 0; }
      @media print {
        html, body { margin: 0 !important; padding: 0 !important; }
      }
    `,
  });

  const pages = useMemo(
    () =>
      chunkPairedRows(
        dayBookData[0]?.Receipt_Data,
        dayBookData[0]?.Payment_Data,
        PRINT_SPLIT_ROWS_PER_PAGE,
      ),
    [dayBookData],
  );

  return (
    <PrintPreviewModal
      isOpen={showPrintDialog}
      onOpenChange={setShowPrintDialog}
      printRef={printRef}
      documentTitle="Day Book"
      orientation="landscape"
      onPrint={() => generatePDF()}
    >
      {pages.map((page, pageIndex) => (
        <PrintPage
          key={`day-book-${pageIndex}`}
          pageNo={pageIndex + 1}
          totalPages={pages.length}
          orientation="landscape"
        >
          <PrintOrgHeader
            orgName={orgName}
            orgAddress={orgAddress}
            title={`Day Book As On ${asOnDate}`}
            compact={pageIndex > 0}
          />
          <div className="grid flex-1 grid-cols-2 gap-4 px-5 py-4">
            <table className="h-fit w-full border-collapse border border-black/40 text-xs">
              <thead className="bg-[#F7F5F3]">
                <tr>
                  <th rowSpan={2} className={dayBookThClass}>
                    V. No.
                  </th>
                  <th rowSpan={2} className={dayBookThClass}>
                    Particulars
                  </th>
                  <th colSpan={3} className={`${dayBookThClass} text-center`}>
                    Receipt
                  </th>
                </tr>
                <tr>
                  <th className={`${dayBookThClass} text-right`}>Cash</th>
                  <th className={`${dayBookThClass} text-right`}>Transfer</th>
                  <th className={`${dayBookThClass} text-right`}>Total</th>
                </tr>
              </thead>
              <tbody>
                {page.left.map((data, index) => (
                  <tr key={`receipt-${index}`}>
                    <td className={dayBookTdClass}>{data?.Vouch_No}</td>
                    <td className={dayBookTdClass}>{data?.Ledger_Name}</td>
                    <td className={`${dayBookTdClass} text-right`}>
                      {data?.Cash_Amt}
                    </td>
                    <td className={`${dayBookTdClass} text-right`}>
                      {data?.Trf_Amt}
                    </td>
                    <td className={`${dayBookTdClass} text-right`}>
                      {data?.Tot_Amt}
                    </td>
                  </tr>
                ))}
                {page.isLast ? (
                  <>
                    <tr>
                      <td className={dayBookTotalTdClass} />
                      <td className={dayBookTotalTdClass}>Total</td>
                      <td className={`${dayBookTotalTdClass} text-right`}>
                        {totalReceiptCash}
                      </td>
                      <td className={`${dayBookTotalTdClass} text-right`}>
                        {totalReceiptTransfer}
                      </td>
                      <td className={`${dayBookTotalTdClass} text-right`}>
                        {totalReceiptTotal}
                      </td>
                    </tr>
                    <tr>
                      <td className={dayBookTdClass} />
                      <td className={dayBookTdClass}>Opening Cash Balance</td>
                      <td className={`${dayBookTdClass} text-right`}>
                        {dayBookData[0]?.Opening_Cash}
                      </td>
                      <td className={`${dayBookTdClass} text-right`} />
                      <td className={`${dayBookTdClass} text-right`} />
                    </tr>
                    <tr>
                      <td className={dayBookTotalTdClass} />
                      <td className={dayBookTotalTdClass}>Grand Total</td>
                      <td className={`${dayBookTotalTdClass} text-right`}>
                        {totalReceiptCash +
                          Number(dayBookData[0]?.Opening_Cash || "0")}
                      </td>
                      <td className={`${dayBookTotalTdClass} text-right`}>
                        {totalReceiptTransfer}
                      </td>
                      <td className={`${dayBookTotalTdClass} text-right`}>
                        {totalReceiptCash +
                          totalReceiptTransfer +
                          Number(dayBookData[0]?.Opening_Cash || "0")}
                      </td>
                    </tr>
                  </>
                ) : null}
              </tbody>
            </table>

            <table className="h-fit w-full border-collapse border border-black/40 text-xs">
              <thead className="bg-[#F7F5F3]">
                <tr>
                  <th rowSpan={2} className={dayBookThClass}>
                    V. No.
                  </th>
                  <th rowSpan={2} className={dayBookThClass}>
                    Particulars
                  </th>
                  <th colSpan={3} className={`${dayBookThClass} text-center`}>
                    Payment
                  </th>
                </tr>
                <tr>
                  <th className={`${dayBookThClass} text-right`}>Cash</th>
                  <th className={`${dayBookThClass} text-right`}>Transfer</th>
                  <th className={`${dayBookThClass} text-right`}>Total</th>
                </tr>
              </thead>
              <tbody>
                {page.right.map((data, index) => (
                  <tr key={`payment-${index}`}>
                    <td className={dayBookTdClass}>{data?.Vouch_No}</td>
                    <td className={dayBookTdClass}>{data?.Ledger_Name}</td>
                    <td className={`${dayBookTdClass} text-right`}>
                      {data?.Cash_Amt}
                    </td>
                    <td className={`${dayBookTdClass} text-right`}>
                      {data?.Trf_Amt}
                    </td>
                    <td className={`${dayBookTdClass} text-right`}>
                      {data?.Tot_Amt}
                    </td>
                  </tr>
                ))}
                {page.isLast ? (
                  <>
                    <tr>
                      <td className={dayBookTotalTdClass} />
                      <td className={dayBookTotalTdClass}>Total</td>
                      <td className={`${dayBookTotalTdClass} text-right`}>
                        {totalPaymentCash}
                      </td>
                      <td className={`${dayBookTotalTdClass} text-right`}>
                        {totalPaymentTransfer}
                      </td>
                      <td className={`${dayBookTotalTdClass} text-right`}>
                        {totalPaymentTotal}
                      </td>
                    </tr>
                    <tr>
                      <td className={dayBookTdClass} />
                      <td className={dayBookTdClass}>Closing Cash Balance</td>
                      <td className={`${dayBookTdClass} text-right`}>
                        {dayBookData[0]?.Closing_Cash}
                      </td>
                      <td className={`${dayBookTdClass} text-right`} />
                      <td className={`${dayBookTdClass} text-right`} />
                    </tr>
                    <tr>
                      <td className={dayBookTotalTdClass} />
                      <td className={dayBookTotalTdClass}>Grand Total</td>
                      <td className={`${dayBookTotalTdClass} text-right`}>
                        {totalPaymentCash +
                          Number(dayBookData[0]?.Closing_Cash || "0")}
                      </td>
                      <td className={`${dayBookTotalTdClass} text-right`}>
                        {totalPaymentTransfer}
                      </td>
                      <td className={`${dayBookTotalTdClass} text-right`}>
                        {totalPaymentCash +
                          totalPaymentTransfer +
                          Number(dayBookData[0]?.Closing_Cash || "0")}
                      </td>
                    </tr>
                  </>
                ) : null}
              </tbody>
            </table>
          </div>
        </PrintPage>
      ))}
    </PrintPreviewModal>
  );
};
export default PreviewModal;
