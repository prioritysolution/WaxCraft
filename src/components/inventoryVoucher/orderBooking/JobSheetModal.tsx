"use client";

import { useWorkProcess } from "@/container/master/workProcess/Hooks";
import { useItemColour } from "@/container/master/itemColour/Hooks";
import { useItemUnit } from "@/container/master/itemUnit/Hooks";
import { getDesignAPI } from "@/container/master/design/DesignApis";
import { getModalClassNames } from "@/lib/uiStyles";
import { ModalActionIcon } from "@/lib/modalActionIcons";
import { ApiResponse } from "@/types/ApiTypes";
import { OrderBookingTableData } from "@/types/inventoryVoucher/OrderBookingTypes";
import { ItemColourTableData } from "@/types/master/ItemColourTypes";
import { ItemUnitTableData } from "@/types/master/ItemUnitTypes";
import { WorkProcessTableData } from "@/types/master/WorkProcessTypes";
import { formatTwoDecimals } from "@/utils/formatDecimal";
import getCookieData from "@/utils/getCookieData";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@heroui/react";
import { format } from "date-fns";
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";

interface WorkProcessState {
  workProcessData: WorkProcessTableData[];
}

interface ItemColourState {
  itemColourData: ItemColourTableData[];
}

interface ItemUnitState {
  itemUnitData: ItemUnitTableData[];
}

interface RootState {
  workProcess: WorkProcessState;
  itemColour: ItemColourState;
  itemUnit: ItemUnitState;
}

const DEFAULT_WHITE_COLOR = "WHITE";

const formatQty = (value: unknown, empty = "") => {
  if (value == null || value === "") return empty;
  const num = Number(value);
  if (!Number.isFinite(num)) {
    const raw = String(value).trim();
    return raw || empty;
  }
  if (Number.isInteger(num)) return String(num);
  return String(parseFloat(num.toFixed(4)));
};

type JobSheetModalProps = {
  order: OrderBookingTableData | null;
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
};

type ParsedStone = {
  key: string;
  size: string;
  particular: string;
  color: string;
  qty: number;
};

const resolveDesignUnitLabel = (
  design:
    | {
        Design_Id?: number | string;
        Design_Unit?: number | string | null;
        Unit_Id?: number | string | null;
        Unit_Name?: string | null;
      }
    | null
    | undefined,
  units: ItemUnitTableData[],
  designUnitById: Record<string, string>,
) => {
  const unitName = String(design?.Unit_Name ?? "").trim();
  if (unitName) return unitName;

  const unitId =
    design?.Design_Unit ??
    design?.Unit_Id ??
    designUnitById[String(design?.Design_Id ?? "")];

  if (unitId != null && String(unitId).trim() !== "") {
    const match = units.find((unit) => String(unit.Id) === String(unitId));
    if (match?.Unit_Name) return match.Unit_Name;
  }

  return "";
};

const getColourLabel = (item: ItemColourTableData): string =>
  String(item.Color_Name || item.Colour_Name || "")
    .trim()
    .toUpperCase();

const isWhiteColour = (value: string): boolean => {
  const raw = value.trim().toUpperCase();
  return raw === "WHITE" || raw === "WHT" || raw.includes("WHITE");
};

const resolveColourAlias = (value: string): string => {
  const raw = value.trim().toUpperCase();
  if (!raw) return "";
  if (raw.includes("CHAMP") || raw.includes("SYAMP")) return "SYAMPEN";
  if (raw.includes("YELLOW") || raw === "YELL") return "YELL";
  if (raw.includes("WHITE") || raw === "WHT") return DEFAULT_WHITE_COLOR;
  if (raw.includes("PURPLE") || raw.includes("VIOLET")) return "PURPLE";
  if (raw.includes("GREEN")) return "GREEN";
  if (raw.includes("BLUE")) return "BLUE";
  if (raw.includes("AQUA")) return "AQUA";
  if (raw.includes("PINK")) return "PINK";
  if (raw.includes("MINT")) return "MINT";
  if (raw.includes("RED")) return "RED";
  return raw;
};

