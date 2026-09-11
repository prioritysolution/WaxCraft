function parseFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value != null && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function readTotal(record: Record<string, unknown> | null): number | null {
  if (!record) return null;
  return (
    parseFiniteNumber(record.total) ??
    parseFiniteNumber(record.Total) ??
    parseFiniteNumber(record.total_count) ??
    parseFiniteNumber(record.Total_Count)
  );
}

function readLastPage(record: Record<string, unknown> | null): number | null {
  if (!record) return null;
  return (
    parseFiniteNumber(record.last_page) ??
    parseFiniteNumber(record.Last_Page) ??
    parseFiniteNumber(record.lastPage)
  );
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

  const record = asRecord(details);
  if (!record) return 0;

  const pagination = asRecord(record.pagination);
  const total = readTotal(pagination) ?? readTotal(record);
  if (total != null) return total;

  // Single-page paginated payload with no explicit total still equals DB count.
  if (Array.isArray(record.data)) {
    const lastPage = readLastPage(pagination) ?? readLastPage(record) ?? 1;
    if (lastPage <= 1) return record.data.length;
  }

  return 0;
}

/**
 * Resolves last page from list API payloads, preferring total/perPage math
 * when the backend total is present so page size changes stay accurate.
 */
export function resolveListLastPage(
  details: unknown,
  pageSize: number,
): number {
  const size = pageSize > 0 ? pageSize : 1;

  if (details == null) return 1;

  if (Array.isArray(details)) {
    return Math.max(1, Math.ceil(details.length / size));
  }

  const record = asRecord(details);
  if (!record) return 1;

  const pagination = asRecord(record.pagination);
  const total = readTotal(pagination) ?? readTotal(record);
  if (total != null) {
    return Math.max(1, Math.ceil(total / size));
  }

  const lastPage = readLastPage(pagination) ?? readLastPage(record);
  if (lastPage != null && lastPage > 0) return lastPage;

  if (Array.isArray(record.data)) {
    return Math.max(1, Math.ceil(record.data.length / size));
  }

  return 1;
}
