"use client";

import { getModalClassNames } from "@/lib/uiStyles";
import { cn } from "@/lib/utils";
import {
  InvoiceModalProps,
  InvoiceTableData,
} from "@/types/inventoryVoucher/SalesVoucherTypes";
import getCookieData from "@/utils/getCookieData";
import convertToWords from "@/utils/numberToWords";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@heroui/react";
import { format } from "date-fns";
import { FC, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";

interface SalesVoucherState {
  invoicePrintData: InvoiceTableData[];
}

interface RootState {
  salesVoucher: SalesVoucherState;
}

interface InvoiceLine {
  description: string;
  quantity: string | number;
  rate: string | number;
  total: string | number;
  isGroup?: boolean;
}

const FIRST_PAGE_WITH_FOOTER = 10;
const FIRST_PAGE_ROWS = 16;
const CONT_PAGE_WITH_FOOTER = 12;
const CONT_PAGE_ROWS = 22;

function paginateRows(rows: InvoiceLine[]) {
  if (rows.length <= FIRST_PAGE_WITH_FOOTER) return [rows];

  const pages: InvoiceLine[][] = [];
  const remaining = [...rows];
  pages.push(remaining.splice(0, FIRST_PAGE_ROWS));

  while (remaining.length > CONT_PAGE_WITH_FOOTER) {
    const take = Math.min(CONT_PAGE_ROWS, remaining.length - CONT_PAGE_WITH_FOOTER);
    pages.push(remaining.splice(0, take > 0 ? take : CONT_PAGE_ROWS));
  }

  if (remaining.length) pages.push(remaining);
  return pages;
}

function formatAmount(value: string | number | null | undefined) {
  if (value === "" || value == null) return "";
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value);
  return num.toFixed(2);
}

