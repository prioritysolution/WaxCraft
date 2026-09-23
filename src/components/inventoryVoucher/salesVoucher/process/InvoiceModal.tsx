"use client";

import { useItemUnit } from "@/container/master/itemUnit/Hooks";
import { getDesignAPI } from "@/container/master/design/DesignApis";
import { getItemRateAPI } from "@/container/master/itemRate/ItemRateApis";
import { getModalClassNames } from "@/lib/uiStyles";
import { cn } from "@/lib/utils";
import { ModalActionIcon } from "@/lib/modalActionIcons";
import { ApiResponse } from "@/types/ApiTypes";
import {
  InvoiceModalProps,
  InvoiceTableData,
} from "@/types/inventoryVoucher/SalesVoucherTypes";
import { ItemUnitTableData } from "@/types/master/ItemUnitTypes";
import getCookieData from "@/utils/getCookieData";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@heroui/react";
import { format } from "date-fns";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";

interface SalesVoucherState {
  invoicePrintData: InvoiceTableData[];
}

interface ItemUnitState {
  itemUnitData: ItemUnitTableData[];
}

interface RootState {
  salesVoucher: SalesVoucherState;
  itemUnit: ItemUnitState;
}

function formatAmount(value: string | number | null | undefined) {
  if (value === "" || value == null) return "";
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value);
  return num.toFixed(2);
}

function resolveDesignUnitLabel(
  design:
    | {
        Design_Id?: number | string;
        Design_Unit?: number | string | null;
        Unit_Id?: number | string | null;
        Unit_Name?: string | null;
        design_unit?: number | string | null;
      }
    | null
    | undefined,
  units: ItemUnitTableData[],
  designUnitById: Record<string, string>,
) {
  const unitName = String(design?.Unit_Name ?? "").trim();
  if (unitName) return unitName;

  const unitId =
    design?.Design_Unit ??
    design?.Unit_Id ??
    design?.design_unit ??
    designUnitById[String(design?.Design_Id ?? "")];

  if (unitId != null && String(unitId).trim() !== "") {
    const match = units.find((unit) => String(unit.Id) === String(unitId));
    if (match?.Unit_Name) return match.Unit_Name;
  }

  return "SET";
}

