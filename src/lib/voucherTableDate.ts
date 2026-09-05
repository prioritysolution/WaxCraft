import {
  endOfDay,
  format,
  isValid,
  parseISO,
  startOfDay,
} from "date-fns";

export function parseVoucherDate(value: unknown): Date | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) return isValid(value) ? value : null;

  const raw = String(value).trim();
  if (!raw) return null;

  const parsed = raw.includes("T")
    ? parseISO(raw)
    : /^\d{4}-\d{2}-\d{2}/.test(raw)
      ? parseISO(raw.slice(0, 10))
      : new Date(raw);

  return isValid(parsed) ? parsed : null;
}

export function sortRowsByDateDesc<T extends Record<string, unknown>>(
  rows: T[],
  dateKey = "Trans_Date",
): T[] {
  return [...rows].sort((a, b) => {
    const aTime = parseVoucherDate(a[dateKey])?.getTime() ?? 0;
    const bTime = parseVoucherDate(b[dateKey])?.getTime() ?? 0;
    if (bTime !== aTime) return bTime - aTime;
    return Number(b.Id ?? 0) - Number(a.Id ?? 0);
  });
}

export function filterRowsByDateRange<T extends Record<string, unknown>>(
  rows: T[],
  fromDate?: Date | null,
  toDate?: Date | null,
  dateKey = "Trans_Date",
): T[] {
  if (!fromDate && !toDate) return rows;

  const fromTime = fromDate ? startOfDay(fromDate).getTime() : null;
  const toTime = toDate ? endOfDay(toDate).getTime() : null;

  return rows.filter((row) => {
    const date = parseVoucherDate(row[dateKey]);
    if (!date) return false;
    const time = date.getTime();
    if (fromTime != null && time < fromTime) return false;
    if (toTime != null && time > toTime) return false;
    return true;
  });
}

export function normalizeVoucherListDetails(details: unknown): {
  rows: Record<string, unknown>[];
  lastPage: number;
} {
  const rows = Array.isArray(details)
    ? details
    : Array.isArray((details as { data?: unknown })?.data)
      ? ((details as { data: Record<string, unknown>[] }).data)
      : [];

  const pagination = (details as { pagination?: { last_page?: number } })
    ?.pagination;
  const lastPage =
    Number(pagination?.last_page) > 0
      ? Number(pagination?.last_page)
      : Number((details as { last_page?: number })?.last_page) > 0
        ? Number((details as { last_page?: number }).last_page)
        : 1;

  return {
    rows: sortRowsByDateDesc(rows),
    lastPage,
  };
}

export function toApiDate(value?: Date | null): string {
  return value && isValid(value) ? format(value, "yyyy-MM-dd") : "";
}

export function appendDateRangeParams(
  url: string,
  fromDate?: string,
  toDate?: string,
): string {
  let next = url;
  if (fromDate) {
    next += `${next.includes("?") ? "&" : "?"}form_date=${fromDate}`;
  }
  if (toDate) {
    next += `${next.includes("?") ? "&" : "?"}to_date=${toDate}`;
  }
  return next;
}
