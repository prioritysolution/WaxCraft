"use client";

import { useCallback, useEffect, useRef } from "react";

/** Shared delay for list/search API calls (ms). */
export const SEARCH_DEBOUNCE_MS = 500;

/**
 * Debounce runner for search/list API calls.
 * Keeps the latest callback and clears pending work on unmount.
 */
export function useSearchDebounce(delay = SEARCH_DEBOUNCE_MS) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const runDebounced = useCallback(
    (fn: () => void) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(fn, delay);
    },
    [delay],
  );

  return runDebounced;
}
