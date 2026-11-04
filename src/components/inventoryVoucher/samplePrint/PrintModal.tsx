"use client";

import {
  PrintFooter,
  PrintPreviewModal,
} from "@/components/ui/print-report";
import {
  PrintModalProps,
  SamplePrintDesignPrintData,
  SamplePrintFormData,
} from "@/types/inventoryVoucher/SamplePrintTypes";
import { toRateString } from "@/utils/formatDecimal";
import getCookieData from "@/utils/getCookieData";
import { Image } from "@heroui/react";
import { format } from "date-fns";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";

interface OrderPartyData {
  Id: number;
  Party_Name: string;
}

interface OrderBookingState {
  orderPartyData: OrderPartyData[];
}

interface RootState {
  orderBooking: OrderBookingState;
}

const formatAmount = (value: number) =>
  (Number.isFinite(value) ? value : 0).toFixed(2);

const hasText = (value?: string | number | null) =>
  String(value ?? "").trim() !== "";

const resolveDesignSections = (
  printData: SamplePrintFormData | null
): SamplePrintDesignPrintData[] => {
  if (!printData) return [];
  if (Array.isArray(printData.designs) && printData.designs.length > 0) {
    return printData.designs;
  }
  return [
    {
      designId: printData.designId || "",
      designName: printData.designName || "",
      designNo: printData.designNo || "",
      wt: printData.wt || "",
      wtRate: printData.wtRate || "",
      polish: printData.polish || "",
      ghat: printData.ghat || "",
      image: printData.image || "",
      totalRate: printData.totalRate || "",
      item: printData.item || [],
    },
  ];
};

