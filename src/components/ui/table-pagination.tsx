"use client";

import { Pagination, PaginationItemType } from "@heroui/react";
import type { PaginationItemRenderProps } from "@heroui/pagination";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DEFAULT_LIST_PER_PAGE } from "@/components/ui/table-edit-button";

export const LIST_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100] as const;

export type TablePaginationBarProps = {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  perPage?: number;
  onPerPageChange: (perPage: number) => void;
};

function toPositiveInt(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : fallback;
}

function renderPaginationItem({
  ref,
  key,
  value,
  index,
  page: itemPage,
  total,
  className,
  children,
  activePage,
  onNext,
  onPrevious,
  setPage,
}: PaginationItemRenderProps) {
  // Default HeroUI path keys both ellipses as `dotsfalse` when activePage is
  // missing from the range. Custom render uses index-based keys instead.
  const itemKey =
    value === PaginationItemType.DOTS ? `dots-${index}` : (key ?? String(value));

  if (value === PaginationItemType.PREV) {
    return (
      <button
        key={itemKey}
        type="button"
        className={className}
        disabled={activePage === 1}
        onClick={onPrevious}
      >
        {children}
      </button>
    );
  }

  if (value === PaginationItemType.NEXT) {
    return (
      <button
        key={itemKey}
        type="button"
        className={className}
        disabled={activePage === total}
        onClick={onNext}
      >
        {children}
      </button>
    );
  }

  if (value === PaginationItemType.DOTS) {
    return (
      <button
        key={itemKey}
        type="button"
        className={className}
        onClick={() => setPage(itemPage)}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      key={itemKey}
      ref={ref}
      type="button"
      className={className}
      onClick={() => setPage(value)}
    >
      {children}
    </button>
  );
}

export function TablePaginationBar({
  currentPage,
  lastPage,
  onPageChange,
  perPage = DEFAULT_LIST_PER_PAGE,
  onPerPageChange,
}: TablePaginationBarProps) {
  const [open, setOpen] = useState(false);

  const total = toPositiveInt(lastPage, 1);
  const page = Math.min(total, toPositiveInt(currentPage, 1));

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Rows per page</span>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Rows per page"
              className="inline-flex h-8 min-w-[4.25rem] items-center justify-between gap-1 rounded-lg border border-primary/40 bg-white px-2.5 text-sm tabular-nums text-foreground outline-none transition-colors hover:border-primary/60 focus-visible:border-primary"
            >
              {perPage}
              <ChevronDown className="h-3.5 w-3.5 text-foreground/70" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={4}
            className="w-[4.25rem] overflow-hidden rounded-lg p-0 shadow-md"
          >
            <ul>
              {LIST_PER_PAGE_OPTIONS.map((option) => {
                const selected = option === perPage;
                return (
                  <li key={option}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-center px-2 py-1.5 text-sm tabular-nums",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted",
                      )}
                      onClick={() => {
                        onPerPageChange(option);
                        setOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  </li>
                );
              })}
            </ul>
          </PopoverContent>
        </Popover>
      </div>
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={total}
        onChange={onPageChange}
        renderItem={renderPaginationItem}
      />
    </div>
  );
}
