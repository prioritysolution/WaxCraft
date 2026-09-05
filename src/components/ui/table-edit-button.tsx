"use client";

import { Button, Tooltip } from "@heroui/react";
import { SquarePen, Trash2, Ban } from "lucide-react";
import { cn } from "@/lib/utils";

export const tableEditButtonClassName =
  "h-8 w-8 min-w-8 bg-[#E7F6EA] text-[#1B7A3D] shadow-none transition-colors data-[hover=true]:bg-[#D4EED9] data-[hover=true]:text-[#146433]";

export function TableEditButton({
  onPress,
  label = "Edit",
  isDisabled = false,
}: {
  onPress: () => void;
  label?: string;
  isDisabled?: boolean;
}) {
  return (
    <Tooltip content={label} delay={200}>
      <span className="inline-flex">
        <Button
          type="button"
          isIconOnly
          size="sm"
          radius="md"
          aria-label={label}
          isDisabled={isDisabled}
          className={tableEditButtonClassName}
          onPress={onPress}
        >
          <SquarePen className="h-3.5 w-3.5" strokeWidth={2} />
        </Button>
      </span>
    </Tooltip>
  );
}

export const tableDeleteButtonClassName =
  "h-8 w-8 min-w-8 bg-[#FDECEC] text-[#DC2626] shadow-none transition-colors data-[hover=true]:bg-[#F8D4D4] data-[hover=true]:text-[#B91C1C]";

export function TableDeleteButton({
  onPress,
  label = "Delete",
  isDisabled = false,
}: {
  onPress: () => void;
  label?: string;
  isDisabled?: boolean;
}) {
  return (
    <Tooltip content={label} delay={200}>
      <span className="inline-flex">
        <Button
          type="button"
          isIconOnly
          size="sm"
          radius="md"
          aria-label={label}
          isDisabled={isDisabled}
          className={tableDeleteButtonClassName}
          onPress={onPress}
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
        </Button>
      </span>
    </Tooltip>
  );
}

export function TableCancelButton({
  onPress,
  label = "Cancel",
  isDisabled = false,
}: {
  onPress: () => void;
  label?: string;
  isDisabled?: boolean;
}) {
  return (
    <Tooltip content={label} delay={200}>
      <span className="inline-flex">
        <Button
          type="button"
          isIconOnly
          size="sm"
          radius="md"
          aria-label={label}
          isDisabled={isDisabled}
          className={tableDeleteButtonClassName}
          onPress={onPress}
        >
          <Ban className="h-3.5 w-3.5" strokeWidth={2} />
        </Button>
      </span>
    </Tooltip>
  );
}

export function TableNameCell({
  name,
  className,
}: {
  name?: string | number | null;
  className?: string;
}) {
  const label = String(name ?? "").trim();
  const initial = (label.charAt(0) || "?").toUpperCase();

  return (
    <div
      className={cn(
        "inline-flex max-w-full min-w-0 items-center justify-center gap-3",
        className,
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold uppercase text-primary">
        {initial}
      </span>
      <span className="truncate text-sm font-semibold text-foreground">
        {label || "—"}
      </span>
    </div>
  );
}

export function getPaginatedTableRows<T>(
  data: T[] | undefined | null,
  loading: boolean,
): T[] {
  return loading ? [] : data ?? [];
}

export const DEFAULT_LIST_PER_PAGE = 10;

export function getTableSerialIndex(
  index: number,
  currentPage?: number,
  perPage = DEFAULT_LIST_PER_PAGE,
): number {
  if (currentPage == null || currentPage < 1) return index;
  return (currentPage - 1) * perPage + index;
}

export function formatTableSerial(
  index: number,
  options?: { currentPage?: number; perPage?: number },
): string {
  const serialIndex = getTableSerialIndex(
    index,
    options?.currentPage,
    options?.perPage ?? DEFAULT_LIST_PER_PAGE,
  );
  return String(serialIndex + 1).padStart(2, "0");
}
