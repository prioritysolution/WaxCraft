"use client";

import { useState } from "react";
import { DEFAULT_LIST_PER_PAGE } from "@/components/ui/table-edit-button";

export function useListPerPage(
  resetToFirstPage: () => void,
  defaultPerPage = DEFAULT_LIST_PER_PAGE,
) {
  const [perPage, setPerPage] = useState(defaultPerPage);

  const handlePerPageChange = (value: number) => {
    if (!Number.isFinite(value) || value <= 0 || value === perPage) return;
    setPerPage(value);
    resetToFirstPage();
  };

  return { perPage, handlePerPageChange };
}
