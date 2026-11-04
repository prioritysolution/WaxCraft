import { toRateString } from "@/utils/formatDecimal";

const MAKING_RATE_KEYS = [
  "Making_Rate",
  "making_rate",
  "MakingRate",
  "makingRate",
  "Rate",
  "rate",
] as const;

/** Normalize GetPartyMakingRateByParty `details` into a rate string. */
export const parsePartyMakingRateDetails = (details: unknown): string => {
  if (details == null) return "";

  if (typeof details !== "object") {
    return toRateString(details);
  }

  const row = Array.isArray(details) ? details[0] : details;
  if (row == null) return "";

  if (typeof row !== "object") {
    return toRateString(row);
  }

  const record = row as Record<string, unknown>;
  for (const key of MAKING_RATE_KEYS) {
    if (!(key in record)) continue;
    const value = toRateString(record[key]);
    if (value) return value;
  }

  return "";
};
