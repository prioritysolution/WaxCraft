"use client";

import {
  Check,
  Cog,
  Eye,
  FileSpreadsheet,
  LogOut,
  Plus,
  Printer,
  Save,
  Search,
  Trash2,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";

export function resolveModalActionIcon(label: string): LucideIcon {
  const key = label.trim().toLowerCase();

  if (key === "cancel" || key === "close" || key === "no") return X;
  if (key === "preview" || key.includes("preview")) return Eye;
  if (key === "print" || key.includes("print")) return Printer;
  if (key === "delete") return Trash2;
  if (key === "save" || key === "update") return Save;
  if (key === "ok" || key === "confirm" || key === "yes") return Check;
  if (key === "add" || key.startsWith("add ") || key.includes("add to"))
    return Plus;
  if (key === "log out" || key === "logout") return LogOut;
  if (key === "process invoice" || key.includes("invoice")) return FileSpreadsheet;
  if (key === "process" || key.includes("process")) return Workflow;
  if (key === "search" || key.includes("search")) return Search;
  if (key.includes("report") || key === "generate" || key === "get")
    return FileSpreadsheet;
  if (key.includes("assign")) return Cog;

  return Check;
}

export function ModalActionIcon({
  label,
  className = "h-4 w-4",
}: {
  label: string;
  className?: string;
}) {
  const Icon = resolveModalActionIcon(label);
  return <Icon className={className} aria-hidden="true" />;
}
