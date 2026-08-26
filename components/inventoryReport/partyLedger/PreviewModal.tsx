"use client";

import {
  chunkRows,
  PrintMetaGrid,
  PrintOrgHeader,
  PrintPage,
  PrintPreviewModal,
  PRINT_ROWS_PER_PAGE,
  printTdClass,
  printThClass,
  printTheadClass,
  printTotalRowClass,
} from "@/components/ui/print-report";
import { PreviewModalProps } from "@/types/inventoryReport/PartyLedgerTypes";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const PreviewModal: FC<PreviewModalProps> = ({
  partyLedgerData,
  showPrintDialog,
  setShowPrintDialog,
  fromDate,
  toDate,
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
    documentTitle: "Party Ledger",
  });

  const ledgerRows = partyLedgerData[0]?.Ledger_Data || [];
  const pages = useMemo(
    () => chunkRows(ledgerRows, PRINT_ROWS_PER_PAGE),
    [ledgerRows],
  );

  const debitTotal = ledgerRows.reduce((sum, entry) => {
    return sum + (parseFloat(entry.Debit) || 0);
  }, 0);
  const creditTotal = ledgerRows.reduce((sum, entry) => {
    return sum + (parseFloat(entry.Credit) || 0);
  }, 0);

  return (
    <PrintPreviewModal
      isOpen={showPrintDialog}
      onOpenChange={setShowPrintDialog}
      printRef={printRef}
      documentTitle="Party Ledger"
      onPrint={() => generatePDF()}
    >
      {pages.map((pageRows, pageIndex) => {
        const startIndex = pageIndex * PRINT_ROWS_PER_PAGE;
        const isLastPage = pageIndex === pages.length - 1;

        return (
          <PrintPage
            key={`party-ledger-${pageIndex}`}
            pageNo={pageIndex + 1}
            totalPages={pages.length}
          >
            <PrintOrgHeader
              orgName={orgName}
              orgAddress={orgAddress}
              title={`Party Ledger From ${fromDate} To ${toDate}`}
              compact={pageIndex > 0}
            />
            <PrintMetaGrid
              items={[
                { label: "Party Name", value: partyLedgerData[0]?.Party_Name },
                { label: "Party Address", value: partyLedgerData[0]?.Party_Add },
                { label: "Party GSTIN", value: partyLedgerData[0]?.Party_Gst },
                { label: "Party Mobile", value: partyLedgerData[0]?.Party_Mob },
              ]}
            />
            <div className="px-5 py-4">
              <table className="w-full border-collapse overflow-hidden rounded-xl border border-black/[0.08]">
                <thead className={printTheadClass}>
                  <tr>
                    <th className={printThClass}>Sl. No.</th>
                    <th className={printThClass}>Trans. Date</th>
                    <th className={printThClass}>Particular</th>
                    <th className={`${printThClass} text-right`}>Debit</th>
                    <th className={`${printThClass} text-right`}>Credit</th>
                    <th className={`${printThClass} text-right`}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((data, index) => (
                    <tr key={startIndex + index}>
                      <td className={printTdClass}>{startIndex + index + 1}</td>
                      <td className={printTdClass}>
                        {data?.Trans_Date
                          ? format(data?.Trans_Date, "dd-MM-yyyy")
                          : ""}
                      </td>
                      <td className={printTdClass}>{data?.Particular}</td>
                      <td className={`${printTdClass} text-right`}>{data?.Debit}</td>
                      <td className={`${printTdClass} text-right`}>
                        {data?.Credit}
                      </td>
                      <td className={`${printTdClass} text-right`}>
                        {data?.Balance} {data?.Balance_Type === "C" ? "Cr" : "Dr"}
                      </td>
                    </tr>
                  ))}
                  {isLastPage && ledgerRows.length > 0 ? (
                    <tr className={printTotalRowClass}>
                      <td colSpan={3} className="px-3 py-2 text-center">
                        Total
                      </td>
                      <td className="px-3 py-2 text-right">{debitTotal}</td>
                      <td className="px-3 py-2 text-right">{creditTotal}</td>
                      <td className="px-3 py-2" />
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </PrintPage>
        );
      })}
    </PrintPreviewModal>
  );
};
export default PreviewModal;
