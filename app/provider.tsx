"use client";

import { HeroUIProvider } from "@heroui/react";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <HeroUIProvider
      locale="en-US"
      className="min-h-screen w-full"
      data-overlay-container="true"
    >
      {children}
    </HeroUIProvider>
  );
}
