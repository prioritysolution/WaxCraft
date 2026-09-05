"use client";

import { Input } from "@heroui/react";
import { Search, X } from "lucide-react";
import { searchInputClassNames } from "@/lib/uiStyles";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TableSearchInputProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  title?: string;
  description?: string;
  filters?: ReactNode;
}

export function TableSearchInput({
  value,
  onValueChange,
  placeholder = "Search...",
  className,
  title,
  description,
  filters,
}: TableSearchInputProps) {
  const searchField = (
    <Input
      type="text"
      size="md"
      radius="full"
      variant="bordered"
      placeholder={placeholder}
      aria-label={placeholder}
      value={value}
      onValueChange={onValueChange}
      className={cn(
        "w-[220px] shrink-0 sm:w-[240px] lg:w-[280px]",
        !title && !description && !filters && className,
      )}
      classNames={searchInputClassNames}
      startContent={
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      }
      endContent={
        value ? (
          <button
            type="button"
            aria-label="Clear search"
            className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/10 hover:text-foreground"
            onClick={() => onValueChange("")}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null
      }
    />
  );

  const controls = (
    <div className="flex shrink-0 flex-nowrap items-center justify-end gap-2">
      {filters}
      {searchField}
    </div>
  );

  if (!title && !description) {
    return (
      <div className={cn("flex w-full items-center justify-end", className)}>
        {controls}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-between",
        className,
      )}
    >
      <div className="min-w-0 shrink-0">
        {title ? (
          <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
        ) : null}
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {controls}
    </div>
  );
}