const InvoiceModal: FC<InvoiceModalProps> = ({
  showInvoiceDialog,
  setShowInvoiceDialog,
}) => {
  const [orgName, setOrgName] = useState<string | null>(null);
  const [orgAddress, setOrgAddress] = useState<string | null>(null);
  const [orgGstNo, setOrgGstNo] = useState<string | null>(null);

  const printRef = useRef(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgName(getCookieData<string | null>("waxCraftClientOrgName"));
      setOrgAddress(getCookieData<string | null>("waxCraftClientOrgAddress"));
      setOrgGstNo(getCookieData<string | null>("waxCraftClientOrgGst"));
    }
  }, []);

  const invoiceData: InvoiceTableData[] = useSelector(
    (state: RootState) => state.salesVoucher.invoicePrintData,
  );

  const invoice = invoiceData?.[0];
  const isTaxInvoice = !!invoice?.CGST_Rate;

  const invoiceTableData = useMemo<InvoiceLine[]>(
    () =>
      invoiceData?.flatMap((data) => [
        {
          description: `${data.DesignRow[0].Design_Name} - ${data.DesignRow[0].Design_Id}`,
          quantity: data.DesignRow[0].Order_Qnty,
          rate: "",
          total: "",
          isGroup: true,
        },
        {
          description: "WT",
          quantity: data.DesignRow[0].Wt,
          rate: data.DesignRow[0].Wt_Rate,
          total: data.DesignRow[0].Tot_Wt,
        },
        ...data.DesignRow[0].ItemRow.map((item) => ({
          description: item.Item_Name,
          quantity: item.Item_Qnty,
          rate: item.Item_Rate,
          total: item.Item_Tot,
        })),
        {
          description: "Polish",
          quantity: data.DesignRow[0].Order_Qnty,
          rate: data.DesignRow[0].Polish,
          total: data.DesignRow[0].Tot_Polish,
        },
      ]) ?? [],
    [invoiceData],
  );

  const itemPages = useMemo(
    () => paginateRows(invoiceTableData),
    [invoiceTableData],
  );

  const grandTotal = Math.ceil(
    (Number(invoice?.Tot_Amount) || 0) +
      (Number(invoice?.Tot_CGST) || 0) +
      (Number(invoice?.Tot_SGST) || 0) +
      (Number(invoice?.Tot_Round) || 0) -
      (Number(invoice?.Tot_Disc) || 0),
  );

  const generatePDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Sale Invoice",
  });

  const totalPages = itemPages.length + (invoiceData?.length ? invoiceData.length : 0);

  const OrgHeader = ({ compact = false }: { compact?: boolean }) => (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-black/[0.08] px-5",
        compact ? "py-2.5" : "py-3.5",
      )}
    >
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F7F5F3]",
          compact ? "h-12 w-12" : "h-[72px] w-[72px]",
        )}
      >
        <Image
          alt="Org Image"
          src="/orgImg.png"
          className="h-full w-full object-contain"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate font-semibold uppercase tracking-tight text-foreground",
            compact ? "text-base" : "text-xl",
          )}
        >
          {orgName}
        </p>
        <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">
          {orgAddress}
        </p>
        {isTaxInvoice ? (
          <p className="mt-1 text-[11px] font-medium text-muted-foreground">
            GSTIN : {orgGstNo}
          </p>
        ) : null}
      </div>
      <div className="shrink-0 text-right">
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          {isTaxInvoice ? "Tax Invoice" : "Invoice"}
        </span>
        {compact ? (
          <p className="mt-1 text-[11px] text-muted-foreground">
            {invoice?.Sale_No}
          </p>
        ) : null}
      </div>
    </div>
  );

  const PartyMeta = () => (
    <div className="grid grid-cols-3 gap-px border-b border-black/[0.08] bg-black/[0.06]">
      <div className="bg-white px-5 py-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Bill To
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          {invoice?.Party_Name}
        </p>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
          {invoice?.Party_Add}
        </p>
        {isTaxInvoice ? (
          <p className="mt-0.5 text-xs text-muted-foreground">
            GSTIN : {invoice?.Party_GST}
          </p>
        ) : null}
      </div>
      <div className="bg-white px-5 py-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Place Of Supply
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          {invoice?.Party_Name}
        </p>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
          {invoice?.Party_Add}
        </p>
      </div>
      <div className="bg-white px-5 py-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Invoice Details
        </p>
        <div className="mt-1.5 space-y-1 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Invoice</span>
            <span className="font-semibold">{invoice?.Sale_No}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Date</span>
            <span className="font-semibold">
              {invoice?.Sale_Date
                ? format(invoice.Sale_Date, "dd-MM-yyyy")
                : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const LineTable = ({
    rows,
    startIndex,
  }: {
    rows: InvoiceLine[];
    startIndex: number;
  }) => (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-black/[0.08]">
      <table className="h-full w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#F7F5F3] text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            <th className="w-14 px-3 py-2 text-left">Sl. No</th>
            <th className="px-3 py-2 text-left">Description</th>
            <th className="w-[110px] px-3 py-2 text-right">Quantity</th>
            <th className="w-[110px] px-3 py-2 text-right">Rate</th>
            <th className="w-[120px] px-3 py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`${startIndex}-${index}`}
              className={cn(
                "border-t border-black/[0.05]",
                row.isGroup ? "bg-primary/[0.04]" : index % 2 === 1 && "bg-[#F7F5F3]/50",
              )}
            >
              <td className="px-3 py-2 tabular-nums text-muted-foreground">
                {startIndex + index + 1}
              </td>
              <td
                className={cn(
                  "px-3 py-2 text-foreground",
                  row.isGroup && "font-semibold",
                )}
              >
                {row.description}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {formatAmount(row.quantity)}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {formatAmount(row.rate)}
              </td>
              <td className="px-3 py-2 text-right font-semibold tabular-nums">
                {formatAmount(row.total)}
              </td>
            </tr>
          ))}
          <tr>
            <td className="h-full border-t border-black/[0.05] p-0" />
            <td className="h-full border-t border-l border-black/[0.05] p-0" />
            <td className="h-full border-t border-l border-black/[0.05] p-0" />
            <td className="h-full border-t border-l border-black/[0.05] p-0" />
            <td className="h-full border-t border-l border-black/[0.05] p-0" />
          </tr>
        </tbody>
      </table>
    </div>
  );

  const TotalsFooter = () => (
    <div className="grid grid-cols-[1.4fr_1fr] items-start gap-4 border-t border-black/[0.08] px-5 py-3.5">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Amount Chargeable (in words)
          </p>
          <p className="mt-1 text-sm font-semibold leading-5 text-foreground">
            {convertToWords(grandTotal)} Only
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Company Bank Account Details
          </p>
          <div className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
            <p>Bank Name :</p>
            <p>Branch Name :</p>
            <p>IFSC :</p>
            <p>Account No. :</p>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Note — Please make cheques in favor of &quot;{orgName}&quot;
          </p>
        </div>
      </div>
      <div>
        <div className="overflow-hidden rounded-xl border border-black/[0.08]">
          <SummaryRow
            label={isTaxInvoice ? "Taxable Total" : "Total"}
            value={invoice?.Tot_Amount}
          />
          {Number(invoice?.CGST_Rate) > 0 ? (
            <SummaryRow label="CGST" value={invoice?.Tot_CGST} />
          ) : null}
          {Number(invoice?.SGST_Rate) > 0 ? (
            <SummaryRow label="SGST" value={invoice?.Tot_SGST} />
          ) : null}
          <SummaryRow label="Round off" value={invoice?.Tot_Round} />
          <SummaryRow label="Discount" value={invoice?.Tot_Disc} />
          <div className="flex items-center justify-between bg-primary px-4 py-2.5 text-sm font-semibold text-white">
            <span>Grand Total</span>
            <span className="tabular-nums">{grandTotal}</span>
          </div>
        </div>
        <div className="mt-3 text-right text-xs text-muted-foreground">
          <p>For {orgName}</p>
          <div className="mt-8 text-sm font-medium text-foreground">
            Authorised Signature
          </div>
        </div>
      </div>
    </div>
  );

  const PageShell = ({
    children,
    pageNo,
  }: {
    children: ReactNode;
    pageNo: number;
  }) => (
    <div className="invoice-page relative mx-auto mb-4 flex h-[297mm] w-[210mm] flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] print:mb-0 print:rounded-none print:shadow-none">
      {children}
      <div className="flex items-center justify-between border-t border-black/[0.08] px-5 py-2 text-[11px] text-muted-foreground">
        <span>This is a computer generated invoice</span>
        <span>
          Page {pageNo} of {totalPages}
        </span>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={showInvoiceDialog}
      scrollBehavior="normal"
      placement="center"
      onOpenChange={setShowInvoiceDialog}
      backdrop="blur"
      size="4xl"
      classNames={getModalClassNames("4xl")}
      hideCloseButton
      isDismissable={false}
    >
      <ModalContent>
        <ModalBody className="min-h-0 overflow-hidden pt-5">
          <div className="h-[min(70vh,600px)] w-full overflow-auto rounded-xl bg-[#F7F5F3]/60 p-3">
            <div ref={printRef} className="mx-auto w-[210mm]">
              <style>{`
                @media print {
                  @page { size: A4; margin: 0; }
                  .invoice-page { page-break-after: always; break-after: page; }
                  .invoice-page:last-child { page-break-after: auto; break-after: auto; }
                }
              `}</style>

              {itemPages.map((rows, pageIndex) => {
                const startIndex = itemPages
                  .slice(0, pageIndex)
                  .reduce((sum, page) => sum + page.length, 0);
                const isLastItemPage = pageIndex === itemPages.length - 1;

                return (
                  <PageShell key={`item-page-${pageIndex}`} pageNo={pageIndex + 1}>
                    <OrgHeader compact={pageIndex > 0} />
                    {pageIndex === 0 ? <PartyMeta /> : null}
                    <div className="flex min-h-0 flex-1 flex-col px-4 pt-3">
                      <LineTable rows={rows} startIndex={startIndex} />
                      {!isLastItemPage ? (
                        <p className="px-1 py-2 text-right text-xs italic text-muted-foreground">
                          Continued on next page
                        </p>
                      ) : null}
                    </div>
                    {isLastItemPage ? <TotalsFooter /> : null}
                  </PageShell>
                );
              })}

              {invoiceData?.map((designInvoice, designIndex) => (
                <PageShell
                  key={designInvoice.Id}
                  pageNo={itemPages.length + designIndex + 1}
                >
                  <OrgHeader compact />
                  <PartyMeta />
                  <div className="grid min-h-0 flex-1 grid-cols-[168px_1fr_1.2fr] items-stretch gap-4 px-5 py-3.5">
                    <div className="flex flex-col items-center self-start">
                      <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-[#F7F5F3]">
                        <Image
                          src={designInvoice.DesignRow[0].Image}
                          alt="Design"
                          width={160}
                          height={160}
                          className="h-40 w-40 object-cover"
                        />
                      </div>
                      <div className="mt-2 grid w-full grid-cols-2 overflow-hidden rounded-lg border border-black/[0.08] text-center text-xs">
                        <p className="border-r border-black/[0.08] bg-[#F7F5F3] px-2 py-2 font-medium">
                          {designInvoice.DesignRow[0].Order_Qnty} SET
                        </p>
                        <p className="px-2 py-2 font-medium">
                          {designInvoice.DesignRow[0].Wt} gm
                        </p>
                      </div>
                    </div>
                    <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-black/[0.08]">
                      <table className="h-full w-full text-sm">
                        <thead>
                          <tr className="bg-[#F7F5F3]">
                            <th
                              colSpan={2}
                              className="px-3 py-2 text-center text-xs font-semibold"
                            >
                              {designInvoice.DesignRow[0].Design_Name} -{" "}
                              {designInvoice.DesignRow[0].Design_No}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {designInvoice?.DesignRow[0]?.ItemRow?.map((item) => (
                            <tr
                              key={item.Item_Id}
                              className="border-t border-black/[0.05]"
                            >
                              <td className="px-3 py-2">{item.Item_Name}</td>
                              <td className="px-3 py-2 text-right tabular-nums">
                                {(Number(item.Item_Qnty) || 0) /
                                  (Number(designInvoice?.DesignRow[0]?.Order_Qnty) ||
                                    1)}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td className="h-full border-t border-black/[0.05] p-0" />
                            <td className="h-full border-t border-l border-black/[0.05] p-0" />
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-black/[0.08]">
                      <table className="h-full w-full text-sm">
                        <tbody>
                          {designInvoice?.DesignRow[0]?.ItemRow?.map((item) => (
                            <tr
                              key={item.Item_Id}
                              className="border-t border-black/[0.05] first:border-t-0"
                            >
                              <td className="px-3 py-2">{item.Item_Name}</td>
                              <td className="px-3 py-2 text-right tabular-nums">
                                {item.Item_Qnty}
                              </td>
                              <td className="px-3 py-2 text-right tabular-nums">
                                {item.Item_Rate}
                              </td>
                              <td className="px-3 py-2 text-right font-semibold tabular-nums">
                                {(Number(item.Item_Qnty) || 0) *
                                  (Number(item.Item_Rate) || 0)}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td className="h-full border-t border-black/[0.05] p-0" />
                            <td className="h-full border-t border-l border-black/[0.05] p-0" />
                            <td className="h-full border-t border-l border-black/[0.05] p-0" />
                            <td className="h-full border-t border-l border-black/[0.05] p-0" />
                          </tr>
                          <tr className="border-t border-black/[0.08] bg-[#F7F5F3]">
                            <td className="px-3 py-2" />
                            <td
                              colSpan={2}
                              className="px-3 py-2 font-semibold"
                            >
                              Total
                            </td>
                            <td className="px-3 py-2 text-right font-semibold tabular-nums">
                              {designInvoice?.DesignRow[0]?.ItemRow?.reduce(
                                (sum, item) =>
                                  sum +
                                  (Number(item.Item_Qnty) || 0) *
                                    (Number(item.Item_Rate) || 0),
                                0,
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </PageShell>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="flat"
            onPress={() => {
              setShowInvoiceDialog(false);
            }}
            size="lg"
            radius="sm"
            className="w-32"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            size="lg"
            radius="sm"
            className="w-32"
            onPress={() => generatePDF()}
          >
            Print
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-1.5 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{formatAmount(value)}</span>
    </div>
  );
}

export default InvoiceModal;
