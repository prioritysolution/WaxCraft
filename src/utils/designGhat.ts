const pickNumeric = (
  source: Record<string, unknown>,
  keys: string[],
): number | null => {
  for (const key of keys) {
    const value = source[key];
    if (value == null || String(value).trim() === "") continue;
    const num = Number(value);
    if (Number.isFinite(num)) return num;
  }
  return null;
};

const GHAT_KEYS = ["Ghat_Rate", "ghat_rate", "Ghat", "ghat"];

export const hasDesignGhatField = (design: unknown) => {
  if (!design || typeof design !== "object") return false;
  return GHAT_KEYS.some((key) => key in (design as Record<string, unknown>));
};

// Ghat is optional per order design (mst_order_details.Ghat_Rate / Tot_Ghat);
// returns null when the order has no ghat so callers can hide the columns.
export const getDesignGhat = (design: unknown) => {
  const source = (design ?? {}) as Record<string, unknown>;
  const ghat = pickNumeric(source, GHAT_KEYS);
  if (ghat == null || ghat === 0) return null;
  const total =
    pickNumeric(source, ["Tot_Ghat", "Total_Ghat", "tot_ghat", "total_ghat"]) ??
    ghat * (Number(source.Order_Qnty) || 0);
  return { ghat, total };
};
