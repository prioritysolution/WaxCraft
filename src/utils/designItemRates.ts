import { getItemRateAPI } from "@/container/master/itemRate/ItemRateApis";
import { ApiResponse } from "@/types/ApiTypes";
import { ChildRow, DesignTableData } from "@/types/master/DesignTypes";
import { toTwoDecimalString } from "@/utils/formatDecimal";

type LooseRecord = Record<string, unknown>;

const pickValue = (...values: unknown[]): string => {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value);
    }
  }
  return "";
};

const firstNonEmptyArray = (...candidates: unknown[]): LooseRecord[] => {
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate as LooseRecord[];
    }
  }
  return [];
};

export const pickChildItemId = (child: LooseRecord): string =>
  pickValue(child.Item_Id, child.item_id, child.ItemId);

export const pickChildItemRate = (child: LooseRecord): string =>
  pickValue(
    child.Item_Rate,
    child.item_rate,
    child.ItemRate,
    child.Rate,
    child.rate,
  );

const pickChildMakingRate = (child: LooseRecord): string =>
  pickValue(
    child.Making_Rate,
    child.making_rate,
    child.MakingRate,
    child.makingRate,
  );

const pickChildQty = (child: LooseRecord): string =>
  pickValue(
    child.Qnty,
    child.qnty,
    child.Item_Qnty,
    child.item_qnty,
    child.Quantity,
    child.quantity,
  );

/** Normalize API child rows to Design ChildRow (same fields Sample Print reads). */
export const normalizeDesignChildRow = (child: LooseRecord): ChildRow => ({
  Item_Id: Number(pickChildItemId(child)) || 0,
  Qnty: Number(pickChildQty(child)) || undefined,
  Item_Name: pickValue(child.Item_Name, child.item_name, child.ItemName),
  Item_GL: pickValue(child.Item_GL, child.Item_Gl, child.item_gl),
  Item_Sh_Name: pickValue(
    child.Item_Sh_Name,
    child.item_sh_name,
    child.Item_ShName,
  ),
  Item_Rate: pickChildItemRate(child),
  Making_Rate: pickChildMakingRate(child),
  Item_Total: pickValue(child.Item_Tot, child.Item_Total, child.item_tot),
});

export const extractDetailChildRows = (detail: LooseRecord): ChildRow[] =>
  firstNonEmptyArray(
    detail.childrow,
    detail.ChildRow,
    detail.ItemRow,
    detail.item_array,
    detail.Item_Array,
  ).map(normalizeDesignChildRow);

const hasResolvedItemRate = (rate: unknown): boolean => {
  const n = Number(rate);
  return Number.isFinite(n) && n > 0;
};

/** Merge list row with GetDesignDetails payload (Sample Print source). */
export const mergeDesignRowWithDetails = (
  row: DesignTableData,
  detail: LooseRecord,
): DesignTableData => {
  const detailChildren = extractDetailChildRows(detail);
  const rateByItemId = new Map(
    detailChildren.map((child) => [
      String(child.Item_Id),
      pickChildItemRate(child as unknown as LooseRecord),
    ]),
  );

  const mergedChildren = detailChildren.length
    ? detailChildren.map((detailChild) => {
        const listChild = (row.childrow || []).find(
          (child) => String(child.Item_Id) === String(detailChild.Item_Id),
        );
        return {
          ...(listChild || detailChild),
          ...detailChild,
          Making_Rate:
            pickValue(listChild?.Making_Rate, detailChild.Making_Rate) ||
            detailChild.Making_Rate,
          Item_Rate:
            pickChildItemRate(detailChild as unknown as LooseRecord) ||
            pickChildItemRate((listChild || {}) as unknown as LooseRecord),
        };
      })
    : (row.childrow || []).map((child) => {
        const fromDetails = rateByItemId.get(String(child.Item_Id));
        if (!fromDetails) return child;
        return { ...child, Item_Rate: fromDetails };
      });

  return {
    ...row,
    WT: pickValue(row.WT, detail.WT, detail.Wt, detail.wt) || row.WT,
    Wt_Rate:
      pickValue(row.Wt_Rate, detail.Wt_Rate, detail.wt_rate, detail.WtRate) ||
      row.Wt_Rate,
    Polish:
      pickValue(row.Polish, detail.Polish, detail.polish) || row.Polish,
    childrow: mergedChildren,
  };
};

const resolveMissingRatesFromItemMaster = async (
  orgId: number,
  rows: DesignTableData[],
): Promise<DesignTableData[]> => {
  const pending = new Map<string, Array<{ rowIndex: number; childIndex: number }>>();

  rows.forEach((row, rowIndex) => {
    (row.childrow || []).forEach((child, childIndex) => {
      if (hasResolvedItemRate(child.Item_Rate)) return;
      const itemId = String(child.Item_Id ?? "");
      if (!itemId) return;
      const bucket = pending.get(itemId) || [];
      bucket.push({ rowIndex, childIndex });
      pending.set(itemId, bucket);
    });
  });

  if (!pending.size) return rows;

  const rateEntries = await Promise.all(
    [...pending.keys()].map(async (itemId) => {
      try {
        const res: ApiResponse = await getItemRateAPI(orgId, itemId);
        if (res.status === 200 && res.data.details != null) {
          const rate = toTwoDecimalString(res.data.details) || String(res.data.details);
          if (hasResolvedItemRate(rate)) {
            return [itemId, rate] as const;
          }
        }
      } catch {
        return null;
      }
      return null;
    }),
  );

  const ratesByItemId = Object.fromEntries(
    rateEntries.filter(Boolean) as [string, string][],
  );
  if (!Object.keys(ratesByItemId).length) return rows;

  const nextRows = rows.map((row) => ({
    ...row,
    childrow: [...(row.childrow || [])],
  }));

  for (const [itemId, locations] of pending) {
    const rate = ratesByItemId[itemId];
    if (!rate) continue;
    for (const { rowIndex, childIndex } of locations) {
      nextRows[rowIndex].childrow[childIndex] = {
        ...nextRows[rowIndex].childrow[childIndex],
        Item_Rate: rate,
      };
    }
  }

  return nextRows;
};

/** Same Item_Rate resolution as Sample Print: GetDesignDetails + Item Rate master fallback. */
export const enrichDesignRowsWithItemRates = async (
  orgId: number,
  rows: DesignTableData[],
  getDesignDetails: (
    orgId: number,
    designId: string,
  ) => Promise<ApiResponse>,
): Promise<DesignTableData[]> => {
  if (!rows.length) return rows;

  const detailEntries = await Promise.all(
    rows.map(async (row) => {
      try {
        const detailRes = await getDesignDetails(orgId, String(row.Id));
        if (detailRes.status === 200 && detailRes.data.details?.[0]) {
          return [String(row.Id), detailRes.data.details[0]] as const;
        }
      } catch {
        return null;
      }
      return null;
    }),
  );

  const detailsById = Object.fromEntries(
    detailEntries.filter(Boolean) as [string, LooseRecord][],
  );

  const mergedRows = rows.map((row) => {
    const detail = detailsById[String(row.Id)];
    if (!detail) return row;
    return mergeDesignRowWithDetails(row, detail);
  });

  return resolveMissingRatesFromItemMaster(orgId, mergedRows);
};

export const enrichSingleDesignWithItemRates = async (
  orgId: number,
  row: DesignTableData,
  getDesignDetails: (
    orgId: number,
    designId: string,
  ) => Promise<ApiResponse>,
): Promise<DesignTableData> => {
  const [enriched] = await enrichDesignRowsWithItemRates(
    orgId,
    [row],
    getDesignDetails,
  );
  return enriched ?? row;
};
