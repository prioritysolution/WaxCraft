"use client";

import {
  chunkRows,
  PrintOrgHeader,
  PrintPage,
  PrintPreviewModal,
} from "@/components/ui/print-report";
import { PreviewModalProps } from "@/types/inventoryReport/SalesReportTypes";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const SALES_PER_PAGE = 4;

const PreviewModal: FC<PreviewModalProps> = ({
  salesReportData,
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
    documentTitle: "Sales Report",
  });

  const pages = useMemo(
    () => chunkRows(salesReportData, SALES_PER_PAGE),
    [salesReportData],
  );

  return (
    <PrintPreviewModal
      isOpen={showPrintDialog}
      onOpenChange={setShowPrintDialog}
      printRef={printRef}
      documentTitle="Sales Report"
      onPrint={() => generatePDF()}
    >
      {pages.map((pageRows, pageIndex) => {
        const startIndex = pageIndex * SALES_PER_PAGE;

        return (
          <PrintPage
            key={`sales-report-${pageIndex}`}
            pageNo={pageIndex + 1}
            totalPages={pages.length}
          >
            <PrintOrgHeader
              orgName={orgName}
              orgAddress={orgAddress}
              title={`Sales Report From ${fromDate} To ${toDate}`}
              compact={pageIndex > 0}
            />
            <div className="space-y-4 px-5 py-4">
              {pageRows.map((data, index) => (
                <div
                  key={data.Id}
                  className="overflow-hidden rounded-xl border border-black/[0.08]"
                >
                  <div className="bg-[#F7F5F3] px-4 py-2 text-center text-sm font-semibold">
                    {data?.Sales_Date
                      ? format(data?.Sales_Date, "dd-MM-yyyy")
                      : ""}
                  </div>
                  <div className="grid grid-cols-[80px_1.2fr_1fr] gap-px bg-black/[0.06] text-sm">
                    <div className="bg-white px-3 py-2 font-medium">
                      {startIndex + index + 1}
                    </div>
                    <div className="space-y-1 bg-white px-3 py-2">
                      <p>Sales No : {data?.Sale_No}</p>
                      <p>Party Name : {data?.Party_Name}</p>
                      <p>Amount : {data?.Amount}</p>
                    </div>
                    <div className="bg-white">
                      {data.Design_Data.map((design) => (
                        <div
                          key={design.Design_Id}
                          className="flex items-center justify-between border-b border-black/[0.05] px-3 py-2 last:border-b-0"
                        >
                          <span>{design.Design_Name}</span>
                          <span className="tabular-nums">{design.Qnty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PrintPage>
        );
      })}
    </PrintPreviewModal>
  );
};
export default PreviewModal;
