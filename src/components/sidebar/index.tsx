"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { useSelector } from "react-redux";

import { useModalOpen } from "@/utils/ContextProvider";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import IconDisplay from "@/common/IconDisplay";
import { Link } from "@heroui/react";
import { getSidebarIcon } from "./sidebar-icons";

interface ChildLink {
  Icon: string | null;
  Page_Allies?: string | null;
  Menue_Name: string;
}

interface SidebarLink {
  title: string;
  path?: string | null;
  Icon?: string | null;
  childLinks: ChildLink[] | null;
}

interface SidebarState {
  sidebarData: SidebarLink[];
}

interface RootState {
  sidebar: SidebarState;
}

const Sidebar = ({ loading = false }: { loading: boolean }) => {
  const { modalOpen, handleClose } = useModalOpen();
  const [expandedLink, setExpandedLink] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();

  const sidebarData: SidebarLink[] = useSelector(
    (state: RootState) => state?.sidebar?.sidebarData,
  );

  const handleExpandedLink = (title: string) => {
    setExpandedLink((prev) => (prev === title ? "" : title));
  };

  useEffect(() => {
    handleClose();
  }, [pathname, handleClose]);

  return (
    <div
      className={cn(
        "absolute left-0 top-0 z-[50] flex h-full w-[270px] max-w-[85vw] flex-col justify-between overflow-x-visible bg-sidebar text-sidebar-foreground shadow-xl transition-all duration-200 ease-in delay-75 md:max-w-none md:translate-x-0 md:shadow-none -translate-x-[270px]",
        { "translate-x-0": modalOpen },
      )}
    >
      <div className="mb-4 flex h-16 items-center justify-between border-b border-white/10 px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/10 shadow-sm">
            <Image
              src="/wax_craft_logo.jpeg"
              alt="WaxCraft logo"
              width={36}
              height={36}
              className="h-9 w-9 object-cover"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold tracking-tight text-white">
              WaxCraft
            </p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">
              v1.0.1
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Close sidebar"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-lg text-white md:hidden"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <ScrollArea className="h-full">
        <div className="h-full w-full">
          {loading ? (
            <ul className="mb-4 space-y-3 px-4">
              {Array.from({ length: 14 }).map((_, index) => (
                <li key={index}>
                  <Skeleton className="h-10 w-full rounded-xl bg-white/10" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mb-5">
              <ul className="flex flex-col gap-1.5">
                {sidebarData.map((link, id) => {
                  const hasChildren = !!(
                    link.childLinks && link.childLinks.length > 0
                  );
                  const isActive =
                    link.path === pathname ||
                    (link.childLinks &&
                      link.childLinks.filter(
                        (item) => item.Page_Allies === pathname,
                      ).length > 0);
                  const SidebarIcon = getSidebarIcon(link.title);

                  return (
                    <li key={id} className="px-3">
                      <p
                        className={cn(
                          "flex w-full cursor-pointer items-center justify-between rounded-xl py-2.5 pl-3 pr-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white",
                          {
                            "bg-white text-primary shadow-sm hover:bg-white hover:text-primary":
                              isActive,
                          },
                        )}
                        onClick={() => {
                          if (hasChildren) {
                            handleExpandedLink(link.title);
                          } else {
                            handleExpandedLink("");
                          }

                          if (!hasChildren && link.path) {
                            router.replace(link.path);
                          }
                        }}
                      >
                        <span className="flex items-center justify-center gap-2.5">
                          {SidebarIcon ? (
                            <SidebarIcon
                              className="h-[18px] w-[18px] shrink-0"
                              strokeWidth={1.75}
                              aria-hidden="true"
                            />
                          ) : (
                            <IconDisplay
                              iconName={link.Icon ? link.Icon : ""}
                              iconSet={
                                link.Icon
                                  ? link.Icon.slice(0, 2).toLowerCase()
                                  : ""
                              }
                              className="text-xl"
                            />
                          )}
                          {link.title}
                        </span>
                        {hasChildren && (
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 shrink-0 transition-transform duration-150",
                              link.title === expandedLink && "rotate-90",
                            )}
                            strokeWidth={1.75}
                          />
                        )}
                      </p>
                      <ul>
                        {link.childLinks &&
                          link.title === expandedLink &&
                          link.childLinks.map((item, childId) => {
                            const childActive = item.Page_Allies === pathname;
                            return (
                              <div
                                className="flex items-center justify-between pl-4"
                                key={childId}
                              >
                                <div className="flex items-center justify-start">
                                  <div className="h-9 w-px bg-white/15" />
                                  <li
                                    className={cn(
                                      "flex cursor-pointer items-center justify-start gap-2 rounded-lg py-2 pl-2 text-sm text-white/70 transition-colors hover:text-white",
                                      childActive && "font-medium text-primary",
                                    )}
                                    onClick={() =>
                                      item.Page_Allies &&
                                      router.push(item.Page_Allies)
                                    }
                                  >
                                    <div
                                      className={cn(
                                        "h-px w-2.5 bg-white/15",
                                        childActive && "bg-primary",
                                      )}
                                    />
                                    {item.Menue_Name}
                                  </li>
                                </div>
                                <div
                                  className={cn(
                                    "hidden border-b-[5px] border-r-[10px] border-t-[5px] border-b-transparent border-r-white border-t-transparent",
                                    { block: childActive },
                                  )}
                                />
                              </div>
                            );
                          })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="flex h-16 w-full flex-col items-start justify-center border-t border-white/10 px-4 text-xs text-white/50">
        Designed & Developed by
        <Link
          target="_blank"
          href="https://prioritysolutions.in/"
          className="text-xs text-primary"
        >
          Priority Solutions
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
