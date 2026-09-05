import {
  filterRowsByDateRange,
  sortRowsByDateDesc,
} from "@/lib/voucherTableDate";
import { useMemo, useState } from "react";

function matchesSearch(value: unknown, query: string): boolean {
  if (value == null) return false;

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value).toLowerCase().includes(query);
  }

  if (Array.isArray(value)) {
    return value.some((item) => matchesSearch(item, query));
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some((item) =>
      matchesSearch(item, query),
    );
  }

  return false;
}

export function filterBySearch<T>(data: T[] | undefined | null, search: string) {
  const rows = data || [];
  const query = search.trim().toLowerCase();
  if (!query) return rows;
  return rows.filter((row) => matchesSearch(row, query));
}

function toRowArray<T>(data: T[] | undefined | null): T[] {
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { data?: T[] }).data)
  ) {
    return (data as { data: T[] }).data;
  }
  return [];
}

export function useClientTableSearch<T>(data: T[] | undefined | null) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () => filterBySearch(toRowArray(data), search),
    [data, search],
  );
  return { search, setSearch, filtered };
}

export function useClientVoucherTableFilter<
  T extends Record<string, unknown>,
>(
  data: T[] | undefined | null,
  options?: {
    fromDate?: Date | null;
    toDate?: Date | null;
    dateKey?: string;
  },
) {
  const [search, setSearch] = useState("");
  const dateKey = options?.dateKey || "Trans_Date";

  const filtered = useMemo(() => {
    const rows = toRowArray(data) as T[];
    const byDate = filterRowsByDateRange(
      rows as Record<string, unknown>[],
      options?.fromDate,
      options?.toDate,
      dateKey,
    ) as T[];
    const bySearch = filterBySearch(byDate, search) as T[];
    return sortRowsByDateDesc(
      bySearch as Record<string, unknown>[],
      dateKey,
    ) as T[];
  }, [data, search, options?.fromDate, options?.toDate, dateKey]);

  return { search, setSearch, filtered };
}
