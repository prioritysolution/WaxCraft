import { getDesignAPI } from "@/container/master/design/DesignApis";
import { ApiResponse } from "@/types/ApiTypes";
import { ItemUnitTableData } from "@/types/master/ItemUnitTypes";

const DESIGN_PAGE_SIZE = 500;
const MAX_DESIGN_PAGES = 50;

type DesignUnitSource = {
  Design_Id?: number | string;
  Design_Unit?: number | string | null;
  Unit_Id?: number | string | null;
  Unit_Name?: string | null;
  design_unit?: number | string | null;
} | null | undefined;

const extractRows = (details: unknown): Record<string, unknown>[] => {
  if (Array.isArray(details)) return details;
  const data = (details as { data?: unknown } | null)?.data;
  return Array.isArray(data) ? data : [];
};

const toUnitList = (units: unknown): ItemUnitTableData[] => {
  if (Array.isArray(units)) return units;
  const data = (units as { data?: unknown } | null)?.data;
  return Array.isArray(data) ? (data as ItemUnitTableData[]) : [];
};

const hasValue = (value: unknown) =>
  value != null && String(value).trim() !== "";

// The API may cap per_page below the requested size, so every page is read to
// make sure recently added designs are included in the Design_Id → unit map.
export const loadDesignUnitMap = async (
  orgId: number | string,
): Promise<Record<string, string>> => {
  const map: Record<string, string> = {};

  const collect = (rows: Record<string, unknown>[]) => {
    rows.forEach((row) => {
      const designId = row?.Id ?? row?.Design_Id;
      const designUnit = row?.Design_Unit ?? row?.design_unit;
      if (hasValue(designId) && hasValue(designUnit)) {
        map[String(designId)] = String(designUnit);
      }
    });
  };

  const first: ApiResponse = await getDesignAPI(
    orgId,
    1,
    "",
    DESIGN_PAGE_SIZE,
  );
  if (first.status !== 200 && first.status !== 202) return map;

  const details = first.data?.details;
  collect(extractRows(details));

  const lastPage = Math.min(
    Number((details as { last_page?: unknown } | null)?.last_page) || 1,
    MAX_DESIGN_PAGES,
  );

  if (lastPage > 1) {
    const rest = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) =>
        getDesignAPI(orgId, index + 2, "", DESIGN_PAGE_SIZE).catch(
          () => null,
        ),
      ),
    );
    rest.forEach((res) => {
      if (res && (res.status === 200 || res.status === 202)) {
        collect(extractRows(res.data?.details));
      }
    });
  }

  return map;
};

// Tries every unit id candidate (order row first, then the design master) and
// returns the first one that exists in the unit list; empty/0 ids are skipped.
export const resolveDesignUnitName = (
  design: DesignUnitSource,
  units: unknown,
  designUnitById: Record<string, string>,
): string => {
  const unitName = String(design?.Unit_Name ?? "").trim();
  if (unitName) return unitName;

  const unitList = toUnitList(units);
  if (!unitList.length) return "";

  const candidates = [
    design?.Design_Unit,
    design?.Unit_Id,
    design?.design_unit,
    designUnitById[String(design?.Design_Id ?? "")],
  ];

  for (const candidate of candidates) {
    if (!hasValue(candidate)) continue;
    const match = unitList.find(
      (unit) => String(unit.Id) === String(candidate).trim(),
    );
    if (match?.Unit_Name) return match.Unit_Name;
  }

  return "";
};