const normalizeColor = (value: string, availableColors: string[]): string => {
  const raw = value.trim().toUpperCase();
  if (!raw) return "";

  const exact = availableColors.find((color) => color === raw);
  if (exact) return exact;

  const alias = resolveColourAlias(raw);
  const byAlias = availableColors.find(
    (color) =>
      color === alias ||
      color.includes(alias) ||
      alias.includes(color) ||
      color.startsWith(raw) ||
      raw.startsWith(color),
  );
  if (byAlias) return byAlias;

  return alias || raw;
};

const parseStoneItem = (
  item: OrderBookingTableData["DesignRow"][number]["ItemRow"][number],
  availableColors: string[],
): ParsedStone => {
  const name = String(item.Item_Name || "").trim();
  const parts = name
    .split(" - ")
    .map((part) => part.trim())
    .filter(Boolean);

  let size = name || "—";
  let particular = name || "—";
  let color = "";

  if (parts.length >= 4 && /stone/i.test(parts[0])) {
    size = `${parts[1]}-${parts[2]}`;
    particular = size;
    color = normalizeColor(parts[3], availableColors);
  } else if (parts.length >= 3) {
    size = parts.slice(0, -1).join("-");
    particular = size;
    color = normalizeColor(parts[parts.length - 1], availableColors);
  } else if (parts.length === 2) {
    size = parts[0];
    particular = parts[0];
    color = normalizeColor(parts[1], availableColors);
  }

  return {
    key: `${item.Item_Id}-${size}-${color}-${item.Item_Qnty}`,
    size,
    particular,
    color,
    qty: Number(item.Item_Qnty) || 0,
  };
};

