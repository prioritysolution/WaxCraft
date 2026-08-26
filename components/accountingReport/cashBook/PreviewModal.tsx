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
import { PreviewModalProps } from "@/types/accountingReport/CashBookTypes";
import getCookieData from "@/utils/getCookieData";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

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
      onPrint={() => generatePDF()}
    >
      {pages.map((page, pageIndex) => (
        <PrintPage
          key={`cash-book-${pageIndex}`}
          pageNo={pageIndex + 1}
          totalPages={pages.length}
        >
          <PrintOrgHeader
            orgName={orgName}
            orgAddress={orgAddress}
            title={`Cash Book As On ${asOnDate}`}
            compact={pageIndex > 0}
          />
          <div className="grid flex-1 grid-cols-2 gap-4 px-5 py-4">
            <table className="h-fit w-full border-collapse overflow-hidden rounded-xl border border-black/[0.08] text-xs">
              <thead className={printTheadClass}>
                <tr>
                  <th className={printThClass}>V. No.</th>
                  <th className={printThClass}>Man. V. No.</th>
                  <th className={printThClass}>Ledger</th>
                  <th className={printThClass}>Particulars</th>
                  <th className={`${printThClass} text-right`}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {page.left.map((data, index) => (
                  <tr key={`receipt-${index}`}>
                    <td className={printTdClass}>{data?.Vouch_No}</td>
                    <td className={printTdClass}>{data?.Manual_Voucher}</td>
                    <td className={printTdClass}>{data?.Ledger_Name}</td>
                    <td className={printTdClass}>{data?.Particular}</td>
                    <td className={`${printTdClass} text-right`}>{data?.Amount}</td>
                  </tr>
                ))}
                {page.isLast ? (
                  <>
                    <tr className={printTotalRowClass}>
                      <td colSpan={4} className="px-3 py-2 text-center">
                        Total
                      </td>
                      <td className="px-3 py-2 text-right">{totalReceiptAmount}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className={`${printTdClass} text-center`}>
                        Opening Cash Balance
                      </td>
                      <td className={`${printTdClass} text-right`}>
                        {cashBookData[0]?.Opening_Cash}
                      </td>
                    </tr>
                    <tr className={printTotalRowClass}>
                      <td colSpan={4} className="px-3 py-2 text-center">
                        Grand Total
                      </td>
                      <td className="px-3 py-2 text-right">
                        {totalReceiptAmount +
                          Number(cashBookData[0]?.Opening_Cash || "0")}
                      </td>
                    </tr>
                  </>
                ) : null}
              </tbody>
            </table>

            <table className="h-fit w-full border-collapse overflow-hidden rounded-xl border border-black/[0.08] text-xs">
              <thead className={printTheadClass}>
                <tr>
                  <th className={printThClass}>V. No.</th>
                  <th className={printThClass}>Man. V. No.</th>
                  <th className={printThClass}>Ledger</th>
                  <th className={printThClass}>Particulars</th>
                  <th className={`${printThClass} text-right`}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {page.right.map((data, index) => (
                  <tr key={`payment-${index}`}>
                    <td className={printTdClass}>{data?.Vouch_No}</td>
                    <td className={printTdClass}>{data?.Manual_Voucher}</td>
                    <td className={printTdClass}>{data?.Ledger_Name}</td>
                    <td className={printTdClass}>{data?.Particular}</td>
                    <td className={`${printTdClass} text-right`}>{data?.Amount}</td>
                  </tr>
                ))}
                {page.isLast ? (
                  <>
                    <tr className={printTotalRowClass}>
                      <td colSpan={4} className="px-3 py-2 text-center">
                        Total
                      </td>
                      <td className="px-3 py-2 text-right">{totalPaymentAmount}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className={`${printTdClass} text-center`}>
                        Closing Cash Balance
                      </td>
                      <td className={`${printTdClass} text-right`}>
                        {cashBookData[0]?.Closing_Cash}
                      </td>
                    </tr>
                    <tr className={printTotalRowClass}>
                      <td colSpan={4} className="px-3 py-2 text-center">
                        Grand Total
                      </td>
                      <td className="px-3 py-2 text-right">
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
