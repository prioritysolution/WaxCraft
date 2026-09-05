"use client";

import { useRouter } from "next/navigation";

import getCookieData from "@/utils/getCookieData";
import { FC, ReactNode, useEffect, useState } from "react";
import { useModalOpen } from "@/utils/ContextProvider";
import { cn } from "@/lib/utils";
import SidebarContainer from "@/container/sidebar";
import NavbarContainer from "@/container/navbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const token = getCookieData<string | null>("waxCraftClientToken");
  const [orgName, setOrgName] = useState<string | null>(null);

  const { modalOpen, handleClose } = useModalOpen();

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgName(getCookieData<string | null>("waxCraftClientOrgName"));
    }
  }, []);

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  useEffect(() => {
    const handleWheel = (event: globalThis.WheelEvent) => {
      const target = event.target as HTMLInputElement;

      if (target && target.tagName === "INPUT" && target.type === "number") {
        event.preventDefault();
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <main className="relative flex h-screen w-full max-w-full overflow-hidden bg-secondary text-foreground">
      {modalOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:hidden"
          onClick={handleClose}
        />
      )}
      <SidebarContainer />
      <div
        className={cn(
          "flex h-full min-w-0 w-full flex-col md:w-[calc(100%-270px)] md:translate-x-[270px] translate-x-0 transition-all duration-200 ease-in delay-75",
          { "w-full": modalOpen },
        )}
      >
        <NavbarContainer />
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-secondary p-0 text-foreground">
          {children}
        </div>
        {orgName ? (
          <div className="flex shrink-0 justify-end border-t border-black/[0.04] bg-secondary px-4 py-2 sm:px-5">
            <p className="max-w-full truncate rounded-full bg-white px-3 py-1 text-xs italic text-muted-foreground shadow-sm sm:text-sm">
              {orgName}
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default DashboardLayout;
