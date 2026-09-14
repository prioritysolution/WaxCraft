/** Sample print list / history total — same formula as Design list + PrintModal. */

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

const toNum = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const designHasItemData = (design: LooseRecord): boolean =>
  firstNonEmptyArray(
    design.ItemRow,
    design.item_array,
    design.Item_Array,
    design.childrow,
  ).length > 0;

/** One design section: Σ(qty×rate + qty×making) + WT×Wt_Rate + Polish */
export const computeSamplePrintDesignSectionTotal = (
  design: LooseRecord,
): number => {
  const wtTotal =
    toNum(pickValue(design.Wt, design.WT, design.wt)) *
    toNum(pickValue(design.Wt_Rate, design.wt_rate, design.WtRate));
  const polishTotal = toNum(
    pickValue(design.Polish, design.polish, design.polish_rate),
  );

  const items = firstNonEmptyArray(
    design.ItemRow,
    design.item_array,
    design.Item_Array,
    design.childrow,
  );

  const itemsTotal = items.reduce((sum, item) => {
    const stored = toNum(
      pickValue(
        item.Item_Tot,
        item.item_tot,
        item.Item_Total,
        item.item_total,
        item.Item_Grand_Tot,
        item.item_grand_tot,
      ),
    );
    if (stored > 0) return sum + stored;

    const qty = toNum(
      pickValue(
        item.Item_Qnty,
        item.item_qnty,
        item.Item_Qty,
        item.item_qty,
        item.Qnty,
        item.qnty,
      ),
    );
    const rate = toNum(
      pickValue(item.Item_Rate, item.item_rate, item.ItemRate, item.Rate),
    );
    const making = toNum(
      pickValue(
        item.Making_Rate,
        item.making_rate,
        item.MakingRate,
        item.makingRate,
      ),
    );
    return sum + qty * (rate + making);
  }, 0);

  return wtTotal + itemsTotal + polishTotal;
};

export const computeSamplePrintHistoryTotal = (
  row: LooseRecord,
  designRows: LooseRecord[] = [],
): number => {
  const rowsWithItems = designRows.filter(designHasItemData);
  if (rowsWithItems.length > 0) {
    const fromDesigns = rowsWithItems.reduce(
      (sum, design) => sum + computeSamplePrintDesignSectionTotal(design),
      0,
    );
    if (fromDesigns > 0) return fromDesigns;
  }

  const flatItems = firstNonEmptyArray(
    designRows.flatMap((design) =>
      firstNonEmptyArray(
        design.ItemRow,
        design.item_array,
        design.Item_Array,
        design.childrow,
      ),
    ),
    (Array.isArray(row.sampleprint_array) ? row.sampleprint_array : []).filter(
      (entry: LooseRecord) =>
        Boolean(
          pickValue(
            entry.item_id,
            entry.Item_Id,
            entry.item_qnty,
            entry.Item_Qnty,
          ),
        ),
    ),
  );

  if (flatItems.length > 0) {
    const itemsTotal = flatItems.reduce((sum, item) => {
      const stored = toNum(
        pickValue(item.Item_Tot, item.item_tot, item.item_total),
      );
      if (stored > 0) return sum + stored;
      const qty = toNum(
        pickValue(item.item_qnty, item.Item_Qnty, item.Qnty, item.qnty),
      );
      const rate = toNum(
        pickValue(item.item_rate, item.Item_Rate, item.ItemRate),
      );
      const making = toNum(
        pickValue(item.making_rate, item.Making_Rate, item.MakingRate),
      );
      return sum + qty * (rate + making);
    }, 0);

    const header = (designRows[0] || row) as LooseRecord;
    return (
      itemsTotal +
      toNum(pickValue(header.Wt, header.WT, header.wt, row.Wt, row.WT)) *
        toNum(
          pickValue(
            header.Wt_Rate,
            header.wt_rate,
            row.Wt_Rate,
            row.wt_rate,
          ),
        ) +
      toNum(
        pickValue(
          header.Polish,
          header.polish,
          row.Polish,
          row.polish,
        ),
      )
    );
  }

  // Stored totals from API — use as-is (do not add WT/Polish again).
  return toNum(
    pickValue(
      row.Total_Amt,
      row.Grand_Total,
      row.Sample_Total,
      row.Qnty_Rate,
      row.Total,
    ),
  );
};
