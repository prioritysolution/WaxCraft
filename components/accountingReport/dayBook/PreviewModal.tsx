"use client";

import {
  chunkPairedRows,
  PrintOrgHeader,
  PrintPage,
  PrintPreviewModal,
  PRINT_SPLIT_ROWS_PER_PAGE,
  printTdClass,
  printThClass,
  printTheadClass,
  printTotalRowClass,
} from "@/components/ui/print-report";
import { PreviewModalProps } from "@/types/accountingReport/DayBookTypes";
import getCookieData from "@/utils/getCookieData";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

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
      onPrint={() => generatePDF()}
    >
      {pages.map((page, pageIndex) => (
        <PrintPage
          key={`day-book-${pageIndex}`}
          pageNo={pageIndex + 1}
          totalPages={pages.length}
        >
          <PrintOrgHeader
            orgName={orgName}
            orgAddress={orgAddress}
            title={`Day Book As On ${asOnDate}`}
            compact={pageIndex > 0}
          />
          <div className="grid flex-1 grid-cols-2 gap-4 px-5 py-4">
            <table className="h-fit w-full border-collapse overflow-hidden rounded-xl border border-black/[0.08] text-xs">
              <thead className={printTheadClass}>
                <tr>
                  <th rowSpan={2} className={printThClass}>
                    V. No.
                  </th>
                  <th rowSpan={2} className={printThClass}>
                    Particulars
                  </th>
                  <th colSpan={3} className={`${printThClass} text-center`}>
                    Receipt
                  </th>
                </tr>
                <tr>
                  <th className={`${printThClass} text-right`}>Cash</th>
                  <th className={`${printThClass} text-right`}>Transfer</th>
                  <th className={`${printThClass} text-right`}>Total</th>
                </tr>
              </thead>
              <tbody>
                {page.left.map((data, index) => (
                  <tr key={`receipt-${index}`}>
                    <td className={printTdClass}>{data?.Vouch_No}</td>
                    <td className={printTdClass}>{data?.Ledger_Name}</td>
                    <td className={`${printTdClass} text-right`}>
                      {data?.Cash_Amt}
                    </td>
                    <td className={`${printTdClass} text-right`}>
                      {data?.Trf_Amt}
                    </td>
                    <td className={`${printTdClass} text-right`}>
                      {data?.Tot_Amt}
                    </td>
                  </tr>
                ))}
                {page.isLast ? (
                  <>
                    <tr className={printTotalRowClass}>
                      <td className="px-3 py-2" />
                      <td className="px-3 py-2">Total</td>
                      <td className="px-3 py-2 text-right">{totalReceiptCash}</td>
                      <td className="px-3 py-2 text-right">
                        {totalReceiptTransfer}
                      </td>
                      <td className="px-3 py-2 text-right">{totalReceiptTotal}</td>
                    </tr>
                    <tr>
                      <td className={printTdClass} />
                      <td className={printTdClass}>Opening Cash Balance</td>
                      <td className={`${printTdClass} text-right`}>
                        {dayBookData[0]?.Opening_Cash}
                      </td>
                      <td className={`${printTdClass} text-right`} />
                      <td className={`${printTdClass} text-right`} />
                    </tr>
                    <tr className={printTotalRowClass}>
                      <td className="px-3 py-2" />
                      <td className="px-3 py-2">Grand Total</td>
                      <td className="px-3 py-2 text-right">
                        {totalReceiptCash +
                          Number(dayBookData[0]?.Opening_Cash || "0")}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {totalReceiptTransfer}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {totalReceiptCash +
                          totalReceiptTransfer +
                          Number(dayBookData[0]?.Opening_Cash || "0")}
                      </td>
                    </tr>
                  </>
                ) : null}
              </tbody>
            </table>

            <table className="h-fit w-full border-collapse overflow-hidden rounded-xl border border-black/[0.08] text-xs">
              <thead className={printTheadClass}>
                <tr>
                  <th rowSpan={2} className={printThClass}>
                    V. No.
                  </th>
                  <th rowSpan={2} className={printThClass}>
                    Particulars
                  </th>
                  <th colSpan={3} className={`${printThClass} text-center`}>
                    Payment
                  </th>
                </tr>
                <tr>
                  <th className={`${printThClass} text-right`}>Cash</th>
                  <th className={`${printThClass} text-right`}>Transfer</th>
                  <th className={`${printThClass} text-right`}>Total</th>
                </tr>
              </thead>
              <tbody>
                {page.right.map((data, index) => (
                  <tr key={`payment-${index}`}>
                    <td className={printTdClass}>{data?.Vouch_No}</td>
                    <td className={printTdClass}>{data?.Ledger_Name}</td>
                    <td className={`${printTdClass} text-right`}>
                      {data?.Cash_Amt}
                    </td>
                    <td className={`${printTdClass} text-right`}>
                      {data?.Trf_Amt}
                    </td>
                    <td className={`${printTdClass} text-right`}>
                      {data?.Tot_Amt}
                    </td>
                  </tr>
                ))}
                {page.isLast ? (
                  <>
                    <tr className={printTotalRowClass}>
                      <td className="px-3 py-2" />
                      <td className="px-3 py-2">Total</td>
                      <td className="px-3 py-2 text-right">{totalPaymentCash}</td>
                      <td className="px-3 py-2 text-right">
                        {totalPaymentTransfer}
                      </td>
                      <td className="px-3 py-2 text-right">{totalPaymentTotal}</td>
                    </tr>
                    <tr>
                      <td className={printTdClass} />
                      <td className={printTdClass}>Closing Cash Balance</td>
                      <td className={`${printTdClass} text-right`}>
                        {dayBookData[0]?.Closing_Cash}
                      </td>
                      <td className={`${printTdClass} text-right`} />
                      <td className={`${printTdClass} text-right`} />
                    </tr>
                    <tr className={printTotalRowClass}>
                      <td className="px-3 py-2" />
                      <td className="px-3 py-2">Grand Total</td>
                      <td className="px-3 py-2 text-right">
                        {totalPaymentCash +
                          Number(dayBookData[0]?.Closing_Cash || "0")}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {totalPaymentTransfer}
                      </td>
                      <td className="px-3 py-2 text-right">
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
