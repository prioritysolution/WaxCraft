import { format, parseISO } from "date-fns";
import { buildDashboardCharts } from "@/lib/dashboardChartData";
import {
  DASHBOARD_ACTIVITY_LINKS,
} from "@/lib/dashboardLinks";
import {
  DashboardActivityItem,
  DashboardChartPoint,
  DashboardCharts,
  DashboardOverviewItem,
  DashboardStat,
} from "@/types/dashboard/DashboardTypes";
import {
  DashboardChartPointApiRow,
  DashboardMonthlyTrendApiRow,
  DashboardRecentActivityApiRow,
  DashboardStatsApiDetails,
} from "@/types/dashboard/DashboardApiTypes";
import {
  Banknote,
  Boxes,
  ClipboardList,
  IndianRupee,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

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

const parseCount = (value: string | number | null | undefined) => {
  const parsed = Number.parseInt(String(value ?? "").replace(/,/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCount = (value: number) =>
  new Intl.NumberFormat("en-IN").format(value);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const pickValue = (
  details: Record<string, unknown>,
  keys: string[]
): string | number | undefined => {
  for (const key of keys) {
    const value = details[key];
    if (value !== undefined && value !== null && value !== "") {
      return value as string | number;
    }
  }
  return undefined;
};

const normalizeDetails = (
  details: DashboardStatsApiDetails | Record<string, unknown>
): Record<string, unknown> => {
  const record = details as Record<string, unknown>;
  const nestedStats = record.Stats;

  if (nestedStats && typeof nestedStats === "object") {
    return {
      ...(nestedStats as Record<string, unknown>),
      ...record,
    };
  }

  return record;
};

const pickNestedValue = (
  details: Record<string, unknown>,
  parentKey: string,
  key: string
): string | number | undefined => {
  const parent = details[parentKey];
  if (!parent || typeof parent !== "object") return undefined;
  const value = (parent as Record<string, unknown>)[key];
  if (value === undefined || value === null || value === "") return undefined;
  return value as string | number;
};

const mapChartPoints = (
  rows: DashboardChartPointApiRow[] | undefined,
  fallback: DashboardChartPoint[]
): DashboardChartPoint[] => {
  if (!Array.isArray(rows) || rows.length === 0) return fallback;

  return rows.map((row, index) => ({
    name: String(row.name ?? row.Name ?? `Item ${index + 1}`),
    value: parseAmount(row.value ?? row.Value),
    fill: String(row.fill ?? row.Fill ?? CHART_COLORS.sales),
  }));
};

const mapMonthlyTrend = (
  rows: DashboardMonthlyTrendApiRow[] | undefined
): DashboardCharts["monthlyTrend"] => {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  return rows.map((row) => ({
    month: String(row.Month_Label ?? row.Month ?? row.month ?? "—"),
    sales: parseAmount(row.Sales ?? row.sales),
    purchases: parseAmount(row.Purchases ?? row.purchases),
  }));
};

const normalizeActivityType = (
  value: string | undefined
): DashboardActivityItem["type"] | null => {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (normalized.includes("order")) return "order";
  if (normalized.includes("sale") || normalized.includes("invoice")) return "sale";
  if (normalized.includes("purchase")) return "purchase";

  return null;
};

const mapRecentActivity = (
  rows: DashboardRecentActivityApiRow[] | undefined
): DashboardActivityItem[] => {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  const activity: DashboardActivityItem[] = [];

  rows.forEach((row, index) => {
    const type = normalizeActivityType(
      row.Activity_Type ?? row.activity_type ?? row.Type
    );
    if (!type) return;

    const referenceNo = row.Reference_No ?? row.Title ?? "";
    const title =
      row.Title ??
      (type === "order"
        ? `Order ${referenceNo}`
        : type === "sale"
          ? `Invoice ${referenceNo}`
          : `Purchase ${referenceNo}`);

    const amountValue = row.Amount ?? row.Total_Amount;
    const id = row.Id ?? row.Reference_Id ?? index + 1;

    activity.push({
      id: `${type}-${id}`,
      type,
      title,
      subtitle: String(row.Subtitle ?? row.Party_Name ?? "—"),
      date: String(row.Activity_Date ?? row.Date ?? ""),
      amount:
        amountValue !== undefined && amountValue !== null
          ? String(amountValue)
          : undefined,
      href: DASHBOARD_ACTIVITY_LINKS[type],
    });
  });

  return activity.slice(0, 8);
};

const buildSummaryRecentActivity = (
  payload: Record<string, unknown>
): DashboardActivityItem[] => {
  const summary: DashboardActivityItem[] = [];
  const activeOrderCount = parseCount(pickNestedValue(payload, "ActiveOrder", "Count"));
  const activeOrderAmount = parseAmount(
    pickNestedValue(payload, "ActiveOrder", "Amount")
  );
  const salesCount = parseCount(
    pickNestedValue(payload, "InvoiseList", "Count") ??
      pickNestedValue(payload, "SalesRegister", "Count")
  );
  const purchaseCount = parseCount(
    pickNestedValue(payload, "PurchaseList", "Count") ??
      pickNestedValue(payload, "PurchaseRegister", "Count")
  );

  if (activeOrderCount > 0) {
    summary.push({
      id: "summary-order",
      type: "order",
      title: `${formatCount(activeOrderCount)} active orders`,
      subtitle: "Current in-process orders",
      date: "",
      amount: activeOrderAmount > 0 ? String(activeOrderAmount) : undefined,
      href: DASHBOARD_ACTIVITY_LINKS.order,
    });
  }

  if (salesCount > 0) {
    summary.push({
      id: "summary-sale",
      type: "sale",
      title: `${formatCount(salesCount)} sales invoices`,
      subtitle: "Invoices recorded in current FY",
      date: "",
      href: DASHBOARD_ACTIVITY_LINKS.sale,
    });
  }

  if (purchaseCount > 0) {
    summary.push({
      id: "summary-purchase",
      type: "purchase",
      title: `${formatCount(purchaseCount)} purchases`,
      subtitle: "Purchase entries recorded in current FY",
      date: "",
      href: DASHBOARD_ACTIVITY_LINKS.purchase,
    });
  }

  return summary;
};

export interface MappedDashboardData {
  stats: DashboardStat[];
  overview: DashboardOverviewItem[];
  recentActivity: DashboardActivityItem[];
  charts: DashboardCharts;
}

export const mapDashboardStatsResponse = (
  details: DashboardStatsApiDetails | Record<string, unknown>,
  periodLabel: string
): MappedDashboardData => {
  const payload = normalizeDetails(details);

  const activeOrdersCount = parseCount(
    pickNestedValue(payload, "ActiveOrder", "Count") ??
      pickValue(payload, ["Active_Orders", "Active_Order_Count"])
  );
  const salesTotal = parseAmount(
    pickNestedValue(payload, "SalesRegister", "Amount") ??
      pickValue(payload, ["Sales_Total", "Fy_Sales"])
  );
  const salesInvoiceCount = parseCount(
    pickNestedValue(payload, "InvoiseList", "Count") ??
      pickNestedValue(payload, "SalesRegister", "Count") ??
      pickValue(payload, ["Sales_Invoice_Count", "Sales_Count"])
  );
  const purchaseTotal = parseAmount(
    pickNestedValue(payload, "PurchaseRegister", "Amount") ??
      pickValue(payload, ["Purchase_Total", "Fy_Purchases"])
  );
  const purchaseCount = parseCount(
    pickNestedValue(payload, "PurchaseRegister", "Count") ??
      pickNestedValue(payload, "PurchaseList", "Count") ??
      pickValue(payload, ["Purchase_Count", "Purchase_Entry_Count"])
  );
  const orderPipeline = parseAmount(
    pickNestedValue(payload, "OrderBook", "Amount") ??
      pickValue(payload, ["Order_Pipeline", "Order_Pipeline_Total"])
  );
  const ordersBookedCount = parseCount(
    pickNestedValue(payload, "OrderBook", "Count") ??
      pickValue(payload, ["Order_Book_Count", "Orders_Booked"])
  );
  const partiesCount = parseCount(
    pickNestedValue(payload, "PartyList", "Count") ??
      pickValue(payload, ["Party_Count", "Parties"])
  );
  const itemsCount = parseCount(
    pickNestedValue(payload, "ItemList", "Count") ??
      pickValue(payload, ["Item_Count", "Inventory_Items"])
  );
  const netPosition = parseAmount(
    pickValue(payload, ["Net_Business"])
  ) || salesTotal - purchaseTotal;

  const salesRegister = Array.isArray(payload.Sales_Register)
    ? payload.Sales_Register
    : [];
  const purchaseRegister = Array.isArray(payload.Purchase_Register)
    ? payload.Purchase_Register
    : [];

  const stats: DashboardStat[] = [
    {
      label: "Active Orders",
      value: formatCount(activeOrdersCount),
      hint: "Orders currently in process",
      icon: ClipboardList,
      href: "/inventoryVoucher/orderBooking",
    },
    {
      label: "FY Sales",
      value: formatCurrency(salesTotal),
      hint: `${formatCount(salesInvoiceCount)} invoices this year`,
      icon: ShoppingCart,
      href: "/inventoryReport/salesReport",
    },
    {
      label: "FY Purchases",
      value: formatCurrency(purchaseTotal),
      hint: `${formatCount(purchaseCount)} purchase entries`,
      icon: Receipt,
      href: "/inventoryReport/purchaseReport",
    },
    {
      label: "Order Pipeline",
      value: formatCurrency(orderPipeline),
      hint: `${formatCount(ordersBookedCount)} booked order lines`,
      icon: TrendingUp,
      href: "/inventoryReport/orderBook",
    },
    {
      label: "Parties",
      value: formatCount(partiesCount),
      hint: "Customers and suppliers",
      icon: Users,
      href: "/master/party",
    },
    {
      label: "Inventory Items",
      value: formatCount(itemsCount),
      hint: "Items tracked across categories",
      icon: Boxes,
      href: "/master/item",
    },
    {
      label: "Net Business",
      value: formatCurrency(netPosition),
      hint: "Sales minus purchases (FY)",
      icon: IndianRupee,
      href: "/accountingReport/dayBook",
    },
    {
      label: "Orders Booked",
      value: formatCount(ordersBookedCount),
      hint: "Order lines in current FY",
      icon: Banknote,
      href: "/inventoryReport/orderBook",
    },
  ];

  const overview: DashboardOverviewItem[] = [
    {
      label: "Financial year",
      value: periodLabel,
    },
    {
      label: "Total sales",
      value: formatCurrency(salesTotal),
      href: "/inventoryReport/salesReport",
    },
    {
      label: "Total purchases",
      value: formatCurrency(purchaseTotal),
      href: "/inventoryReport/purchaseReport",
    },
    {
      label: "Active orders",
      value: formatCount(activeOrdersCount),
      href: "/inventoryVoucher/orderBooking",
    },
    {
      label: "Parties onboarded",
      value: formatCount(partiesCount),
      href: "/master/party",
    },
    {
      label: "Items in master",
      value: formatCount(itemsCount),
      href: "/master/item",
    },
  ];

  const recentActivity = mapRecentActivity(
    (payload.Recent_Activity ?? payload.recent_activity) as
      | DashboardRecentActivityApiRow[]
      | undefined
  );
  const fallbackRecentActivity = buildSummaryRecentActivity(payload);

  const builtCharts = buildDashboardCharts({
    salesReport: salesRegister,
    purchaseReport: purchaseRegister,
    salesTotal,
    purchaseTotal,
    orderPipeline,
    netPosition,
    activeOrdersCount,
    partiesCount,
    itemsCount,
    ordersBookedCount,
  });

  const apiMonthlyTrend = mapMonthlyTrend(
    (payload.Monthly_Trend ?? payload.monthly_trend) as
      | DashboardMonthlyTrendApiRow[]
      | undefined
  );

  const charts: DashboardCharts = {
    monthlyTrend:
      apiMonthlyTrend.length > 0
        ? apiMonthlyTrend
        : builtCharts.monthlyTrend.length > 0
          ? builtCharts.monthlyTrend
          : salesTotal > 0 || purchaseTotal > 0
            ? [
                {
                  month: "FY Total",
                  sales: salesTotal,
                  purchases: purchaseTotal,
                },
              ]
            : [],
    fyComparison: mapChartPoints(
      (payload.Fy_Comparison ?? payload.fy_comparison) as
        | DashboardChartPointApiRow[]
        | undefined,
      builtCharts.fyComparison
    ),
    operations: mapChartPoints(
      (payload.Operations ?? payload.operations) as
        | DashboardChartPointApiRow[]
        | undefined,
      builtCharts.operations
    ),
    businessMix: mapChartPoints(
      (payload.Business_Mix ?? payload.business_mix) as
        | DashboardChartPointApiRow[]
        | undefined,
      builtCharts.businessMix
    ),
  };

  return {
    stats,
    overview,
    recentActivity:
      recentActivity.length > 0 ? recentActivity : fallbackRecentActivity,
    charts,
  };
};

export const formatDashboardPeriodLabel = (
  finStart: string,
  reportToDate: string
) => {
  const formatDisplayDate = (value: string) => {
    if (!value) return "—";

    const parsed = parseISO(value.includes("T") ? value : `${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return value;

    return format(parsed, "dd MMM yyyy");
  };

  return `${formatDisplayDate(finStart)} – ${formatDisplayDate(reportToDate)}`;
};
