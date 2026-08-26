"use client";

import { ReactNode } from "react";
import { Button, ButtonProps } from "@heroui/react";
import { LucideIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { primaryButtonClassName } from "@/lib/uiStyles";

export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full min-h-0 flex-col gap-5 overflow-x-hidden overflow-y-auto p-3 sm:p-4 lg:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageCountBadge({
  count,
  singular,
  plural,
}: {
  count: number;
  singular: string;
  plural: string;
}) {
  return (
    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
      {count} {count === 1 ? singular : plural}
    </span>
  );
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  badge,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  badge?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        {Icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        ) : null}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            {badge}
          </div>
          {description ? (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
    </header>
  );
}

export function PageActionButton({
  children,
  startContent,
  className,
  ...props
}: ButtonProps) {
  return (
    <Button
      color="primary"
      radius="md"
      className={cn(primaryButtonClassName, className)}
      startContent={startContent ?? <Plus className="h-4 w-4" />}
      {...props}
    >
      {children}
    </Button>
  );
}

export function SectionCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-black/[0.06] bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function ResultsCard({
  children,
  title,
  description,
  search,
  className,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
  search?: ReactNode;
  className?: string;
}) {
  return (
    <SectionCard className={cn("overflow-hidden", className)}>
      {title || search ? (
        <div className="flex flex-col gap-3 border-b border-black/[0.06] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="min-w-0 shrink-0">
            {title ? (
              <h2 className="text-[15px] font-semibold text-foreground">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="whitespace-nowrap text-sm text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {search}
        </div>
      ) : null}
      <div className="p-4 sm:p-5">{children}</div>
    </SectionCard>
  );
}

export function SplitTableCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0 flex-1 overflow-hidden rounded-xl border border-black/[0.06] bg-white",
        className,
      )}
    >
      <div className="overflow-x-auto overflow-y-hidden">{children}</div>
    </div>
  );
}

export function FormCard({
  children,
  className,
  icon: Icon,
  title,
  description,
}: {
  children: ReactNode;
  className?: string;
  icon?: LucideIcon;
  title?: string;
  description?: string;
}) {
  return (
    <SectionCard className={cn("overflow-visible p-4 sm:p-5", className)}>
      {title ? (
        <div className="mb-5 flex items-start gap-3">
          {Icon ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
          ) : null}
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
      ) : null}
      {children}
    </SectionCard>
  );
}
