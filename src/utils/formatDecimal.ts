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

/**
 * Restrict live typing to a valid decimal: digits only, at most one ".",
 * and at most `maxDecimals` digits after the decimal (default 2).
 */
export const sanitizeDecimalInput = (
  value: string,
  maxDecimals = 2,
): string => {
  let cleaned = String(value ?? "").replace(/[^\d.]/g, "");
  const firstDot = cleaned.indexOf(".");

  if (firstDot !== -1) {
    cleaned =
      cleaned.slice(0, firstDot + 1) +
      cleaned.slice(firstDot + 1).replace(/\./g, "");

    const [intPart, decPart = ""] = cleaned.split(".");
    cleaned = `${intPart}.${decPart.slice(0, Math.max(0, maxDecimals))}`;
  }

  return cleaned;
};
