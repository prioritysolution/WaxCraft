"use client";

import {
  chunkRows,
  PrintOrgHeader,
  PrintPage,
  PrintPreviewModal,
  PRINT_ROWS_PER_PAGE,
  printTdClass,
  printThClass,
  printTheadClass,
} from "@/components/ui/print-report";
import { PreviewModalProps } from "@/types/inventoryReport/OrderBookTypes";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const PreviewModal: FC<PreviewModalProps> = ({
  orderBookData,
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
    documentTitle: "Order Book",
  });

  const pages = useMemo(
    () => chunkRows(orderBookData, PRINT_ROWS_PER_PAGE),
    [orderBookData],
  );

  return (
    <PrintPreviewModal
      isOpen={showPrintDialog}
      onOpenChange={setShowPrintDialog}
      printRef={printRef}
      documentTitle="Order Book"
      onPrint={() => generatePDF()}
    >
      {pages.map((pageRows, pageIndex) => {
        const startIndex = pageIndex * PRINT_ROWS_PER_PAGE;

        return (
          <PrintPage
            key={`order-book-${pageIndex}`}
            pageNo={pageIndex + 1}
            totalPages={pages.length}
          >
            <PrintOrgHeader
              orgName={orgName}
              orgAddress={orgAddress}
              title={`Order Booking Register From ${fromDate} To ${toDate}`}
              compact={pageIndex > 0}
            />
            <div className="px-5 py-4">
              <table className="w-full border-collapse overflow-hidden rounded-xl border border-black/[0.08]">
                <thead className={printTheadClass}>
                  <tr>
                    <th className={printThClass}>Sl. No.</th>
                    <th className={printThClass}>Order Date</th>
                    <th className={printThClass}>Order No.</th>
                    <th className={printThClass}>Party Name</th>
                    <th className={printThClass}>Design Name</th>
                    <th className={`${printThClass} text-right`}>Quantity</th>
                    <th className={`${printThClass} text-right`}>Amount</th>
                    <th className={printThClass}>Material Source</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((data, index) => (
                    <tr key={data.Id}>
                      <td className={printTdClass}>{startIndex + index + 1}</td>
                      <td className={printTdClass}>
                        {data?.Order_Date
                          ? format(data?.Order_Date, "dd-MM-yyyy")
                          : ""}
                      </td>
                      <td className={printTdClass}>{data?.Order_No}</td>
                      <td className={printTdClass}>{data?.Party_Name}</td>
                      <td className={printTdClass}>{data?.Design_Name}</td>
                      <td className={`${printTdClass} text-right`}>
                        {data?.Order_Qnty}
                      </td>
                      <td className={`${printTdClass} text-right`}>
                        {data?.Order_Amount}
                      </td>
                      <td className={printTdClass}>{data?.Order_Type}</td>
                    </tr>
                  ))}
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
