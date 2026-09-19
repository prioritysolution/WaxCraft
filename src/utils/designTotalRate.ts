import { ChildRow, DesignTableData } from "@/types/master/DesignTypes";
import { pickChildItemRate } from "@/utils/designItemRates";

type ChildLoose = ChildRow & Record<string, unknown>;
type DesignLoose = DesignTableData & Record<string, unknown>;

const toNum = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const pickNum = (...values: unknown[]): number => {
  for (const value of values) {
    if (value == null || value === "") continue;
    const n = toNum(value);
    if (Number.isFinite(n)) return n;
  }
  return 0;
};

export const getDesignChildQty = (child: ChildRow): number => {
  const row = child as ChildLoose;
  return pickNum(row.Qnty, row.qnty, row.Quantity, row.quantity);
};

export const getDesignChildItemRate = (child: ChildRow): number => {
  const row = child as ChildLoose;
  const rate = pickChildItemRate(row);
  if (rate) return toNum(rate);

  const itemTotal = pickNum(row.Item_Total, row.item_tot, row.Item_Tot);
  const qty = getDesignChildQty(child);
  if (itemTotal > 0 && qty > 0) {
    return itemTotal / qty;
  }

  return 0;
};

export const getDesignChildMakingRate = (child: ChildRow): number => {
  const row = child as ChildLoose;
  return pickNum(
    row.Making_Rate,
    row.making_rate,
    row.MakingRate,
    row.makingRate,
  );
};

/** Same row total as sample print / order booking: qty × rate + qty × making */
export const getDesignItemLineTotal = (child: ChildRow): number => {
  const qty = getDesignChildQty(child);
  return (
    qty * getDesignChildItemRate(child) + qty * getDesignChildMakingRate(child)
  );
};

/** Σ of item line totals (Item Grand Total in sample print). */
export const getDesignItemsSum = (data: DesignTableData): number =>
  (data.childrow ?? []).reduce(
    (acc, child) => acc + getDesignItemLineTotal(child),
    0,
  );

/** Same total as order booking / sample print: Σ(qty×rate + qty×making) + WT×Wt_Rate + Polish */
export const getDesignTotalRate = (data: DesignTableData): number => {
  const row = data as DesignLoose;
  const designExtras =
    pickNum(row.WT, row.wt) * pickNum(row.Wt_Rate, row.wt_rate, row.WtRate) +
    pickNum(row.Polish, row.polish);
  return getDesignItemsSum(data) + designExtras;
};
