import { format, parseISO } from "date-fns";
import { SalesReportTableData } from "@/types/inventoryReport/SalesReportTypes";
import { PurchaseReportTableData } from "@/types/inventoryReport/PurchaseReportTypes";
import { DashboardCharts } from "@/types/dashboard/DashboardTypes";

const CHART_COLORS = {
  sales: "hsl(var(--chart-1))",
  purchases: "hsl(var(--chart-2))",
  pipeline: "hsl(var(--chart-4))",
  net: "hsl(var(--chart-3))",
  orders: "hsl(var(--chart-1))",
  parties: "hsl(var(--chart-2))",
  items: "hsl(var(--chart-4))",
  booked: "hsl(var(--chart-5))",
};

const parseAmount = (value: string | number | null | undefined) => {
  const parsed = Number.parseFloat(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseRowDate = (value: string) => {
  if (!value) return null;

  const normalized = value.includes("T") ? value : `${value}T00:00:00`;
  const parsed = parseISO(normalized);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const groupAmountByMonth = (
  rows: Array<Record<string, string>>,
  dateField: string,
  amountField: string
) => {
  const grouped = new Map<string, number>();

  rows.forEach((row) => {
    const date = parseRowDate(row[dateField]);
    if (!date) return;

    const key = format(date, "yyyy-MM");
    grouped.set(key, (grouped.get(key) ?? 0) + parseAmount(row[amountField]));
  });

  return grouped;
};

export const buildDashboardCharts = ({
  salesReport,
  purchaseReport,
  salesTotal,
  purchaseTotal,
  orderPipeline,
  netPosition,
  activeOrdersCount,
  partiesCount,
  itemsCount,
  ordersBookedCount,
}: {
  salesReport: SalesReportTableData[];
  purchaseReport: PurchaseReportTableData[];
  salesTotal: number;
  purchaseTotal: number;
  orderPipeline: number;
  netPosition: number;
  activeOrdersCount: number;
  partiesCount: number;
  itemsCount: number;
  ordersBookedCount: number;
}): DashboardCharts => {
  const salesByMonth = groupAmountByMonth(
    salesReport as unknown as Array<Record<string, string>>,
    "Sales_Date",
    "Amount"
  );
  const purchasesByMonth = groupAmountByMonth(
    purchaseReport as unknown as Array<Record<string, string>>,
    "Purchase_Date",
    "Amount"
  );

  const monthKeys = Array.from(
    new Set([...salesByMonth.keys(), ...purchasesByMonth.keys()])
  ).sort();

  const monthlyTrend = monthKeys.map((key) => {
    const date = parseISO(`${key}-01T00:00:00`);

    return {
      month: format(date, "MMM yy"),
      sales: salesByMonth.get(key) ?? 0,
      purchases: purchasesByMonth.get(key) ?? 0,
    };
  });

  const fyComparison = [
    { name: "Sales", value: salesTotal, fill: CHART_COLORS.sales },
    { name: "Purchases", value: purchaseTotal, fill: CHART_COLORS.purchases },
    { name: "Pipeline", value: orderPipeline, fill: CHART_COLORS.pipeline },
    {
      name: "Net",
      value: Math.abs(netPosition),
      fill: CHART_COLORS.net,
    },
  ];

  const operations = [
    {
      name: "Active Orders",
      value: activeOrdersCount,
      fill: CHART_COLORS.orders,
    },
    { name: "Parties", value: partiesCount, fill: CHART_COLORS.parties },
    { name: "Items", value: itemsCount, fill: CHART_COLORS.items },
    {
      name: "Orders Booked",
      value: ordersBookedCount,
      fill: CHART_COLORS.booked,
    },
  ];

  const businessMix = [
    { name: "Sales", value: salesTotal, fill: CHART_COLORS.sales },
    { name: "Purchases", value: purchaseTotal, fill: CHART_COLORS.purchases },
    { name: "Pipeline", value: orderPipeline, fill: CHART_COLORS.pipeline },
  ].filter((item) => item.value > 0);

  return {
    monthlyTrend,
    fyComparison,
    operations,
    businessMix,
  };
};

export const formatChartCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    notation: value >= 100000 ? "compact" : "standard",
  }).format(value);

export const formatChartCount = (value: number) =>
  new Intl.NumberFormat("en-IN").format(value);