const DesignPrintSection: FC<{
  design: SamplePrintDesignPrintData;
  imageError: boolean;
  onImageError: () => void;
}> = ({ design, imageError, onImageError }) => {
  const wtTotal = (Number(design.wt) || 0) * (Number(design.wtRate) || 0);
  const itemsTotal =
    design.item?.reduce((sum, item) => {
      return (
        sum +
        (Number(item?.itemQuantity) || 0) *
          ((Number(item?.itemRate) || 0) + (Number(item?.makingRate) || 0))
      );
    }, 0) ?? 0;
  const polishTotal = Number(design.polish) || 0;
  const sectionTotal = wtTotal + itemsTotal + polishTotal;

  const hasImage = hasText(design.image) && !imageError;
  const hasDesignTitle =
    hasText(design.designName) || hasText(design.designNo);
  const hasWeight = hasText(design.wt);
  const hasGhat = hasText(design.ghat) && Number(design.ghat) !== 0;
  const showDesignPanel = hasDesignTitle || hasImage || hasWeight || hasGhat;
  const showWtRow = hasText(design.wt) || hasText(design.wtRate);
  const showPolishRow = hasText(design.polish);
  const itemRows = design.item ?? [];
  const wtSerial = showWtRow ? 1 : 0;

  return (
    <div
      className={
        showDesignPanel
          ? "grid grid-cols-[2.2fr_5fr] items-start gap-6"
          : undefined
      }
    >
      {showDesignPanel && (
        <div className="flex flex-col items-center self-start border border-black bg-white px-4 py-5">
          {hasDesignTitle && (
            <p className="text-center text-sm font-semibold text-black">
              {[design.designName, design.designNo]
                .filter((value) => hasText(value))
                .join(" — ")}
            </p>
          )}
          {hasImage && (
            <div className="mt-4 flex h-[168px] w-[168px] items-center justify-center overflow-hidden bg-white">
              <img
                src={design.image}
                alt=""
                width={168}
                height={168}
                className="h-full w-full object-contain"
                onError={onImageError}
              />
            </div>
          )}
          {hasWeight && (
            <div
              className={
                hasDesignTitle || hasImage ? "mt-4 text-center" : "text-center"
              }
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-black">
                Weight
              </p>
              <p className="mt-1 text-sm font-semibold text-black">
                {design.wt} gm
              </p>
            </div>
          )}
          {hasGhat && (
            <div
              className={
                hasDesignTitle || hasImage || hasWeight
                  ? "mt-4 text-center"
                  : "text-center"
              }
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-black">
                Ghat
              </p>
              <p className="mt-1 text-sm font-semibold text-black">
                {design.ghat}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="min-w-0 overflow-hidden border border-black">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-black bg-white text-[10px] font-medium uppercase tracking-[0.14em] text-black">
              <th className="border-l border-black first:border-l-0 px-3 py-2.5 text-left">Sl No.</th>
              <th className="border-l border-black first:border-l-0 px-3 py-2.5 text-left">Description</th>
              <th className="border-l border-black first:border-l-0 px-3 py-2.5 text-right">Quantity</th>
              <th className="border-l border-black first:border-l-0 px-3 py-2.5 text-right">Item Rate</th>
              <th className="border-l border-black first:border-l-0 px-3 py-2.5 text-right">Making Rate</th>
              <th className="border-l border-black first:border-l-0 px-3 py-2.5 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {showWtRow && (
              <tr className="border-t border-black text-sm">
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 text-black">{wtSerial}</td>
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 font-medium">WT</td>
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 text-right">{design.wt || ""}</td>
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 text-right">{toRateString(design.wtRate)}</td>
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 text-right"></td>
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 text-right font-semibold">
                  {formatAmount(wtTotal)}
                </td>
              </tr>
            )}
            {itemRows.map((item, i) => (
              <tr key={`${item.itemId}-${i}`} className="border-t border-black text-sm">
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 text-black">
                  {wtSerial + i + 1}
                </td>
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 font-medium">
                  {item.itemName || ""}
                </td>
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 text-right">
                  {item.itemQuantity || ""}
                </td>
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 text-right">{toRateString(item.itemRate)}</td>
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 text-right">
                  {toRateString(item.makingRate)}
                </td>
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 text-right font-semibold">
                  {formatAmount(
                    (Number(item.itemQuantity) || 0) *
                      ((Number(item.itemRate) || 0) +
                        (Number(item.makingRate) || 0))
                  )}
                </td>
              </tr>
            ))}
            {showPolishRow && (
              <tr className="border-t border-black text-sm">
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 text-black">
                  {wtSerial + itemRows.length + 1}
                </td>
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 font-medium">Polish</td>
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 text-right">1</td>
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 text-right">{design.polish || ""}</td>
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 text-right"></td>
                <td className="border-l border-black first:border-l-0 px-3 py-2.5 text-right font-semibold">
                  {formatAmount(polishTotal)}
                </td>
              </tr>
            )}
            <tr className="border-t border-black bg-white text-sm font-semibold">
              <td className="border-l border-black first:border-l-0 px-3 py-3" colSpan={5}>
                Design Total
              </td>
              <td className="border-l border-black first:border-l-0 px-3 py-3 text-right">
                {formatAmount(sectionTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PrintModal: FC<PrintModalProps> = ({
  printData,
  showPrintDialog,
  setShowPrintDialog,
}) => {
  const [orgName, setOrgName] = useState<string | null>(null);
  const [orgAddress, setOrgAddress] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const orderPartyData: OrderPartyData[] = useSelector(
    (state: RootState) => state?.orderBooking?.orderPartyData
  );

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgName(getCookieData<string | null>("waxCraftClientOrgName"));
      setOrgAddress(getCookieData<string | null>("waxCraftClientOrgAddress"));
    }
  }, []);

  useEffect(() => {
    setImageErrors({});
  }, [printData]);

  const generatePDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Sample Print",
  });

  const partyName =
    printData?.partyName ||
    (printData?.partyId
      ? orderPartyData.find((party) => party.Id.toString() === printData.partyId)
          ?.Party_Name
      : "") ||
    "";

  const designSections = useMemo(
    () => resolveDesignSections(printData),
    [printData]
  );

  const pageSections: (SamplePrintDesignPrintData | null)[] =
    printData && designSections.length > 0 ? designSections : [null];
  const totalPages = pageSections.length;

  const printHeader = (
    <>
        <div className="px-8 pt-7 pb-5">
          <div className="flex items-center gap-4">
            <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden bg-white">
              <Image
                alt="Org Image"
                src="/orgImg.png"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xl font-semibold uppercase tracking-tight text-black">
                {orgName}
              </p>
              <p className="mt-0.5 text-xs uppercase tracking-wide text-black">
                {orgAddress}
              </p>
            </div>
            <div className="shrink-0 rounded-full border border-black bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-black">
              Proposal
            </div>
          </div>
        </div>

        <div className="mx-8 flex items-start justify-between gap-8 border border-black bg-white px-5 py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-black">
              Proposal to
            </p>
            {hasText(partyName) && (
              <p className="mt-1 text-base font-semibold text-black">
                {partyName}
              </p>
            )}
            {hasText(printData?.address) && (
              <p className="mt-0.5 text-sm text-black">
                {printData?.address}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-black">
              Date
            </p>
            {printData?.printDate && (
              <p className="mt-1 text-base font-semibold text-black">
                {format(printData.printDate, "dd-MM-yyyy")}
              </p>
            )}
          </div>
        </div>
    </>
  );

  return (
    <PrintPreviewModal
      isOpen={showPrintDialog}
      onOpenChange={setShowPrintDialog}
      printRef={printRef}
      documentTitle="Sample Print"
      onPrint={() => generatePDF()}
    >
      {pageSections.map((design, index) => {
        const key = `${design?.designId || "design"}-${index}`;
        return (
          <div
            key={key}
            className="print-report-page relative mx-auto mb-4 flex min-h-[297mm] w-[210mm] flex-col overflow-hidden border border-black bg-white text-black print:mb-0 print:overflow-visible"
          >
            {/* thead repeats the company header if a design spills onto another sheet */}
            <table className="w-full border-collapse">
              <thead className="table-header-group">
                <tr>
                  <td className="p-0">{printHeader}</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-0 align-top">
                    {design && (
                      <div className="px-8 py-6">
                        <DesignPrintSection
                          design={design}
                          imageError={Boolean(imageErrors[key])}
                          onImageError={() =>
                            setImageErrors((prev) => ({ ...prev, [key]: true }))
                          }
                        />
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <PrintFooter pageNo={index + 1} totalPages={totalPages} />
          </div>
        );
      })}
    </PrintPreviewModal>
  );
};

export default PrintModal;
