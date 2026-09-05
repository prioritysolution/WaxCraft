"use client";

import {
  chunkPairedRows,
  PrintOrgHeader,
  PrintPage,
  PrintPreviewModal,
  PRINT_SPLIT_ROWS_PER_PAGE,
} from "@/components/ui/print-report";
import { PreviewModalProps } from "@/types/accountingReport/TrailorCashbookTypes";
import getCookieData from "@/utils/getCookieData";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const trailorThClass =
  "border border-black/30 px-2 py-1.5 text-left align-middle text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground";
const trailorTdClass =
  "border border-black/25 px-2 py-1.5 align-middle text-xs text-foreground break-words";
const trailorTotalTdClass =
  "border border-black/30 bg-[#F7F5F3] px-2 py-1.5 align-middle text-xs font-semibold text-foreground";

const PreviewModal: FC<PreviewModalProps> = ({
  trailorCashbookData,
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
    documentTitle: "Trailor Cashbook",
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
        trailorCashbookData[0]?.Receipt_Data,
        trailorCashbookData[0]?.Payment_Data,
        PRINT_SPLIT_ROWS_PER_PAGE,
      ),
    [trailorCashbookData],
  );

  return (
    <PrintPreviewModal
      isOpen={showPrintDialog}
      onOpenChange={setShowPrintDialog}
      printRef={printRef}
      documentTitle="Trailor Cashbook"
      orientation="landscape"
      onPrint={() => generatePDF()}
    >
      {pages.map((page, pageIndex) => (
        <PrintPage
          key={`trailor-cashbook-${pageIndex}`}
          pageNo={pageIndex + 1}
          totalPages={pages.length}
          orientation="landscape"
        >
          <PrintOrgHeader
            orgName={orgName}
            orgAddress={orgAddress}
            title={`Trailor Cashbook As On ${asOnDate}`}
            compact={pageIndex > 0}
          />
          <div className="grid flex-1 grid-cols-2 gap-4 px-5 py-4">
            <table className="h-fit w-full table-fixed border-collapse border border-black/40 text-xs">
              <colgroup>
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[24%]" />
                <col className="w-[30%]" />
                <col className="w-[18%]" />
              </colgroup>
              <thead className="bg-[#F7F5F3]">
                <tr>
                  <th className={trailorThClass}>V. No.</th>
                  <th className={trailorThClass}>Man. V. No.</th>
                  <th className={trailorThClass}>Ledger</th>
                  <th className={trailorThClass}>Particulars</th>
                  <th className={`${trailorThClass} text-right`}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {page.left.map((data, index) => (
                  <tr key={`receipt-${index}`}>
                    <td className={trailorTdClass}>{data?.Vouch_No}</td>
                    <td className={trailorTdClass}>{data?.Manual_Voucher}</td>
                    <td className={trailorTdClass}>{data?.Ledger_Name}</td>
                    <td className={trailorTdClass}>{data?.Particular}</td>
                    <td className={`${trailorTdClass} text-right whitespace-nowrap`}>
                      {data?.Amount}
                    </td>
                  </tr>
                ))}
                {page.isLast ? (
                  <>
                    <tr>
                      <td
                        colSpan={4}
                        className={`${trailorTotalTdClass} text-center`}
                      >
                        Total
                      </td>
                      <td className={`${trailorTotalTdClass} text-right`}>
                        {totalReceiptAmount}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={4}
                        className={`${trailorTdClass} text-center`}
                      >
                        Opening Cash Balance
                      </td>
                      <td className={`${trailorTdClass} text-right whitespace-nowrap`}>
                        {trailorCashbookData[0]?.Opening_Cash}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={4}
                        className={`${trailorTotalTdClass} text-center`}
                      >
                        Grand Total
                      </td>
                      <td className={`${trailorTotalTdClass} text-right`}>
                        {totalReceiptAmount +
                          Number(trailorCashbookData[0]?.Opening_Cash || "0")}
                      </td>
                    </tr>
                  </>
                ) : null}
              </tbody>
            </table>

            <table className="h-fit w-full table-fixed border-collapse border border-black/40 text-xs">
              <colgroup>
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[24%]" />
                <col className="w-[30%]" />
                <col className="w-[18%]" />
              </colgroup>
              <thead className="bg-[#F7F5F3]">
                <tr>
                  <th className={trailorThClass}>V. No.</th>
                  <th className={trailorThClass}>Man. V. No.</th>
                  <th className={trailorThClass}>Ledger</th>
                  <th className={trailorThClass}>Particulars</th>
                  <th className={`${trailorThClass} text-right`}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {page.right.map((data, index) => (
                  <tr key={`payment-${index}`}>
                    <td className={trailorTdClass}>{data?.Vouch_No}</td>
                    <td className={trailorTdClass}>{data?.Manual_Voucher}</td>
                    <td className={trailorTdClass}>{data?.Ledger_Name}</td>
                    <td className={trailorTdClass}>{data?.Particular}</td>
                    <td className={`${trailorTdClass} text-right whitespace-nowrap`}>
                      {data?.Amount}
                    </td>
                  </tr>
                ))}
                {page.isLast ? (
                  <>
                    <tr>
                      <td
                        colSpan={4}
                        className={`${trailorTotalTdClass} text-center`}
                      >
                        Total
                      </td>
                      <td className={`${trailorTotalTdClass} text-right`}>
                        {totalPaymentAmount}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={4}
                        className={`${trailorTdClass} text-center`}
                      >
                        Closing Cash Balance
                      </td>
                      <td className={`${trailorTdClass} text-right whitespace-nowrap`}>
                        {trailorCashbookData[0]?.Closing_Cash}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={4}
                        className={`${trailorTotalTdClass} text-center`}
                      >
                        Grand Total
                      </td>
                      <td className={`${trailorTotalTdClass} text-right`}>
                        {totalPaymentAmount +
                          Number(trailorCashbookData[0]?.Closing_Cash || "0")}
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
