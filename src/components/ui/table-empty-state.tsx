"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function TableEmptyState({
  icon: Icon,
  entity,
  search,
  emptyHint,
  className,
}: {
  icon: LucideIcon;
  entity: string;
  search?: string;
  emptyHint?: string;
  className?: string;
}) {
  const hasSearch = Boolean(search?.trim());

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 py-4 text-center",
        className,
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-foreground">
        No {entity} found
      </p>
      <p className="text-sm text-muted-foreground">
        {hasSearch
          ? "Try a different search term."
          : emptyHint || `No ${entity} to display yet.`}
      </p>
    </div>
  );
}
