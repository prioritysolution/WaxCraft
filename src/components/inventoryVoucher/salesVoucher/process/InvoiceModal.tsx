"use client";

import { useItemUnit } from "@/container/master/itemUnit/Hooks";
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
import { getDesignGhat, hasDesignGhatField } from "@/utils/designGhat";
import {
  loadDesignMasterMaps,
  resolveDesignUnitName,
} from "@/utils/designUnits";
import getCookieData from "@/utils/getCookieData";
import { groupStoneItemsBySize } from "@/utils/groupStoneItems";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@heroui/react";
import { format } from "date-fns";
import {
  FC,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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

function formatQty(value: string | number | null | undefined) {
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value ?? "");
  return Number.isInteger(num) ? String(num) : num.toFixed(2);
}

const PARTY_CODE_KEYS = [
  "Party_Code",
  "party_code",
  "Party_Short_Name",
  "Party_Sh_Name",
];

// Item names are built as "Category - Model - Size [- Colour]"; the summary
// groups quantities by the model (e.g. AD, MQ, pan).
function resolveItemCategory(item: unknown) {
  const source = (item ?? {}) as Record<string, unknown>;
  const explicit = source.Model_Name ?? source.Item_Model;
  if (explicit != null && String(explicit).trim() !== "") {
    return String(explicit).trim();
  }
  const parts = String(source.Item_Name ?? "")
    .split(" - ")
    .map((part) => part.trim())
    .filter(Boolean);
  return parts[1] || parts[0] || "Other";
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
  return resolveDesignUnitName(design, units, designUnitById) || "SET";
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

interface InvoicePageLayout {
  designs: number[];
  summary: boolean;
  overflow: boolean;
}

// Keeps a little room so rounding between mm and px never pushes a block
// past the printable A4 area.
const PAGE_SAFETY_PX = 8;

function paginateInvoiceBlocks({
  pageHeight,
  footerHeight,
  headerHeight,
  designHeights,
  summaryHeight,
}: {
  pageHeight: number;
  footerHeight: number;
  headerHeight: number;
  designHeights: number[];
  summaryHeight: number;
}): InvoicePageLayout[] {
  const available = pageHeight - footerHeight - PAGE_SAFETY_PX;
  const pages: InvoicePageLayout[] = [];
  let current: InvoicePageLayout = {
    designs: [],
    summary: false,
    overflow: false,
  };
  let used = headerHeight;

  const closePage = () => {
    current.overflow = used > available;
    pages.push(current);
    current = { designs: [], summary: false, overflow: false };
    used = 0;
  };

  designHeights.forEach((height, index) => {
    if (current.designs.length > 0 && used + height > available) {
      closePage();
    }
    current.designs.push(index);
    used += height;
  });

  if (used > 0 && used + summaryHeight > available) {
    closePage();
  }
  current.summary = true;
  used += summaryHeight;
  current.overflow = used > available;
  pages.push(current);

  return pages;
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
  const [designGhatById, setDesignGhatById] = useState<Record<string, string>>(
    {},
  );
  const [fetchedItemRates, setFetchedItemRates] = useState<
    Record<string, string>
  >({});
  const [pageLayout, setPageLayout] = useState<InvoicePageLayout[] | null>(
    null,
  );
  const [measureRoot, setMeasureRoot] = useState<HTMLDivElement | null>(null);

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

    const loadDesignMaster = async () => {
      try {
        const { unitById, ghatById } = await loadDesignMasterMaps(orgId);
        if (cancelled) return;
        setDesignUnitById(unitById);
        setDesignGhatById(ghatById);
      } catch {
        if (cancelled) return;
        setDesignUnitById({});
        setDesignGhatById({});
      }
    };

    void loadDesignMaster();

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
        (invoiceRow.DesignRow || []).forEach((design) => {
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

  const designPages = (invoiceData ?? []).flatMap((designInvoice) =>
    (designInvoice.DesignRow || []).map((design) => ({
      designInvoice,
      design,
    })),
  );

  const invoicePages: InvoicePageLayout[] =
    pageLayout ??
    (designPages.length
      ? [
          {
            designs: designPages.map((_, index) => index),
            summary: true,
            overflow: true,
          },
        ]
      : []);

  const totalPages = invoicePages.length;

  const getMarkRows = (
    designInvoice: InvoiceTableData,
    design: InvoiceTableData["DesignRow"][number] | undefined,
  ) => {
    if (!design) return [];

    const orderQty = Number(design.Order_Qnty) || 0;
    const safeOrderQty = orderQty > 0 ? orderQty : 1;
    const ownFlag = pickOwnFlag(
      designInvoice as unknown as Record<string, unknown>,
      design as unknown as Record<string, unknown>,
    );
    const partyItem = isPartyItemFlag(ownFlag);

    return groupStoneItemsBySize(
      design.ItemRow || [],
      (item) => item.Item_Name,
    ).map((item) => {
      const itemId = String(item.Item_Id ?? "");
      const itemQnty = Number(item.Item_Qnty) || 0;
      const consumed = orderQty > 0 ? itemQnty / safeOrderQty : itemQnty;
      const perSet = consumed / safeOrderQty;
      const fetchedRate = Number(fetchedItemRates[itemId]);
      const rawRate = item.Item_Rate;
      const hasExplicitRate =
        rawRate != null && String(rawRate).trim() !== "";
      const rowRate = Number(rawRate);
      const itemRate = partyItem
        ? hasExplicitRate && Number.isFinite(rowRate)
          ? rowRate
          : 0
        : hasExplicitRate && Number.isFinite(rowRate)
          ? rowRate
          : Number.isFinite(fetchedRate) && fetchedRate > 0
            ? fetchedRate
            : 0;
      const rate = itemRate;
      const total = consumed * rate;
      // Making is charged only in the invoice summary amount (party items
      // still pay making), never on the design page.
      // Item_Rate and Making_Rate both come from the order item
      // (mst_order_item_details).
      const makingRate = Number(item.Making_Rate) || 0;
      const making = consumed * makingRate;

      return {
        itemId,
        category: resolveItemCategory(item),
        itemName: item.Item_Name || "—",
        perSet,
        consumed,
        rate,
        total,
        making,
      };
    });
  };

  // Older invoice payloads omit ghat on DesignRow; only then fall back to the
  // design master so an order saved without ghat stays hidden.
  const resolveInvoiceGhat = (
    design: InvoiceTableData["DesignRow"][number] | undefined,
  ) => {
    if (!design) return null;
    if (hasDesignGhatField(design)) return getDesignGhat(design);
    return getDesignGhat({
      Ghat: designGhatById[String(design.Design_Id ?? "")],
      Order_Qnty: design.Order_Qnty,
    });
  };

  const summaryRows = designPages.map(({ designInvoice, design }, index) => {
    const markRows = getMarkRows(designInvoice, design);
    const ghatInfo = resolveInvoiceGhat(design);
    const ghatTotal = Number(ghatInfo?.total) || 0;
    const polishTotal = Number(design.Tot_Polish) || 0;
    const makingTotal = markRows.reduce(
      (sum, row) => sum + (Number(row.making) || 0),
      0,
    );
    // Saved Wt is the order's total weight, so its amount is Wt × Wt_Rate.
    const wtRate = Number(design.Wt_Rate);
    const wtAmount =
      Number.isFinite(wtRate) && String(design.Wt_Rate ?? "").trim() !== ""
        ? (Number(design.Wt) || 0) * wtRate
        : Number(design.Tot_Wt) || 0;
    const stoneTotal = markRows.reduce(
      (sum, row) => sum + (Number(row.total) || 0),
      0,
    );
    const qtyByCategory = markRows.reduce<Record<string, number>>(
      (acc, row) => {
        acc[row.category] =
          (acc[row.category] || 0) + (Number(row.consumed) || 0);
        return acc;
      },
      {},
    );

    return {
      key: `summary-${designInvoice.Id}-${design.Design_Id}-${index}`,
      designNo: design.Design_No || "—",
      qty: `${formatQty(design.Order_Qnty)} ${resolveDesignUnitLabel(
        design,
        itemUnitData,
        designUnitById,
      )}`,
      wt: Number(design.Wt) || 0,
      qtyByCategory,
      hasGhat: !!ghatInfo,
      ghat: ghatTotal,
      polish: polishTotal,
      stone: stoneTotal,
      amount:
        wtAmount + makingTotal + polishTotal + ghatTotal + stoneTotal,
    };
  });

  const summaryPartyCode = (() => {
    const source = (invoice ?? {}) as unknown as Record<string, unknown>;
    for (const key of PARTY_CODE_KEYS) {
      const value = source[key];
      if (value != null && String(value).trim() !== "") {
        return String(value).trim();
      }
    }
    return invoice?.Party_Name ?? "";
  })();

  const summaryHasGhat = summaryRows.some((row) => row.hasGhat);

  const summaryCategories = Array.from(
    new Set(summaryRows.flatMap((row) => Object.keys(row.qtyByCategory))),
  );

  const summaryTotals = summaryRows.reduce(
    (acc, row) => ({
      wt: acc.wt + row.wt,
      ghat: acc.ghat + row.ghat,
      polish: acc.polish + row.polish,
      stone: acc.stone + row.stone,
      amount: acc.amount + row.amount,
    }),
    { wt: 0, ghat: 0, polish: 0, stone: 0, amount: 0 },
  );

  const summaryCategoryTotals = summaryCategories.reduce<
    Record<string, number>
  >((acc, category) => {
    acc[category] = summaryRows.reduce(
      (sum, row) => sum + (row.qtyByCategory[category] || 0),
      0,
    );
    return acc;
  }, {});

  const InvoiceSummary = () => (
    <div className="px-5 pb-3.5 pt-3">
      <div className="overflow-hidden border border-black/[0.08]">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-black/[0.06] bg-[#F7F5F3] px-3 py-2 text-xs font-semibold">
          <span className="truncate uppercase tracking-[0.12em]">
            P.Code - {summaryPartyCode || "—"}
          </span>
          <span className="truncate text-center text-sm uppercase tracking-[0.08em] text-foreground">
            {orgName}
          </span>
          <span className="text-right text-muted-foreground">
            {invoice?.Sale_Date
              ? `Date - ${format(invoice.Sale_Date, "dd-MM-yyyy")}`
              : ""}
          </span>
        </div>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-[#F7F5F3]/70 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              <th className="px-2 py-2 text-left">SL</th>
              <th className="px-2 py-2 text-left">D.No</th>
              <th className="px-2 py-2 text-right">Qnt</th>
              <th className="px-2 py-2 text-right">W.T</th>
              {summaryCategories.map((category) => (
                <th key={category} className="px-2 py-2 text-right">
                  {category}
                </th>
              ))}
              {summaryHasGhat ? (
                <th className="px-2 py-2 text-right">Ghat</th>
              ) : null}
              <th className="px-2 py-2 text-right">Polish</th>
              <th className="px-2 py-2 text-right">Stone</th>
              <th className="px-2 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {summaryRows.map((row, index) => (
              <tr key={row.key} className="border-t border-black/[0.05]">
                <td className="px-2 py-1.5 text-left">{index + 1}</td>
                <td className="px-2 py-1.5 text-left font-medium">
                  {row.designNo}
                </td>
                <td className="px-2 py-1.5 text-right">{row.qty}</td>
                <td className="px-2 py-1.5 text-right tabular-nums">
                  {formatAmount(row.wt)}
                </td>
                {summaryCategories.map((category) => (
                  <td
                    key={category}
                    className="px-2 py-1.5 text-right tabular-nums"
                  >
                    {formatQty(row.qtyByCategory[category] || 0)}
                  </td>
                ))}
                {summaryHasGhat ? (
                  <td className="px-2 py-1.5 text-right tabular-nums">
                    {row.hasGhat ? formatAmount(row.ghat) : "—"}
                  </td>
                ) : null}
                <td className="px-2 py-1.5 text-right tabular-nums">
                  {formatAmount(row.polish)}
                </td>
                <td className="px-2 py-1.5 text-right tabular-nums">
                  {formatAmount(row.stone)}
                </td>
                <td className="px-2 py-1.5 text-right font-medium tabular-nums">
                  {formatAmount(row.amount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-black/[0.08] bg-[#F7F5F3]/80 font-semibold">
              <td
                colSpan={3}
                className="px-2 py-2 text-left uppercase tracking-[0.12em]"
              >
                Total
              </td>
              <td className="px-2 py-2 text-right tabular-nums">
                {formatAmount(summaryTotals.wt)}
              </td>
              {summaryCategories.map((category) => (
                <td key={category} className="px-2 py-2 text-right tabular-nums">
                  {formatQty(summaryCategoryTotals[category] || 0)}
                </td>
              ))}
              {summaryHasGhat ? (
                <td className="px-2 py-2 text-right tabular-nums">
                  {formatAmount(summaryTotals.ghat)}
                </td>
              ) : null}
              <td className="px-2 py-2 text-right tabular-nums">
                {formatAmount(summaryTotals.polish)}
              </td>
              <td className="px-2 py-2 text-right tabular-nums">
                {formatAmount(summaryTotals.stone)}
              </td>
              <td className="px-2 py-2 text-right text-sm tabular-nums">
                {formatAmount(summaryTotals.amount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

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

  const PageFooter = ({ pageNo }: { pageNo: number }) => (
    <div className="flex items-center justify-between border-t border-black/[0.08] px-5 py-2 text-[11px] text-muted-foreground">
      <span>This is a computer generated invoice</span>
      <span>
        Page {pageNo} of {totalPages}
      </span>
    </div>
  );

  const PageShell = ({
    children,
    pageNo,
    overflow = false,
  }: {
    children: ReactNode;
    pageNo: number;
    overflow?: boolean;
  }) => (
    <div
      className={cn(
        "invoice-page relative mx-auto mb-4 flex w-[210mm] flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] print:mb-0 print:rounded-none print:shadow-none",
        overflow ? "min-h-[297mm]" : "h-[297mm]",
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <PageFooter pageNo={pageNo} />
    </div>
  );

  const renderDesignBlock = (designIndex: number, withDivider: boolean) => {
    const page = designPages[designIndex];
    if (!page) return null;
    const { designInvoice, design } = page;
    const unitLabel = resolveDesignUnitLabel(
      design,
      itemUnitData,
      designUnitById,
    );
    const markRows = getMarkRows(designInvoice, design);
    const ghatInfo = resolveInvoiceGhat(design);
    const grandTotal = markRows.reduce(
      (sum, row) => sum + (Number(row.total) || 0),
      0,
    );

    return (
      <div
        className={cn(
          "grid grid-cols-[148px_1fr] items-start gap-4 px-5 py-3",
          withDivider && "border-t border-black/[0.06]",
        )}
      >
        <div className="flex flex-col items-center self-start">
          <div className="overflow-hidden border border-black/[0.08] bg-[#F7F5F3]">
            <Image
              src={design.Image}
              alt="Design"
              radius="none"
              removeWrapper
              width={140}
              height={140}
              className="h-[140px] w-[140px] object-contain"
            />
          </div>
          <div className="mt-2 grid w-full grid-cols-2 overflow-hidden border border-black/[0.08] text-center text-xs">
            <p className="border-r border-black/[0.08] bg-[#F7F5F3] px-2 py-2 font-medium">
              {formatAmount(design.Order_Qnty)} {unitLabel}
            </p>
            <p className="px-2 py-2 font-medium">
              {formatAmount(design.Wt)} gm
            </p>
          </div>
          {ghatInfo ? (
            <div className="mt-2 grid w-full grid-cols-2 overflow-hidden border border-black/[0.08] text-center text-xs">
              <div className="border-r border-black/[0.08] bg-[#F7F5F3] px-2 py-1.5">
                <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Ghat
                </p>
                <p className="mt-0.5 font-medium tabular-nums">
                  {formatAmount(ghatInfo.ghat)}
                </p>
              </div>
              <div className="px-2 py-1.5">
                <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Total Ghat
                </p>
                <p className="mt-0.5 font-medium tabular-nums">
                  {formatAmount(ghatInfo.total)}
                </p>
              </div>
            </div>
          ) : null}
        </div>
        <div className="min-w-0 self-start overflow-hidden border border-black/[0.08]">
          <div className="border-b border-black/[0.06] bg-[#F7F5F3] px-3 py-2 text-center text-xs font-semibold">
            {design.Design_Name} - {design.Design_No}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="bg-[#F7F5F3]/70 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="px-3 py-2 text-left">Item</th>
                  <th className="px-3 py-2 text-right">Per {unitLabel}</th>
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
                      <td className="px-3 py-2 text-left">{row.itemName}</td>
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
    );
  };

  useLayoutEffect(() => {
    if (!measureRoot) return;

    const heightOf = (selector: string) =>
      measureRoot.querySelector<HTMLElement>(selector)?.offsetHeight ?? 0;

    const pageHeight = heightOf("[data-measure='page']");
    if (!pageHeight) return;

    const designHeights = Array.from(
      measureRoot.querySelectorAll<HTMLElement>("[data-measure='design']"),
    ).map((el) => el.offsetHeight);

    const next = designHeights.length
      ? paginateInvoiceBlocks({
          // Page border (top + bottom) is part of the fixed A4 height.
          pageHeight: pageHeight - 2,
          footerHeight: heightOf("[data-measure='footer']"),
          headerHeight: heightOf("[data-measure='header']"),
          designHeights,
          summaryHeight: heightOf("[data-measure='summary']"),
        })
      : null;

    setPageLayout((prev) =>
      JSON.stringify(prev) === JSON.stringify(next) ? prev : next,
    );
  });

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

              {invoicePages.map((page, pageIndex) => (
                <PageShell
                  key={`invoice-page-${pageIndex}`}
                  pageNo={pageIndex + 1}
                  overflow={page.overflow}
                >
                  {pageIndex === 0 ? (
                    <>
                      <OrgHeader compact />
                      <PartyMeta />
                    </>
                  ) : null}
                  {page.designs.map((designIndex, positionInPage) => (
                    <div key={`invoice-design-${designIndex}`}>
                      {renderDesignBlock(designIndex, positionInPage > 0)}
                    </div>
                  ))}
                  {page.summary ? (
                    <div className="mt-auto">
                      <InvoiceSummary />
                    </div>
                  ) : null}
                </PageShell>
              ))}
            </div>

            {/* Off-screen copy at A4 width, used only to measure block heights for pagination. */}
            <div
              aria-hidden
              className="pointer-events-none invisible h-0 overflow-hidden"
            >
              <div
                ref={setMeasureRoot}
                className="w-[210mm] border border-transparent"
              >
                <div data-measure="page" className="h-[297mm]" />
                <div data-measure="header">
                  <OrgHeader compact />
                  <PartyMeta />
                </div>
                {designPages.map((_, designIndex) => (
                  <div
                    key={`measure-design-${designIndex}`}
                    data-measure="design"
                  >
                    {renderDesignBlock(designIndex, true)}
                  </div>
                ))}
                <div data-measure="summary">
                  <InvoiceSummary />
                </div>
                <div data-measure="footer">
                  <PageFooter pageNo={1} />
                </div>
              </div>
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
