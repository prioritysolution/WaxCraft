"use client";

import getCookieData from "@/utils/getCookieData";
import { parseVoucherDate, toApiDate } from "@/lib/voucherTableDate";
import { useMemo, useState } from "react";

function defaultFromDate(): Date | undefined {
  return (
    parseVoucherDate(
      getCookieData<string | null>("waxCraftClientFinStartDate"),
    ) || undefined
  );
}

function defaultToDate(): Date | undefined {
  const finEnd = parseVoucherDate(
    getCookieData<string | null>("waxCraftClientFinEndDate"),
  );
  const today = new Date();
  if (finEnd && today > finEnd) return finEnd;
  return today;
}

export function useVoucherListDateFilter() {
  const [fromDate, setFromDate] = useState<Date | undefined>(defaultFromDate);
  const [toDate, setToDate] = useState<Date | undefined>(defaultToDate);

  const fromDateApi = useMemo(() => toApiDate(fromDate), [fromDate]);
  const toDateApi = useMemo(() => toApiDate(toDate), [toDate]);

  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    fromDateApi,
    toDateApi,
  };
}
