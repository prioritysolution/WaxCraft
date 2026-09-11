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
import { formatTableSerial } from "@/components/ui/table-edit-button";
import { DesignTableData } from "@/types/master/DesignTypes";
import { getDesignTotalRate } from "@/utils/designTotalRate";
import { formatTwoDecimals } from "@/utils/formatDecimal";
import getCookieData from "@/utils/getCookieData";
import { Image } from "@heroui/react";
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

interface PreviewModalProps {
  designData: DesignTableData[];
  showPrintDialog: boolean;
  setShowPrintDialog: Dispatch<SetStateAction<boolean>>;
  currentPage: number;
  perPage: number;
}

const PreviewModal: FC<PreviewModalProps> = ({
  designData,
  showPrintDialog,
  setShowPrintDialog,
  currentPage,
  perPage,
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
    documentTitle: "Design List",
  });

  const pages = useMemo(
    () => chunkRows(designData, PRINT_ROWS_PER_PAGE),
    [designData],
  );

  return (
    <PrintPreviewModal
      isOpen={showPrintDialog}
      onOpenChange={setShowPrintDialog}
      printRef={printRef}
      documentTitle="Design List"
      onPrint={() => generatePDF()}
    >
      {pages.map((pageRows, pageIndex) => {
        const startIndex = pageIndex * PRINT_ROWS_PER_PAGE;

        return (
          <PrintPage
            key={`design-list-${pageIndex}`}
            pageNo={pageIndex + 1}
            totalPages={pages.length}
          >
            <PrintOrgHeader
              orgName={orgName}
              orgAddress={orgAddress}
              title="Design List"
              compact={pageIndex > 0}
            />
            <div className="px-5 py-4">
              <table className="w-full border-collapse overflow-hidden rounded-xl border border-black/[0.08]">
                <thead className={printTheadClass}>
                  <tr>
                    <th className={printThClass}>Serial No.</th>
                    <th className={printThClass}>Design Name</th>
                    <th className={printThClass}>Design No</th>
                    <th className={`${printThClass} text-right`}>WT</th>
                    <th className={`${printThClass} text-right`}>Polish</th>
                    <th className={`${printThClass} text-right`}>Total Rate</th>
                    <th className={`${printThClass} text-center`}>Design Image</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((data, index) => (
                    <tr key={data.Id || startIndex + index}>
                      <td className={printTdClass}>
                        {formatTableSerial(startIndex + index, {
                          currentPage,
                          perPage,
                        })}
                      </td>
                      <td className={printTdClass}>{data.Design_Name || "—"}</td>
                      <td className={printTdClass}>{data.Design_No || "—"}</td>
                      <td className={`${printTdClass} text-right`}>
                        {formatTwoDecimals(data.WT)}
                      </td>
                      <td className={`${printTdClass} text-right`}>
                        {formatTwoDecimals(data.Polish)}
                      </td>
                      <td className={`${printTdClass} text-right`}>
                        {formatTwoDecimals(getDesignTotalRate(data))}
                      </td>
                      <td className={`${printTdClass} text-center`}>
                        {data.image ? (
                          <div className="mx-auto flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-[#F7F5F3]">
                            <Image
                              alt={data.Design_Name || "Design"}
                              src={data.image}
                              className="h-10 w-10 object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!pageRows.length ? (
                    <tr>
                      <td
                        colSpan={7}
                        className={`${printTdClass} py-8 text-center text-muted-foreground`}
                      >
                        No designs found.
                      </td>
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