const JobSheetModal: FC<JobSheetModalProps> = ({
  order,
  isOpen,
  onOpenChange,
}) => {
  const [orgName, setOrgName] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<number | null>(null);
  const [designUnitById, setDesignUnitById] = useState<Record<string, string>>(
    {},
  );
  const printRef = useRef<HTMLDivElement>(null);
  const { getWorkProcessApiCall } = useWorkProcess();
  const { getItemColourApiCall } = useItemColour();
  const { getItemUnitApiCall } = useItemUnit();

  const workProcessData: WorkProcessTableData[] = useSelector(
    (state: RootState) => state?.workProcess?.workProcessData ?? [],
  );
  const itemColourData: ItemColourTableData[] = useSelector(
    (state: RootState) => state?.itemColour?.itemColourData ?? [],
  );
  const itemUnitData: ItemUnitTableData[] = useSelector(
    (state: RootState) => state?.itemUnit?.itemUnitData ?? [],
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgName(getCookieData<string | null>("waxCraftClientOrgName"));
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  useEffect(() => {
    if (isOpen && orgId) {
      getWorkProcessApiCall(orgId);
      getItemColourApiCall(orgId, 1, "", 500);
      getItemUnitApiCall(orgId);
    }
  }, [isOpen, orgId]);

  useEffect(() => {
    if (!isOpen || !orgId) return;

    let cancelled = false;

    const loadDesignUnits = async () => {
      try {
        const res: ApiResponse = await getDesignAPI(orgId, 1, "", 500);
        if (cancelled || (res.status !== 200 && res.status !== 202)) return;

        const details = res.data.details;
        const rows = Array.isArray(details)
          ? details
          : Array.isArray(details?.data)
            ? details.data
            : [];

        const nextMap: Record<string, string> = {};
        rows.forEach((row: Record<string, unknown>) => {
          const designId = row?.Id;
          const designUnit = row?.Design_Unit ?? row?.design_unit;
          if (
            designId != null &&
            designUnit != null &&
            String(designUnit).trim() !== ""
          ) {
            nextMap[String(designId)] = String(designUnit);
          }
        });
        setDesignUnitById(nextMap);
      } catch {
        if (!cancelled) setDesignUnitById({});
      }
    };

    void loadDesignUnits();

    return () => {
      cancelled = true;
    };
  }, [isOpen, orgId]);

  const processColumns = useMemo(() => {
    return [...workProcessData]
      .filter((process) => String(process.Process_Name || "").trim())
      .sort(
        (a, b) =>
          Number(a.Process_SI_No ?? 0) - Number(b.Process_SI_No ?? 0),
      )
      .map((process) => ({
        id: process.Id,
        name: String(process.Process_Name).trim(),
      }));
  }, [workProcessData]);

  const colorColumns = useMemo(() => {
    const fromMaster = itemColourData.map(getColourLabel).filter(Boolean);

    const fromItems = (order?.DesignRow || []).flatMap((design) =>
      (design.ItemRow || []).map((item) => {
        const name = String(item.Item_Name || "").trim();
        const parts = name
          .split(" - ")
          .map((part) => part.trim())
          .filter(Boolean);

        if (parts.length >= 4 && /stone/i.test(parts[0])) {
          return resolveColourAlias(parts[3]);
        }
        if (parts.length >= 3) {
          return resolveColourAlias(parts[parts.length - 1]);
        }
        if (parts.length === 2) {
          return resolveColourAlias(parts[1]);
        }
        return "";
      }),
    );

    const uniqueColors = Array.from(
      new Set([...fromMaster, ...fromItems].filter(Boolean)),
    );
    const whiteFromList = uniqueColors.find(isWhiteColour);
    const otherColors = uniqueColors.filter((color) => !isWhiteColour(color));

    return [whiteFromList || DEFAULT_WHITE_COLOR, ...otherColors];
  }, [itemColourData, order]);

  const generatePDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: order?.Order_No
      ? `Job-Sheet-${order.Order_No}`
      : "Job Sheet",
    pageStyle: `
      @page { size: A4; margin: 8mm; }
      html, body {
        background: #ffffff !important;
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .job-sheet-page {
        background: #ffffff !important;
      }
    `,
  });

  const designs = useMemo(() => order?.DesignRow ?? [], [order]);

  const orderDateLabel = useMemo(() => {
    if (!order?.Order_Date) return "";
    try {
      return format(order.Order_Date, "dd-MM-yyyy");
    } catch {
      return String(order.Order_Date);
    }
  }, [order]);

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="normal"
      placement="center"
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="5xl"
      classNames={getModalClassNames("5xl")}
      hideCloseButton
      isDismissable={false}
    >
      <ModalContent>
        <ModalBody className="min-h-0 overflow-hidden bg-white pt-5">
          <div className="max-h-[min(75vh,720px)] w-full overflow-auto bg-white p-0">
            <div ref={printRef} className="mx-auto w-[220mm] max-w-full bg-white">
              <style>{`
                @media print {
                  @page { size: A4; margin: 6mm; }
                  html, body {
                    background: #ffffff !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }
                  .job-sheet-page {
                    background: #ffffff !important;
                    page-break-after: always;
                    break-after: page;
                  }
                  .job-sheet-page:last-child {
                    page-break-after: auto;
                    break-after: auto;
                  }
                }
              `}</style>

              {designs.length ? (
                designs.map((design, designIndex) => {
                  const stones = (design.ItemRow || []).map((item) =>
                    parseStoneItem(item, colorColumns),
                  );
                  const stoneGroups = stones.reduce<
                    Record<
                      string,
                      {
                        size: string;
                        particular: string;
                        qty: number;
                        colors: Record<string, number>;
                      }
                    >
                  >((acc, stone) => {
                    const groupKey = stone.size || stone.particular;
                    if (!acc[groupKey]) {
                      acc[groupKey] = {
                        size: stone.size,
                        particular: stone.particular,
                        qty: 0,
                        colors: {},
                      };
                    }
                    acc[groupKey].qty += stone.qty;
                    if (stone.color) {
                      acc[groupKey].colors[stone.color] =
                        (acc[groupKey].colors[stone.color] || 0) + stone.qty;
                    }
                    return acc;
                  }, {});
                  const stoneRows = Object.values(stoneGroups);
                  const designCode = design.Design_No || design.Design_Name || "—";
                  const designUnit = resolveDesignUnitLabel(
                    design,
                    itemUnitData,
                    designUnitById,
                  );

                  return (
                    <div
                      key={`${order?.Id}-${design.Design_Id}-${designIndex}`}
                      className="job-sheet-page mb-4 bg-white p-0 text-[11px] text-black print:mb-0 print:bg-white"
                    >
                      <div className="overflow-hidden border border-neutral-400">
                        <div className="border-b border-neutral-300 px-3 py-2.5 text-center text-base font-semibold tracking-[0.12em] text-black">
                          {orgName || "Job Sheet"}
                        </div>

                        <div className="grid grid-cols-3 divide-x divide-neutral-300 border-b border-neutral-300 text-[11px]">
                          <div className="px-3 py-2">
                            <span className="text-black">P.CODE-</span>{" "}
                            <span className="font-medium">
                              {design.Design_Name || "—"}
                            </span>
                          </div>
                          <div className="px-3 py-2 text-center">
                            <span className="text-black">D.NO=</span>{" "}
                            <span className="font-medium">{designCode}</span>
                            <span className="ml-3 text-black">
                              P.CODE-
                            </span>{" "}
                            <span className="font-medium">
                              {design.Design_Id || "—"}
                            </span>
                          </div>
                          <div className="px-3 py-2 text-right tabular-nums">
                            <span className="text-black">V-</span>
                            <span className="font-medium">
                              {formatTwoDecimals(design.Wt, "—")}gm
                            </span>
                            <span className="ml-3 text-black">D-</span>
                            <span className="font-medium">
                              {formatTwoDecimals(design.Tot_Wt, "—")}gm
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-[1.35fr_1fr] divide-x divide-neutral-300 border-b border-neutral-300">
                          <div className="flex min-h-[168px] items-center justify-center p-3">
                            {design.Image ? (
                              <Image
                                src={design.Image}
                                alt={design.Design_Name || "Design"}
                                width={150}
                                height={150}
                                className="h-[150px] w-[150px] object-contain"
                              />
                            ) : (
                              <div className="flex h-[150px] w-[150px] items-center justify-center rounded-lg border border-dashed border-neutral-300 text-xs text-neutral-700">
                                No image
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="border-b border-neutral-300 px-3 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-black">
                              1 set stone
                            </div>
                            <table className="w-full border-collapse">
                              <tbody>
                                {stoneRows.length ? (
                                  stoneRows.map((row) => (
                                    <tr
                                      key={`set-${row.size}`}
                                      className="border-b border-neutral-200 last:border-b-0"
                                    >
                                      <td className="px-3 py-1.5 font-medium text-black">
                                        {row.size}
                                      </td>
                                      <td className="w-16 px-3 py-1.5 text-right tabular-nums text-black">
                                        {formatQty(row.qty, "0")}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td className="px-3 py-8 text-center text-neutral-700">
                                      No stone / item data
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="border-b border-neutral-300">
                          <div className="w-full overflow-x-auto">
                            <table className="w-full min-w-full border-collapse table-fixed">
                              <thead>
                                <tr>
                                  <th className="w-[9%] border-b border-r border-neutral-300 px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-black">
                                    WT-D.NO
                                  </th>
                                  <th className="w-[11%] border-b border-r border-neutral-300 px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-black">
                                    ORDER DATE
                                  </th>
                                  {processColumns.length ? (
                                    processColumns.map((column) => (
                                      <th
                                        key={column.id}
                                        className="border-b border-r border-neutral-300 px-2 py-2 text-center text-[9px] font-semibold uppercase tracking-wide text-black last:border-r-0"
                                      >
                                        {column.name}
                                      </th>
                                    ))
                                  ) : (
                                    <th className="border-b border-neutral-300 px-2 py-2 text-center text-[10px] font-semibold text-black">
                                      —
                                    </th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td
                                    rowSpan={3}
                                    className="border-r border-neutral-300 px-2 py-1.5 align-top font-medium"
                                  >
                                    {designCode}
                                  </td>
                                  <td
                                    rowSpan={3}
                                    className="border-r border-neutral-300 px-2 py-1.5 align-top"
                                  >
                                    {orderDateLabel}
                                  </td>
                                  {processColumns.length ? (
                                    processColumns.map((column) => (
                                      <td
                                        key={`${design.Design_Id}-${column.id}`}
                                        className="h-10 border-b border-r border-neutral-300 px-2 py-1.5 last:border-r-0"
                                      />
                                    ))
                                  ) : (
                                    <td className="h-10 border-b border-neutral-300" />
                                  )}
                                </tr>
                                {Array.from({ length: 2 }).map((_, rowIndex) => (
                                  <tr key={`process-blank-${rowIndex}`}>
                                    {processColumns.length ? (
                                      processColumns.map((column) => (
                                        <td
                                          key={`${design.Design_Id}-blank-${rowIndex}-${column.id}`}
                                          className={`h-10 border-r border-neutral-300 px-2 py-1.5 last:border-r-0 ${
                                            rowIndex < 1
                                              ? "border-b border-neutral-300"
                                              : ""
                                          }`}
                                        />
                                      ))
                                    ) : (
                                      <td
                                        className={`h-10 ${
                                          rowIndex < 1
                                            ? "border-b border-neutral-300"
                                            : ""
                                        }`}
                                      />
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="border-b border-neutral-300">
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] border-collapse">
                              <thead>
                                <tr>
                                  <th className="border-b border-r border-neutral-300 px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wide text-black">
                                    SIZE
                                  </th>
                                  <th className="border-b border-r border-neutral-300 px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wide text-black">
                                    PARTICULAR
                                  </th>
                                  {colorColumns.map((color) => (
                                    <th
                                      key={color}
                                      className="border-b border-r border-neutral-300 px-1.5 py-1.5 text-center text-[9px] font-semibold uppercase tracking-wide text-black last:border-r-0"
                                    >
                                      {color}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {(stoneRows.length
                                  ? stoneRows
                                  : Array.from({ length: 8 }).map(() => ({
                                      size: "",
                                      particular: "",
                                      qty: 0,
                                      colors: {} as Record<string, number>,
                                    }))
                                ).map((row, index) => (
                                  <tr
                                    key={`matrix-${row.size || index}`}
                                    className="border-b border-neutral-200 last:border-b-0"
                                  >
                                    <td className="border-r border-neutral-300 px-2 py-1.5">
                                      {row.size}
                                    </td>
                                    <td className="border-r border-neutral-300 px-2 py-1.5">
                                      {row.particular}
                                    </td>
                                    {colorColumns.map((color) => (
                                      <td
                                        key={`${index}-${color}`}
                                        className="border-r border-neutral-300 px-1.5 py-1.5 text-center tabular-nums last:border-r-0"
                                      >
                                        {row.colors?.[color]
                                          ? formatQty(row.colors[color], "")
                                          : ""}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="w-full p-3">
                          <div className="min-h-[120px] w-full p-0">
                            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-black">
                              Notes / Summary
                            </div>
                            <div className="space-y-1.5 text-[11px] text-black">
                              <div>Order: {order?.Order_No || "—"}</div>
                              <div>
                                Qty: {formatQty(design.Order_Qnty, "—")}
                                {designUnit ? ` ${designUnit}` : ""}
                              </div>
                              <div>
                                Design: {design.Design_Name || "—"} /{" "}
                                {design.Design_No || "—"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-10 text-center text-sm text-neutral-700">
                  No design details found for this order.
                </div>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="flat"
            onPress={() => onOpenChange(false)}
            size="lg"
            radius="sm"
            className="w-32"
            startContent={<ModalActionIcon label="Cancel" />}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            size="lg"
            radius="sm"
            className="w-32"
            isDisabled={!designs.length}
            onPress={() => generatePDF()}
            startContent={<ModalActionIcon label="Print" />}
          >
            Print
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JobSheetModal;
