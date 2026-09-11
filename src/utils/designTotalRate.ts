import { DesignTableData } from "@/types/master/DesignTypes";

const toNum = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

/** Same total as order booking / sample print: Σ(qty×rate + qty×making) + WT×Wt_Rate + Polish */
export const getDesignTotalRate = (data: DesignTableData): number => {
  const itemsSum = (data.childrow ?? []).reduce((acc, child) => {
    const qty = toNum(child.Qnty);
    return acc + qty * toNum(child.Item_Rate) + qty * toNum(child.Making_Rate);
  }, 0);
  const designExtras =
    toNum(data.WT) * toNum(data.Wt_Rate) + toNum(data.Polish);
  return itemsSum + designExtras;
};
