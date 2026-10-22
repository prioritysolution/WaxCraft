import { SalesVoucherTableData } from "@/types/inventoryVoucher/SalesVoucherTypes";

const PURCHASE_RATE_KEYS = [
  "Pur_Rate",
  "pur_rate",
  "Purchase_Rate",
  "purchase_rate",
] as const;

const toFlag = (value: unknown) => String(value ?? "").trim().toLowerCase();

/** Is_Party: 1 → party order (falls back to Is_Own: 0 → party). */
export const isPartyOrder = (order: object) => {
  const record = order as Record<string, unknown>;
  const isParty = toFlag(record.Is_Party ?? record.is_party);
  if (isParty) return isParty === "1" || isParty === "true";
  const isOwn = toFlag(record.Is_Own ?? record.is_own);
  return isOwn === "0" || isOwn === "false";
};

const pickPurchaseRate = (item: object): number | null => {
  const record = item as Record<string, unknown>;
  for (const key of PURCHASE_RATE_KEYS) {
    const raw = record[key];
    if (raw == null || String(raw).trim() === "") continue;
    const value = Number(raw);
    if (Number.isFinite(value)) return value;
  }
  return null;
};

/**
 * Party orders take the item rate from the ordered purchase
 * (trn_purchase_details); Item_Tot and Total_Order are recalculated so the
 * invoice totals and saved payload stay consistent.
 */
export const applyPartyPurchaseRates = (
  orders: SalesVoucherTableData[],
): SalesVoucherTableData[] =>
  orders.map((order) => {
    if (!isPartyOrder(order)) return order;

    let totalDiff = 0;
    const designRows = (order.DesignRow ?? []).map((design) => ({
      ...design,
      ItemRow: (design.ItemRow ?? []).map((item) => {
        const purchaseRate = pickPurchaseRate(item);
        if (purchaseRate == null) return item;

        const qty = Number(item.Item_Qnty) || 0;
        const making = Number(item.Making_Rate) || 0;
        const nextTotal = qty * (purchaseRate + making);
        totalDiff += nextTotal - (Number(item.Item_Tot) || 0);

        return {
          ...item,
          Item_Rate: String(purchaseRate),
          Item_Tot: nextTotal.toFixed(3),
        };
      }),
    }));

    return {
      ...order,
      DesignRow: designRows,
      Total_Order: ((Number(order.Total_Order) || 0) + totalDiff).toFixed(2),
    };
  });
