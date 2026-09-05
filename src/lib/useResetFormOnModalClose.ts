"use client";

import { useEffect, useRef } from "react";

/**
 * Resets a modal form when it transitions from open to closed
 * (Cancel, X, backdrop, Escape). Next open starts from a clean form.
 */
export function useResetFormOnModalClose(
  isOpen: boolean,
  reset: () => void,
) {
  const wasOpenRef = useRef(false);
  const resetRef = useRef(reset);
  resetRef.current = reset;

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      resetRef.current();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);
}
