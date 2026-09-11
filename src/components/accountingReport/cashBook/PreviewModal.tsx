"use client";

import {
  chunkPairedRows,
  PrintOrgHeader,
  PrintPage,
  PrintPreviewModal,
  PRINT_SPLIT_ROWS_PER_PAGE,
} from "@/components/ui/print-report";
import { PreviewModalProps } from "@/types/accountingReport/CashBookTypes";
import getCookieData from "@/utils/getCookieData";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const cashBookThClass =
  "border border-black/30 px-2 py-1.5 text-left align-middle text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground";
const cashBookTdClass =
  "border border-black/25 px-2 py-1.5 align-middle text-xs text-foreground";
const cashBookTotalTdClass =
  "border border-black/30 bg-[#F7F5F3] px-2 py-1.5 align-middle text-xs font-semibold text-foreground";

const PreviewModal: FC<PreviewModalProps> = ({
  cashBookData,
  showPrintDialog,
  setShowPrintDialog,
  asOnDate,
  totalReceiptAmount,
  totalPaymentAmount,
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
    documentTitle: "Cash Book",
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
        cashBookData[0]?.Receipt_Data,
        cashBookData[0]?.Payment_Data,
        PRINT_SPLIT_ROWS_PER_PAGE,
      ),
    [cashBookData],
  );

  return (
    <PrintPreviewModal
      isOpen={showPrintDialog}
      onOpenChange={setShowPrintDialog}
      printRef={printRef}
      documentTitle="Cash Book"
      orientation="landscape"
      onPrint={() => generatePDF()}
    >
      {pages.map((page, pageIndex) => (
        <PrintPage
          key={`cash-book-${pageIndex}`}
          pageNo={pageIndex + 1}
          totalPages={pages.length}
          orientation="landscape"
        >
          <PrintOrgHeader
            orgName={orgName}
            orgAddress={orgAddress}
            title={`Cash Book As On ${asOnDate}`}
            compact={pageIndex > 0}
          />
          <div className="grid flex-1 grid-cols-2 gap-4 px-5 py-4">
            <table className="h-fit w-full border-collapse border border-black/40 text-xs">
              <thead className="bg-[#F7F5F3]">
                <tr>
                  <th className={cashBookThClass}>V. No.</th>
                  <th className={cashBookThClass}>Man. V. No.</th>
                  <th className={cashBookThClass}>Ledger</th>
                  <th className={cashBookThClass}>Particulars</th>
                  <th className={`${cashBookThClass} text-right`}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {page.left.map((data, index) => (
                  <tr key={`receipt-${index}`}>
                    <td className={cashBookTdClass}>{data?.Vouch_No}</td>
                    <td className={cashBookTdClass}>{data?.Manual_Voucher}</td>
                    <td className={cashBookTdClass}>{data?.Ledger_Name}</td>
                    <td className={cashBookTdClass}>{data?.Particular}</td>
                    <td className={`${cashBookTdClass} text-right`}>
                      {data?.Amount}
                    </td>
                  </tr>
                ))}
                {page.isLast ? (
                  <>
                    <tr>
                      <td
                        colSpan={4}
                        className={`${cashBookTotalTdClass} text-center`}
                      >
                        Total
                      </td>
                      <td className={`${cashBookTotalTdClass} text-right`}>
                        {totalReceiptAmount}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={4}
                        className={`${cashBookTdClass} text-center`}
                      >
                        Opening Cash Balance
                      </td>
                      <td className={`${cashBookTdClass} text-right`}>
                        {cashBookData[0]?.Opening_Cash}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={4}
                        className={`${cashBookTotalTdClass} text-center`}
                      >
                        Grand Total
                      </td>
                      <td className={`${cashBookTotalTdClass} text-right`}>
                        {totalReceiptAmount +
                          Number(cashBookData[0]?.Opening_Cash || "0")}
                      </td>
                    </tr>
                  </>
                ) : null}
              </tbody>
            </table>

            <table className="h-fit w-full border-collapse border border-black/40 text-xs">
              <thead className="bg-[#F7F5F3]">
                <tr>
                  <th className={cashBookThClass}>V. No.</th>
                  <th className={cashBookThClass}>Man. V. No.</th>
                  <th className={cashBookThClass}>Ledger</th>
                  <th className={cashBookThClass}>Particulars</th>
                  <th className={`${cashBookThClass} text-right`}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {page.right.map((data, index) => (
                  <tr key={`payment-${index}`}>
                    <td className={cashBookTdClass}>{data?.Vouch_No}</td>
                    <td className={cashBookTdClass}>{data?.Manual_Voucher}</td>
                    <td className={cashBookTdClass}>{data?.Ledger_Name}</td>
                    <td className={cashBookTdClass}>{data?.Particular}</td>
                    <td className={`${cashBookTdClass} text-right`}>
                      {data?.Amount}
                    </td>
                  </tr>
                ))}
                {page.isLast ? (
                  <>
                    <tr>
                      <td
                        colSpan={4}
                        className={`${cashBookTotalTdClass} text-center`}
                      >
                        Total
                      </td>
                      <td className={`${cashBookTotalTdClass} text-right`}>
                        {totalPaymentAmount}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={4}
                        className={`${cashBookTdClass} text-center`}
                      >
                        Closing Cash Balance
                      </td>
                      <td className={`${cashBookTdClass} text-right`}>
                        {cashBookData[0]?.Closing_Cash}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={4}
                        className={`${cashBookTotalTdClass} text-center`}
                      >
                        Grand Total
                      </td>
                      <td className={`${cashBookTotalTdClass} text-right`}>
                        {totalPaymentAmount +
                          Number(cashBookData[0]?.Closing_Cash || "0")}
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
