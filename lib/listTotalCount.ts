function parseFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

/**
 * Resolves total row count from list API payloads.
 * Prefer pagination `total` (full table/query count); fall back to array length
 * for non-paginated list responses.
 */
export function resolveListTotalCount(details: unknown): number {
  if (details == null) return 0;

  if (Array.isArray(details)) {
    return details.length;
  }

  if (typeof details === "object") {
    const record = details as Record<string, unknown>;
    const total =
      parseFiniteNumber(record.total) ??
      parseFiniteNumber(record.Total) ??
      parseFiniteNumber(record.total_count) ??
      parseFiniteNumber(record.Total_Count);

    if (total != null) return total;

    // Single-page paginated payload with no explicit total still equals DB count.
    if (Array.isArray(record.data)) {
      const lastPage = parseFiniteNumber(record.last_page) ?? 1;
      if (lastPage <= 1) return record.data.length;
    }
  }

  return 0;
}
