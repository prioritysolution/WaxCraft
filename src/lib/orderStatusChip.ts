export type OrderStatusChipColor =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger";

type OrderStatusChipProps = {
  color: OrderStatusChipColor;
  className?: string;
};

const normalizeStatus = (status?: string | null) =>
  String(status ?? "")
    .trim()
    .toLowerCase();

export function getOrderStatusChipProps(
  status?: string | null,
): OrderStatusChipProps {
  const value = normalizeStatus(status);

  if (value === "product ready" || value === "completed") {
    return { color: "success" };
  }

  if (value === "ordered") {
    return { color: "warning" };
  }

  if (value === "in process" || value === "processing") {
    return { color: "primary" };
  }

  if (value.includes("out for")) {
    return {
      color: "default",
      className: "!bg-sky-100 !text-sky-800",
    };
  }

  if (value.includes("cancel")) {
    return { color: "danger" };
  }

  return { color: "default" };
}