function pickOwnFlag(
  ...sources: Array<Record<string, unknown> | null | undefined>
) {
  for (const source of sources) {
    if (!source) continue;
    const value =
      source.Is_Own ??
      source.is_own ??
      source.Item_Type ??
      source.item_type ??
      source.Own_Item;
    if (value != null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return "1";
}

function isPartyItemFlag(flag: string) {
  const value = flag.toLowerCase();
  return value === "0" || value === "party" || value === "false";
}

const InvoiceModal: FC<InvoiceModalProps> = ({
  showInvoiceDialog,
  setShowInvoiceDialog,
}) => {
  const [orgName, setOrgName] = useState<string | null>(null);
  const [orgAddress, setOrgAddress] = useState<string | null>(null);
  const [orgGstNo, setOrgGstNo] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<number | null>(null);
  const [designUnitById, setDesignUnitById] = useState<Record<string, string>>(
    {},
  );
  const [fetchedItemRates, setFetchedItemRates] = useState<
    Record<string, string>
  >({});

  const printRef = useRef(null);
  const { getItemUnitApiCall } = useItemUnit();

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgName(getCookieData<string | null>("waxCraftClientOrgName"));
      setOrgAddress(getCookieData<string | null>("waxCraftClientOrgAddress"));
      setOrgGstNo(getCookieData<string | null>("waxCraftClientOrgGst"));
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  const invoiceData: InvoiceTableData[] = useSelector(
    (state: RootState) => state.salesVoucher.invoicePrintData,
  );

  const itemUnitData: ItemUnitTableData[] =
    useSelector((state: RootState) => state?.itemUnit?.itemUnitData) ?? [];

  useEffect(() => {
    if (!showInvoiceDialog || !orgId) return;

    getItemUnitApiCall(orgId);

    let cancelled = false;

    const loadDesignUnits = async () => {
      try {
        const res: ApiResponse = await getDesignAPI(orgId, 1, "", 100);
        if (cancelled || res.status !== 200) return;

        const details = res.data.details;
        const rows = Array.isArray(details)
          ? details
          : Array.isArray(details?.data)
            ? details.data
            : [];

        const nextMap: Record<string, string> = {};
        rows.forEach((row: Record<string, unknown>) => {
          const designId = row?.Id;
          const designUnit = row?.Design_Unit ?? row?.design_unit;
          if (
            designId != null &&
            designUnit != null &&
            String(designUnit).trim() !== ""
          ) {
            nextMap[String(designId)] = String(designUnit);
          }
        });
        setDesignUnitById(nextMap);
      } catch {
        if (!cancelled) setDesignUnitById({});
      }
    };

    void loadDesignUnits();

    return () => {
      cancelled = true;
    };
  }, [showInvoiceDialog, orgId]);

  useEffect(() => {
    if (!showInvoiceDialog || !orgId || !invoiceData?.length) {
      setFetchedItemRates({});
      return;
    }

    let cancelled = false;

    const loadMissingOwnItemRates = async () => {
      const pendingIds = new Set<string>();

      invoiceData.forEach((invoiceRow) => {
        const design = invoiceRow.DesignRow?.[0];
        if (!design) return;

        const ownFlag = pickOwnFlag(
          invoiceRow as unknown as Record<string, unknown>,
          design as unknown as Record<string, unknown>,
        );
        if (isPartyItemFlag(ownFlag)) return;

        (design.ItemRow || []).forEach((item) => {
          const itemId = String(item.Item_Id ?? "");
          if (!itemId) return;
          // Respect explicit 0 rates from the order; only fetch when rate is missing.
          const rawRate = item.Item_Rate;
          const hasExplicitRate =
            rawRate != null && String(rawRate).trim() !== "";
          if (hasExplicitRate && Number.isFinite(Number(rawRate))) return;
          pendingIds.add(itemId);
        });
      });

      if (!pendingIds.size) {
        if (!cancelled) setFetchedItemRates({});
        return;
      }

      const entries = await Promise.all(
        [...pendingIds].map(async (itemId) => {
          try {
            const res: ApiResponse = await getItemRateAPI(orgId, itemId);
            if (res.status === 200 && res.data.details != null) {
              const rate = formatAmount(res.data.details);
              if (rate) return [itemId, rate] as const;
            }
          } catch {
            return null;
          }
          return null;
        }),
      );

      if (cancelled) return;

      setFetchedItemRates(
        Object.fromEntries(
          entries.filter(Boolean) as Array<readonly [string, string]>,
        ),
      );
    };

    void loadMissingOwnItemRates();

    return () => {
      cancelled = true;
    };
  }, [showInvoiceDialog, orgId, invoiceData]);

  const invoice = invoiceData?.[0];
  const isTaxInvoice = !!invoice?.CGST_Rate;

  const generatePDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Sale Invoice",
  });

  const totalPages = invoiceData?.length ? invoiceData.length : 0;

  const getMarkRows = (
    designInvoice: InvoiceTableData,
  ) => {
    const design = designInvoice.DesignRow?.[0];
    if (!design) return [];

    const orderQty = Number(design.Order_Qnty) || 0;
    const safeOrderQty = orderQty > 0 ? orderQty : 1;
    const ownFlag = pickOwnFlag(
      designInvoice as unknown as Record<string, unknown>,
      design as unknown as Record<string, unknown>,
    );
    const partyItem = isPartyItemFlag(ownFlag);

    return (design.ItemRow || []).map((item) => {
      const itemId = String(item.Item_Id ?? "");
      const itemQnty = Number(item.Item_Qnty) || 0;
      // API Item_Qnty is order-total; show/calculate row amounts per pcs only
      const perSet = orderQty > 0 ? itemQnty / safeOrderQty : itemQnty;
      const fetchedRate = Number(fetchedItemRates[itemId]);
      const rawRate = item.Item_Rate;
      const hasExplicitRate =
        rawRate != null && String(rawRate).trim() !== "";
      const rowRate = Number(rawRate);
      const rate = partyItem
        ? 0
        : hasExplicitRate && Number.isFinite(rowRate)
          ? rowRate
          : Number.isFinite(fetchedRate) && fetchedRate > 0
            ? fetchedRate
            : 0;
      const total = partyItem ? 0 : perSet * rate;

      return {
        itemId,
        itemName: item.Item_Name || "—",
        perSet,
        consumed: perSet,
        rate,
        total,
      };
    });
  };

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

              {invoiceData?.map((designInvoice, designIndex) => {
                const design = designInvoice.DesignRow[0];
                const unitLabel = resolveDesignUnitLabel(
                  design,
                  itemUnitData,
                  designUnitById,
                );
                const markRows = getMarkRows(designInvoice);
                const orderQty = Number(design.Order_Qnty) || 0;
                const rowsSubtotal = markRows.reduce(
                  (sum, row) => sum + (Number(row.total) || 0),
                  0,
                );
                const grandTotal =
                  rowsSubtotal * (orderQty > 0 ? orderQty : 1);

                return (
                <PageShell
                  key={`design-page-${designInvoice.Id}-${designIndex}`}
                  pageNo={designIndex + 1}
                >
                  <OrgHeader compact />
                  <PartyMeta />
                  <div className="grid flex-1 grid-cols-[148px_1fr] items-start gap-4 px-5 py-3.5">
                    <div className="flex flex-col items-center self-start">
                      <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-[#F7F5F3]">
                        <Image
                          src={design.Image}
                          alt="Design"
                          width={140}
                          height={140}
                          className="h-[140px] w-[140px] object-cover"
                        />
                      </div>
                      <div className="mt-2 grid w-full grid-cols-2 overflow-hidden rounded-lg border border-black/[0.08] text-center text-xs">
                        <p className="border-r border-black/[0.08] bg-[#F7F5F3] px-2 py-2 font-medium">
                          {formatAmount(design.Order_Qnty)} {unitLabel}
                        </p>
                        <p className="px-2 py-2 font-medium">
                          {formatAmount(design.Wt)} gm
                        </p>
                      </div>
                    </div>
                    <div className="min-w-0 self-start overflow-hidden rounded-xl border border-black/[0.08]">
                      <div className="border-b border-black/[0.06] bg-[#F7F5F3] px-3 py-2 text-center text-xs font-semibold">
                        {design.Design_Name} - {design.Design_No}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[520px] border-collapse text-sm">
                          <thead>
                            <tr className="bg-[#F7F5F3]/70 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                              <th className="px-3 py-2 text-left">Item</th>
                              <th className="px-3 py-2 text-right">
                                Per {unitLabel}
                              </th>
                              <th className="px-3 py-2 text-right">Consumed</th>
                              <th className="px-3 py-2 text-right">Rate</th>
                              <th className="px-3 py-2 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {markRows.length ? (
                              markRows.map((row, itemIndex) => (
                                <tr
                                  key={`mix-${designInvoice.Id}-${designIndex}-${row.itemId}-${itemIndex}`}
                                  className="border-t border-black/[0.05]"
                                >
                                  <td className="px-3 py-2 text-left">
                                    {row.itemName}
                                  </td>
                                  <td className="px-3 py-2 text-right tabular-nums">
                                    {formatAmount(row.perSet)}
                                  </td>
                                  <td className="px-3 py-2 text-right tabular-nums">
                                    {formatAmount(row.consumed)}
                                  </td>
                                  <td className="px-3 py-2 text-right tabular-nums">
                                    {formatAmount(row.rate)}
                                  </td>
                                  <td className="px-3 py-2 text-right font-medium tabular-nums">
                                    {formatAmount(row.total)}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="px-3 py-6 text-center text-sm text-muted-foreground"
                                >
                                  No items found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                          <tfoot>
                            <tr className="border-t border-black/[0.08] bg-[#F7F5F3]/80">
                              <td
                                colSpan={4}
                                className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-[0.12em]"
                              >
                                Grand Total
                              </td>
                              <td className="px-3 py-2.5 text-right text-sm font-semibold tabular-nums">
                                {formatAmount(grandTotal)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </PageShell>
                );
              })}
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
            startContent={<ModalActionIcon label="Cancel" />}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            size="lg"
            radius="sm"
            className="w-32"
            onPress={() => generatePDF()}
            startContent={<ModalActionIcon label="Print" />}
          >
            Print
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InvoiceModal;
