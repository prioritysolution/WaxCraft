interface PurchaseTypeSource {
  Purchase_Type?: string | number | null;
  Pur_Type?: string | number | null;
  Is_Order?: string | number | null;
}

const ORDERED_VALUES = ["o", "1", "true"];
const REGULAR_VALUES = ["r", "0", "false"];

const classify = (value: unknown): "O" | "R" | null => {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) return null;
  if (ORDERED_VALUES.includes(raw) || raw.includes("order")) return "O";
  if (REGULAR_VALUES.includes(raw) || raw.includes("regular")) return "R";
  return null;
};

/** Pur_Type: 1 → Regular, 2 → Ordered. */
const classifyPurType = (value: unknown): "O" | "R" | null => {
  const raw = String(value ?? "").trim();
  if (raw === "1") return "R";
  if (raw === "2") return "O";
  return null;
};

/** "O" (ordered) / "R" (regular); `Pur_Type` wins, then the type text, then `Is_Order`. */
export const resolvePurchaseOrderType = (
  data: PurchaseTypeSource,
): "O" | "R" | null =>
  classifyPurType(data.Pur_Type) ??
  classify(data.Purchase_Type) ??
  classify(data.Is_Order);

export const getPurchaseTypeLabel = (data: PurchaseTypeSource) => {
  const type = resolvePurchaseOrderType(data);
  if (type === "O") return "Ordered Purchase";
  if (type === "R") return "Regular Purchase";
  return "—";
};
