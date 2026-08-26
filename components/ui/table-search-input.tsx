"use client";

import { Input } from "@heroui/react";
import { Search, X } from "lucide-react";
import { searchInputClassNames } from "@/lib/uiStyles";
import { cn } from "@/lib/utils";

interface TableSearchInputProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  title?: string;
  description?: string;
}

export function TableSearchInput({
  value,
  onValueChange,
  placeholder = "Search...",
  className,
  title,
  description,
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
        "w-full min-w-[220px] max-w-full sm:w-[280px] lg:w-[320px]",
        !title && !description && className,
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

  if (!title && !description) {
    return (
      <div className={cn("flex w-full justify-end", className)}>
        {searchField}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 shrink-0">
        {title ? (
          <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
        ) : null}
        {description ? (
          <p className="whitespace-nowrap text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {searchField}
    </div>
  );
}
