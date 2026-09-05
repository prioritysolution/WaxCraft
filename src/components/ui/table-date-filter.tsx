"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fieldTriggerClassName } from "@/lib/uiStyles";
import { cn } from "@/lib/utils";
import { Button } from "@heroui/react";
import { format, isValid } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useState } from "react";

interface DateButtonProps {
  label: string;
  value?: Date | null;
  onChange: (value: Date | undefined) => void;
  disabledDateBefore?: Date;
  disabledDateAfter?: Date;
}

function DateButton({
  label,
  value,
  onChange,
  disabledDateBefore,
  disabledDateAfter,
}: DateButtonProps) {
  const [open, setOpen] = useState(false);
  const hasValue = value != null && isValid(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="bordered"
          size="md"
          radius="full"
          className={cn(
            fieldTriggerClassName,
            "mt-0 h-10 w-auto min-w-[132px] shrink-0 justify-between px-3",
            !hasValue && "text-muted-foreground",
          )}
        >
          <span className="truncate text-left text-sm">
            {hasValue ? format(value, "dd-MM-yyyy") : label}
          </span>
          <span className="flex items-center gap-1">
            {hasValue ? (
              <span
                role="button"
                tabIndex={0}
                aria-label={`Clear ${label}`}
                className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/10 hover:text-foreground"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onChange(undefined);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    onChange(undefined);
                  }
                }}
              >
                <X className="h-3.5 w-3.5" />
              </span>
            ) : (
              <CalendarIcon className="h-4 w-4 opacity-50" />
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-white"
        onOpenAutoFocus={(event) => event.preventDefault()}
        style={{ zIndex: 1050 }}
      >
        <Calendar
          mode="single"
          selected={hasValue ? value : undefined}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          disabled={(date) => {
            if (disabledDateBefore && date < disabledDateBefore) return true;
            if (disabledDateAfter && date > disabledDateAfter) return true;
            return false;
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export interface TableDateFilterProps {
  fromDate?: Date | null;
  toDate?: Date | null;
  onFromDateChange: (value: Date | undefined) => void;
  onToDateChange: (value: Date | undefined) => void;
  className?: string;
}

export function TableDateFilter({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  className,
}: TableDateFilterProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-nowrap items-center gap-2",
        className,
      )}
    >
      <DateButton
        label="From date"
        value={fromDate}
        onChange={onFromDateChange}
        disabledDateAfter={toDate || undefined}
      />
      <DateButton
        label="To date"
        value={toDate}
        onChange={onToDateChange}
        disabledDateBefore={fromDate || undefined}
      />
    </div>
  );
}
