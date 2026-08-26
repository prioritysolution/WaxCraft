/**
 * Normalize numeric values to exactly two decimal places for display / form state.
 * Empty / nullish → "". Non-numeric strings are returned unchanged.
 */
export const toTwoDecimalString = (value: unknown): string => {
  if (value == null || value === "") return "";

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;

    if ("wt_rate" in record) return toTwoDecimalString(record.wt_rate);
    if ("Wt_Rate" in record) return toTwoDecimalString(record.Wt_Rate);

    const firstValue = Object.values(record)[0];
    return toTwoDecimalString(firstValue);
  }

  const raw = String(value).trim();
  if (!raw) return "";

  const num = Number(raw);
  if (!Number.isFinite(num)) return raw;

  return num.toFixed(2);
};

/** Display helper — empty values show `empty` (default "—"). */
export const formatTwoDecimals = (
  value: unknown,
  empty = "—",
): string => {
  const formatted = toTwoDecimalString(value);
  return formatted || empty;
};
