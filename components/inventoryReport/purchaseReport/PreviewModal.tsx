"use client";

import {
  chunkRows,
  PrintOrgHeader,
  PrintPage,
  PrintPreviewModal,
} from "@/components/ui/print-report";
import { PreviewModalProps } from "@/types/inventoryReport/PurchaseReportTypes";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const PURCHASES_PER_PAGE = 4;

const PreviewModal: FC<PreviewModalProps> = ({
  purchaseReportData,
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
    documentTitle: "Purchase Report",
  });

  const pages = useMemo(
    () => chunkRows(purchaseReportData, PURCHASES_PER_PAGE),
    [purchaseReportData],
  );

  return (
    <PrintPreviewModal
      isOpen={showPrintDialog}
      onOpenChange={setShowPrintDialog}
      printRef={printRef}
      documentTitle="Purchase Report"
      onPrint={() => generatePDF()}
    >
      {pages.map((pageRows, pageIndex) => {
        const startIndex = pageIndex * PURCHASES_PER_PAGE;

        return (
          <PrintPage
            key={`purchase-report-${pageIndex}`}
            pageNo={pageIndex + 1}
            totalPages={pages.length}
          >
            <PrintOrgHeader
              orgName={orgName}
              orgAddress={orgAddress}
              title={`Purchase Report From ${fromDate} To ${toDate}`}
              compact={pageIndex > 0}
            />
            <div className="space-y-4 px-5 py-4">
              {pageRows.map((data, index) => (
                <div
                  key={data.Id}
                  className="overflow-hidden rounded-xl border border-black/[0.08]"
                >
                  <div className="bg-[#F7F5F3] px-4 py-2 text-center text-sm font-semibold">
                    {data?.Purchase_Date
                      ? format(data?.Purchase_Date, "dd-MM-yyyy")
                      : ""}
                  </div>
                  <div className="grid grid-cols-[80px_1.2fr_1fr] gap-px bg-black/[0.06] text-sm">
                    <div className="bg-white px-3 py-2 font-medium">
                      {startIndex + index + 1}
                    </div>
                    <div className="space-y-1 bg-white px-3 py-2">
                      <p>Purchase No : {data?.Purchase_No}</p>
                      <p>Party Name : {data?.Party_Name}</p>
                      <p>Amount : {data?.Amount}</p>
                    </div>
                    <div className="bg-white">
                      {data.Item_Data.map((item, itemIndex) => (
                        <div
                          key={`${data.Id}-${item.Item_Id}-${itemIndex}`}
                          className="flex items-center justify-between gap-3 border-b border-black/[0.05] px-3 py-2 last:border-b-0"
                        >
                          <span>{item.Item_Name}</span>
                          <span className="tabular-nums">{item.Qnty}</span>
                          <span className="tabular-nums">{item.Item_Rate}</span>
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
