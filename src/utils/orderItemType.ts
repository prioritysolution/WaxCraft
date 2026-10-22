interface OrderItemTypeSource {
  Is_Party?: unknown;
  Is_Own?: unknown;
}

const isFlagSet = (value: unknown) =>
  value === true || ["1", "true"].includes(String(value).trim().toLowerCase());

const isFlagEmpty = (value: unknown) =>
  value == null || String(value).trim() === "";

/** Is_Party: 0 → Own, 1 → Party (falls back to Is_Own: 1 → Own, 0 → Party). */
export const getOrderItemType = (order: OrderItemTypeSource) => {
  if (!isFlagEmpty(order.Is_Party)) {
    return isFlagSet(order.Is_Party) ? "Party" : "Own";
  }
  if (!isFlagEmpty(order.Is_Own)) {
    return isFlagSet(order.Is_Own) ? "Own" : "Party";
  }
  return "—";
};
