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
import { PreviewModalProps } from "@/types/inventoryReport/PartyItemLedgerTypes";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const PreviewModal: FC<PreviewModalProps> = ({
  partyItemLedgerData,
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
    documentTitle: "Party Item Ledger",
  });

  const pages = useMemo(() => {
    const items = partyItemLedgerData[0]?.ItemData || [];
    const result: {
      itemName: string;
      rows: (typeof items)[number]["Trans_Details"];
      isLastForItem: boolean;
      issueTotal: number;
      refundTotal: number;
    }[] = [];

    items.forEach(({ Item_Name, Trans_Details }) => {
      const chunks = chunkRows(Trans_Details, PRINT_ROWS_PER_PAGE);
      const issueTotal = Trans_Details.reduce(
        (sum, entry) => sum + (entry.Issue || 0),
        0,
      );
      const refundTotal = Trans_Details.reduce(
        (sum, entry) => sum + (entry.Balance || 0),
        0,
      );

      chunks.forEach((rows, index) => {
        result.push({
          itemName: Item_Name,
          rows,
          isLastForItem: index === chunks.length - 1,
          issueTotal,
          refundTotal,
        });
      });
    });

    return result.length ? result : [{ itemName: "", rows: [], isLastForItem: true, issueTotal: 0, refundTotal: 0 }];
  }, [partyItemLedgerData]);

  return (
    <PrintPreviewModal
      isOpen={showPrintDialog}
      onOpenChange={setShowPrintDialog}
      printRef={printRef}
      documentTitle="Party Item Ledger"
      onPrint={() => generatePDF()}
    >
      {pages.map((page, pageIndex) => (
        <PrintPage
          key={`party-item-ledger-${pageIndex}`}
          pageNo={pageIndex + 1}
          totalPages={pages.length}
        >
          <PrintOrgHeader
            orgName={orgName}
            orgAddress={orgAddress}
            title={`Party Item Ledger From ${fromDate} To ${toDate}`}
            compact={pageIndex > 0}
          />
          <PrintMetaGrid
            items={[
              { label: "Party Name", value: partyItemLedgerData[0]?.Party_Name },
              { label: "Party Address", value: partyItemLedgerData[0]?.Party_Add },
              { label: "Party GSTIN", value: partyItemLedgerData[0]?.Party_Gst },
              { label: "Party Mobile", value: partyItemLedgerData[0]?.Party_Mob },
            ]}
          />
          <div className="px-5 py-4">
            {page.itemName ? (
              <h3 className="mb-3 text-center text-sm font-semibold">
                {page.itemName}
              </h3>
            ) : null}
            <table className="w-full border-collapse overflow-hidden rounded-xl border border-black/[0.08]">
              <thead className={printTheadClass}>
                <tr>
                  <th className={printThClass}>Sl. No.</th>
                  <th className={printThClass}>Trans. Date</th>
                  <th className={printThClass}>Particular</th>
                  <th className={`${printThClass} text-right`}>Issue</th>
                  <th className={`${printThClass} text-right`}>Refund</th>
                  <th className={`${printThClass} text-right`}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {page.rows.map((data, index) => (
                  <tr key={index}>
                    <td className={printTdClass}>{index + 1}</td>
                    <td className={printTdClass}>
                      {data?.Trans_Date
                        ? format(data?.Trans_Date, "dd-MM-yyyy")
                        : ""}
                    </td>
                    <td className={printTdClass}>{data?.Particular}</td>
                    <td className={`${printTdClass} text-right`}>{data?.Issue}</td>
                    <td className={`${printTdClass} text-right`}>{data?.Refund}</td>
                    <td className={`${printTdClass} text-right`}>
                      {data?.Balance}
                    </td>
                  </tr>
                ))}
                {page.isLastForItem && page.rows.length > 0 ? (
                  <tr className={printTotalRowClass}>
                    <td colSpan={3} className="px-3 py-2 text-center">
                      Total
                    </td>
                    <td className="px-3 py-2 text-right">{page.issueTotal}</td>
                    <td className="px-3 py-2 text-right">{page.refundTotal}</td>
                    <td className="px-3 py-2" />
                  </tr>
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
