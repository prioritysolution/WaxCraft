export function getEnterPlaceholder(label?: string) {
  if (!label?.trim()) return undefined;
  return `Enter ${label.trim().toLowerCase()}`;
}

export function getSelectPlaceholder(label?: string) {
  if (!label?.trim()) return undefined;
  return `Select ${label.trim().toLowerCase()}`;
}

export const fieldBorderClassName =
  "border border-black/15 bg-white shadow-none " +
  "data-[hover=true]:border-black/25 group-data-[focus=true]:border-black/25 " +
  "group-data-[invalid=true]:border-danger group-data-[invalid=true]:data-[hover=true]:border-danger";

export const fieldInputClassNames = {
  base: "w-full overflow-visible",
  mainWrapper: "h-auto overflow-visible",
  label:
    "!relative !top-auto !translate-y-0 overflow-visible pb-1.5 text-sm font-medium leading-5 !text-foreground group-data-[invalid=true]:!text-foreground",
  inputWrapper: `h-11 min-h-11 rounded-2xl ${fieldBorderClassName}`,
  innerWrapper: "h-full",
  input: "text-sm text-foreground placeholder:text-muted-foreground",
  helperWrapper: "px-0.5 pt-1",
  errorMessage: "text-sm font-normal text-danger",
};

export const fieldTextareaClassNames = {
  ...fieldInputClassNames,
  inputWrapper: `min-h-[5.5rem] rounded-2xl ${fieldBorderClassName}`,
};

export const nativeFieldClassName =
  "h-11 rounded-2xl border border-black/15 bg-white px-3 text-sm shadow-none placeholder:text-muted-foreground focus-visible:border-black/25 focus-visible:outline-none focus-visible:ring-0";

export const fieldTriggerClassName =
  "mt-0 h-11 w-full justify-between rounded-2xl border border-black/15 bg-white px-3 text-sm text-foreground shadow-none data-[hover=true]:border-black/25 data-[hover=true]:bg-white";

export const searchInputClassNames = {
  inputWrapper:
    "h-10 min-h-10 rounded-full border-black/15 bg-white px-3 shadow-none data-[hover=true]:border-black/25 group-data-[focus=true]:border-black/25",
  input: "text-sm",
  innerWrapper: "gap-2",
};

export const reportTableHeadClassName =
  "bg-[#F7F5F3] px-4 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground";

export const reportTableCellClassName =
  "border-t border-black/[0.05] px-4 py-3 text-sm text-foreground";

export const reportTableFooterClassName =
  "border-t border-black/[0.05] bg-[#F7F5F3]/80 px-4 py-3 text-sm font-medium text-foreground";

export const tableClassNames = {
  base:
    "max-w-full overflow-x-auto overflow-y-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] " +
    "[&>div:first-of-type]:w-full [&>div:first-of-type]:px-4 [&>div:first-of-type]:pt-4 [&>div:first-of-type]:pb-3 " +
    "[&>div:last-of-type]:w-full [&>div:last-of-type]:px-4 [&>div:last-of-type]:pb-4 [&>div:last-of-type]:pt-2",
  wrapper: "p-0 shadow-none overflow-x-auto overflow-y-hidden",
  th: "bg-[#F7F5F3] h-11 text-center !text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground first:rounded-none last:rounded-none data-[hover=true]:bg-[#F7F5F3]",
  td: "text-sm py-3.5 text-center !text-center text-foreground before:hidden",
  tr: "border-b border-black/[0.05] hover:bg-[#F7F5F3]/80",
  emptyWrapper: "text-muted-foreground py-12",
};

export const tabsClassNames = {
  base: "w-full",
  tabList:
    "bg-white border border-black/[0.06] p-1 rounded-xl shadow-sm gap-1 w-full sm:w-auto flex-nowrap overflow-x-auto",
  cursor: "bg-primary shadow-none rounded-lg",
  tab: "h-9 px-3 sm:px-4 text-sm font-medium",
  tabContent: "group-data-[selected=true]:text-white",
  panel: "pt-4",
};

const modalShellClassName =
  "mx-auto flex w-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-lg " +
  "max-h-[min(88dvh,calc(100dvh-1.5rem))]";

const modalBaseBySize = {
  sm: `${modalShellClassName} max-w-[calc(100vw-1.5rem)] sm:max-w-[min(28rem,calc(100vw-2rem))]`,
  md: `${modalShellClassName} max-w-[calc(100vw-1.5rem)] sm:max-w-[min(32rem,calc(100vw-2rem))]`,
  lg: `${modalShellClassName} max-w-[calc(100vw-1.5rem)] sm:max-w-[min(36rem,calc(100vw-2rem))]`,
  xl: `${modalShellClassName} max-w-[calc(100vw-1.5rem)] sm:max-w-[min(42rem,calc(100vw-2rem))]`,
  "2xl": `${modalShellClassName} max-w-[calc(100vw-1.5rem)] sm:max-w-[min(48rem,calc(100vw-2rem))]`,
  "3xl": `${modalShellClassName} max-w-[calc(100vw-1.5rem)] sm:max-w-[min(56rem,calc(100vw-2rem))]`,
  "4xl": `${modalShellClassName} max-w-[calc(100vw-1.5rem)] sm:max-w-[min(64rem,calc(100vw-2rem))]`,
  "5xl": `${modalShellClassName} max-w-[calc(100vw-1.5rem)] sm:max-w-[min(72rem,calc(100vw-2rem))]`,
} as const;

export type ModalSize = keyof typeof modalBaseBySize;

export function getModalClassNames(size: ModalSize = "xl") {
  return {
    // Keep scroll inside the modal body — wrapper must not steal overflow.
    wrapper:
      "items-center justify-center p-3 sm:p-4 overflow-hidden",
    base: modalBaseBySize[size],
    backdrop: "bg-black/25",
    header:
      "shrink-0 px-4 sm:px-6 pt-4 sm:pt-5 pb-2 text-base sm:text-xl font-semibold",
    body: "min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-3 sm:px-6 sm:py-4",
    footer:
      "wc-modal-footer shrink-0 px-4 sm:px-6 pb-4 sm:pb-5 pt-2 flex !flex-col-reverse sm:!flex-row gap-2 justify-end",
  };
}

export const modalClassNames = getModalClassNames("xl");

export const pageFormClassName = "flex w-full min-w-0 flex-col gap-5";

export const formGridClassName =
  "grid w-full min-w-0 grid-cols-1 items-start gap-x-4 gap-y-3 xs:grid-cols-2 lg:grid-cols-3";

export const formTitleClassName =
  "text-xl font-medium text-foreground sm:text-2xl";

export const formActionsClassName =
  "flex w-full items-center justify-end gap-2";

export const formSubmitButtonClassName =
  "w-full min-w-[148px] sm:w-auto";

export const primaryButtonClassName =
  "h-9 w-full min-w-[148px] bg-primary px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:brightness-90 data-[hover=true]:!bg-primary data-[hover=true]:brightness-90 data-[pressed=true]:brightness-75 sm:w-auto";

export const secondaryButtonClassName =
  "h-9 w-full min-w-[84px] border-black/10 bg-white px-4 text-sm text-foreground transition-colors data-[hover=true]:border-black/20 data-[hover=true]:bg-secondary sm:w-auto";
