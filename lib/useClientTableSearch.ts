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

export function useClientTableSearch<T>(data: T[] | undefined | null) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () => filterBySearch(data, search),
    [data, search],
  );
  return { search, setSearch, filtered };
}
