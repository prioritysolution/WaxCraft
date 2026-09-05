import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useListPerPage } from "@/lib/useListPerPage";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";
import { useDispatch, useSelector } from "react-redux";
import {
  SamplePrintFormData,
  SamplePrintTableData,
  SamplePrintDesignTableData,
} from "@/types/inventoryVoucher/SamplePrintTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { ChildRow } from "@/types/master/DesignTypes";
import { getOrderDesignDetailsData } from "../orderBooking/OrderBookingReducer";
import {
  getDesignDetailsAPI,
} from "../orderBooking/OrderBookingApis";
import {
  addSamplePrintAPI,
  deleteSamplePrintAPI,
  getSamplePrintAPI,
  getSamplePrintDetailsAPI,
} from "./SamplePrintApis";
import { getSamplePrintData } from "./SamplePrintReducer";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { toTwoDecimalString } from "@/utils/formatDecimal";

/** Design item rates can include up to 3 decimal places (e.g. 0.250). */
const itemRateRegex = /^\d+(\.\d{1,3})?$/;

interface OrderPartyData {
  Id: number;
  Party_Name: string;
  Party_Add: string;
  Party_Mob: string;
  Party_Gst: string;
}

interface OrderBookingState {
  orderPartyData: OrderPartyData[];
}

interface RootState {
  orderBooking: OrderBookingState;
}

const pickValue = (...values: unknown[]) => {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return "";
};

const getDesignRows = (row: Record<string, any>): any[] => {
  const candidates = [
    row.DesignRow,
    row.design_array,
    row.Design_Array,
    row.designArray,
    row.SampleDesignRow,
    row.Design,
    row.design,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) return candidate;
    if (candidate && typeof candidate === "object") return [candidate];
  }

  const sampleArray =
    row.sampleprint_array ||
    row.SamplePrint_Array ||
    row.SamplePrintRow ||
    row.sample_print ||
    row.Sample_Print;
  if (Array.isArray(sampleArray) && sampleArray.length > 0) {
    const flat = flattenSamplePrintRows(sampleArray as Record<string, any>[]);
    const designOnly = flat.filter(
      (entry: Record<string, any>) =>
        (entry.design_id || entry.Design_Id || entry.Design_Name) &&
        !isSamplePrintItemRow(entry)
    );
    if (designOnly.length > 0) return designOnly;
    return flat;
  }

  return [];
};

const normalizeItemType = (value: unknown): string => {
  if (value === true || value === 1 || value === "1") return "1";
  if (value === false || value === 0 || value === "0") return "0";
  const text = String(pickValue(value, "")).trim().toLowerCase();
  if (text === "own" || text === "own item" || text === "yes") return "1";
  if (text === "party" || text === "party item" || text === "no") return "0";
  return String(pickValue(value, ""));
};

const isSamplePrintItemRow = (row: Record<string, any>): boolean => {
  const itemId = row.item_id ?? row.Item_Id;
  if (itemId !== undefined && itemId !== null && String(itemId).trim() !== "") {
    return true;
  }
  // Some payloads omit item_id but still send item quantities / rates.
  const hasItemQty =
    row.item_qnty != null ||
    row.Item_Qnty != null ||
    row.Item_Qty != null ||
    row.Qnty != null;
  const hasItemRate =
    row.item_rate != null ||
    row.Item_Rate != null ||
    row.making_rate != null ||
    row.Making_Rate != null;
  const looksLikeDesignHeader =
    (row.wt != null ||
      row.Wt != null ||
      row.WT != null ||
      row.polish_rate != null ||
      row.qnty_rate != null) &&
    !hasItemQty;
  return Boolean(hasItemQty && hasItemRate && !looksLikeDesignHeader);
};

const getNestedSamplePrintList = (row: Record<string, any>): any[] | null => {
  const candidates = [
    row.sample_print,
    row.Sample_Print,
    row.sampleprint_array,
    row.SamplePrint_Array,
    row.SamplePrintRow,
  ];
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) return candidate;
  }
  return null;
};

const getNestedItemList = (row: Record<string, any>): any[] | null => {
  const candidates = [
    row.ItemRow,
    row.item_array,
    row.Item_Array,
    row.childrow,
  ];
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) return candidate;
  }
  return null;
};

const getNestedDesignList = (row: Record<string, any>): any[] | null => {
  const candidates = [
    row.DesignRow,
    row.design_array,
    row.Design_Array,
    row.designArray,
    row.SampleDesignRow,
  ];
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) return candidate;
  }
  return null;
};

const firstNonEmptyArray = (...candidates: unknown[]): any[] => {
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) return candidate;
  }
  return [];
};

const collectItemsFromDesignRows = (designRows: any[]): any[] =>
  (designRows || []).flatMap((design) => {
    if (!design || typeof design !== "object") return [];
    return firstNonEmptyArray(
      design.ItemRow,
      design.item_array,
      design.Item_Array,
      design.childrow
    );
  });

/** Flatten wrappers like `{ sample_print: [design, item, item] }` into a single row list. */
const flattenSamplePrintRows = (
  rows: Record<string, any>[]
): Record<string, any>[] => {
  const out: Record<string, any>[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;

    const sampleNested = getNestedSamplePrintList(row);
    if (sampleNested) {
      const headerClone: Record<string, any> = { ...row };
      delete headerClone.sample_print;
      delete headerClone.Sample_Print;
      delete headerClone.sampleprint_array;
      delete headerClone.SamplePrint_Array;
      delete headerClone.SamplePrintRow;

      const hasHeaderFields = Boolean(
        headerClone.Party_Name ||
          headerClone.party_name ||
          headerClone.Print_Date ||
          headerClone.print_date ||
          headerClone.Print_No ||
          headerClone.Sample_No ||
          headerClone.Print_Id
      );
      const hasDesignFields = Boolean(
        headerClone.design_id ||
          headerClone.Design_Id ||
          headerClone.Design_Name ||
          headerClone.Wt ||
          headerClone.WT ||
          headerClone.wt
      );

      if (
        (hasHeaderFields || hasDesignFields) &&
        !isSamplePrintItemRow(headerClone)
      ) {
        out.push(headerClone);
      }
      out.push(...flattenSamplePrintRows(sampleNested as Record<string, any>[]));
      continue;
    }

    // API shape: sample_print[] entry with DesignRow[{ ItemRow: [...] }]
    const designNested = getNestedDesignList(row);
    if (designNested) {
      const headerClone: Record<string, any> = { ...row };
      delete headerClone.DesignRow;
      delete headerClone.design_array;
      delete headerClone.Design_Array;
      delete headerClone.designArray;
      delete headerClone.SampleDesignRow;

      const hasHeaderFields = Boolean(
        headerClone.Party_Name ||
          headerClone.party_name ||
          headerClone.Print_Date ||
          headerClone.print_date ||
          headerClone.Print_No ||
          headerClone.Sample_No ||
          headerClone.Print_Id ||
          headerClone.Total != null
      );
      if (hasHeaderFields && !isSamplePrintItemRow(headerClone)) {
        out.push(headerClone);
      }
      out.push(...flattenSamplePrintRows(designNested as Record<string, any>[]));
      continue;
    }

    const itemNested = getNestedItemList(row);
    if (itemNested) {
      out.push(row);
      out.push(
        ...(itemNested as Record<string, any>[]).filter(isSamplePrintItemRow)
      );
      continue;
    }

    out.push(row);
  }
  return out;
};

const mergeSamplePrintRows = (
  rows: Record<string, any>[],
  wrapper: Record<string, any> = {}
): Record<string, any> => {
  const printSlip =
    wrapper.print_slip && typeof wrapper.print_slip === "object"
      ? wrapper.print_slip
      : {};

  const flatRows = flattenSamplePrintRows(rows);

  // Prefer real DesignRow objects (with ItemRow) from the API payload.
  const nestedDesignRows = rows.flatMap((row) => {
    const designs = getNestedDesignList(row);
    return designs ? (designs as Record<string, any>[]) : [];
  });
  // Also pick up DesignRow after one level of sample_print unwrap.
  const nestedDesignRowsFromSample = rows.flatMap((row) => {
    const sample = getNestedSamplePrintList(row);
    if (!sample) return [];
    return (sample as Record<string, any>[]).flatMap((entry) => {
      const designs = getNestedDesignList(entry);
      return designs ? (designs as Record<string, any>[]) : [];
    });
  });

  const designRowsFromFlat = flatRows.filter(
    (row) =>
      (row.design_id ||
        row.Design_Id ||
        row.Design_Name ||
        row.Wt ||
        row.WT ||
        row.Wt_Rate) &&
      !isSamplePrintItemRow(row) &&
      !getNestedDesignList(row)
  );

  const designRows = firstNonEmptyArray(
    nestedDesignRows,
    nestedDesignRowsFromSample,
    designRowsFromFlat
  );

  const nestedItems = flatRows.flatMap((row) => {
    const items = getNestedItemList(row);
    return items ? (items as Record<string, any>[]) : [];
  });

  const itemRows = firstNonEmptyArray(
    collectItemsFromDesignRows(designRows),
    flatRows.filter((row) => isSamplePrintItemRow(row)),
    nestedItems
  );

  const header =
    flatRows.find(
      (row) =>
        row.Party_Name ||
        row.party_name ||
        row.Print_Id ||
        row.Print_No ||
        row.Print_Date
    ) ||
    designRows[0] ||
    flatRows[0] ||
    {};

  return {
    ...wrapper,
    ...printSlip,
    ...header,
    DesignRow: (designRows.length > 0 ? designRows : [header]).map(
      (design) => ({
        ...design,
        ItemRow: firstNonEmptyArray(
          design.ItemRow,
          design.item_array,
          design.Item_Array,
          design.childrow,
          itemRows
        ),
      })
    ),
    sampleprint_array: flatRows,
    sample_print: flatRows,
  };
};

/**
 * Same grand-total formula as PrintModal:
 * items total + (WT * Wt_Rate) + Polish
 * API `Total` is items-only; WT/Polish are added on top.
 */
const computeSamplePrintGrandTotal = (
  itemsTotal: unknown,
  wt: unknown,
  wtRate: unknown,
  polish: unknown
): string => {
  const items = Number(itemsTotal) || 0;
  const weight = Number(wt) || 0;
  const rate = Number(wtRate) || 0;
  const polishAmt = Number(polish) || 0;
  const grand = items + weight * rate + polishAmt;
  if (!Number.isFinite(grand)) return "";
  if (grand === 0) return items ? items.toFixed(2) : "";
  return grand.toFixed(2);
};

const mapChildItems = (
  items: any[],
  designId: string
): SamplePrintFormData["item"] =>
  (items || []).map((item: Record<string, any>) => ({
    designId,
    itemId: String(pickValue(item.Item_Id, item.item_id, item.ItemId, "")),
    itemGl: String(pickValue(item.Item_GL, item.Item_Gl, item.item_gl, "")),
    itemName: String(
      pickValue(
        item.Item_Name,
        item.item_name,
        item.ItemName,
        item.Description,
        item.description,
        item.Item_Sh_Name,
        item.item_sh_name,
        ""
      )
    ),
    itemShName: String(
      pickValue(item.Item_Sh_Name, item.item_sh_name, item.Item_ShName, "")
    ),
    itemQuantity: String(
      pickValue(
        item.Item_Qnty,
        item.item_qnty,
        item.Item_Qty,
        item.item_qty,
        item.Qnty,
        item.qnty,
        ""
      )
    ),
    itemRate: String(
      pickValue(item.Item_Rate, item.item_rate, item.ItemRate, "")
    ),
    makingRate: String(
      pickValue(item.Making_Rate, item.making_rate, item.MakingRate, "")
    ),
    itemTotal: String(
      pickValue(
        item.Item_Tot,
        item.item_tot,
        item.Item_Total,
        item.item_total,
        item.Item_Grand_Tot,
        item.item_grand_tot,
        ""
      )
    ),
  }));

const mapHistoryRow = (
  row: Record<string, any>,
  fallbackPrintData?: SamplePrintFormData
): SamplePrintTableData => {
  const designRows = getDesignRows(row);
  const designRow = designRows[0] || {};
  const designId = String(
    pickValue(
      row.Design_Id,
      row.design_id,
      designRow.Design_Id,
      designRow.design_id,
      designRow.Id,
      fallbackPrintData?.designId,
      ""
    )
  );
  const printDate = pickValue(
    row.Print_Date,
    row.print_date,
    row.Sample_Date,
    row.Ord_Date,
    row.Order_Date,
    fallbackPrintData?.printDate
      ? format(fallbackPrintData.printDate, "yyyy-MM-dd")
      : ""
  );

  const sampleNo = String(
    pickValue(row.Sample_No, row.Print_No, row.Order_No, row.sample_no, "")
  );
  const fallback = fallbackPrintData || undefined;

  return {
    Id: Number(pickValue(row.Id, row.id, Date.now())),
    Print_Date: String(printDate),
    Sample_No: sampleNo,
    Party_Name: String(
      pickValue(
        row.Party_Name,
        row.party_name,
        fallback?.partyName,
        ""
      )
    ),
    Party_Id: String(
      pickValue(row.Party_Id, row.party_id, fallback?.partyId, "")
    ),
    Design_Id: designId,
    Design_Name: (() => {
      const names = designRows
        .map((row: Record<string, any>) =>
          String(
            pickValue(
              row.Design_Name,
              row.design_name,
              row.DesignName,
              ""
            )
          ).trim()
        )
        .filter(Boolean);
      if (names.length > 0) return names.join(", ");
      if (fallback?.designs?.length) {
        const fallbackNames = fallback.designs
          .map((d) => String(d.designName || "").trim())
          .filter(Boolean);
        if (fallbackNames.length > 0) return fallbackNames.join(", ");
      }
      return String(
        pickValue(
          row.Design_Name,
          row.design_name,
          designRow.Design_Name,
          designRow.design_name,
          designRow.DesignName,
          fallback?.designName,
          ""
        )
      );
    })(),
    Design_No: (() => {
      const nos = designRows
        .map((row: Record<string, any>) =>
          String(
            pickValue(row.Design_No, row.design_no, row.DesignNo, "")
          ).trim()
        )
        .filter(Boolean);
      if (nos.length > 0) return nos.join(", ");
      if (fallback?.designs?.length) {
        const fallbackNos = fallback.designs
          .map((d) => String(d.designNo || "").trim())
          .filter(Boolean);
        if (fallbackNos.length > 0) return fallbackNos.join(", ");
      }
      return String(
        pickValue(
          row.Design_No,
          row.design_no,
          designRow.Design_No,
          designRow.design_no,
          designRow.DesignNo,
          fallback?.designNo,
          ""
        )
      );
    })(),
    Total: (() => {
      const itemsTotal = pickValue(
        row.Total_Amt,
        row.Total_Order,
        row.Total,
        row.Grand_Total,
        row.Sample_Total,
        ""
      );
      const wtVal = pickValue(
        row.Wt,
        designRow.Wt,
        designRow.wt,
        designRow.WT,
        fallback?.wt,
        ""
      );
      const wtRateVal = pickValue(
        row.Wt_Rate,
        designRow.Wt_Rate,
        designRow.wt_rate,
        fallback?.wtRate,
        ""
      );
      const polishVal = pickValue(
        row.Polish,
        designRow.Polish,
        designRow.polish_rate,
        designRow.polish,
        fallback?.polish,
        ""
      );
      // API Total is items-only; add WT * rate + Polish (same as PrintModal).
      // fallback.totalRate is already a full grand total - use it only when API Total is absent.
      if (itemsTotal !== "" && itemsTotal != null) {
        return (
          computeSamplePrintGrandTotal(
            itemsTotal,
            wtVal,
            wtRateVal,
            polishVal
          ) ||
          toTwoDecimalString(itemsTotal) ||
          ""
        );
      }
      if (fallback?.totalRate) {
        return toTwoDecimalString(fallback.totalRate) || String(fallback.totalRate);
      }
      return (
        computeSamplePrintGrandTotal("", wtVal, wtRateVal, polishVal) || ""
      );
    })(),
    Item_Type: normalizeItemType(
      pickValue(
        row.Is_Own,
        row.is_own,
        row.Item_Type,
        row.item_type,
        row.Own_Item,
        fallback?.itemType,
        ""
      )
    ),
    Address: String(
      pickValue(row.Party_Add, row.party_add, fallback?.address, "")
    ),
    Mobile: String(
      pickValue(row.Party_Mob, row.party_mob, fallback?.mobileNo, "")
    ),
    Gstin: String(
      pickValue(row.Party_Gst, row.party_gst, fallback?.gstin, "")
    ),
    Image: String(
      pickValue(
        row.Image,
        designRow.Image,
        designRow.image,
        fallback?.image,
        ""
      )
    ),
    Wt: String(
      pickValue(row.Wt, designRow.Wt, designRow.wt, designRow.WT, fallback?.wt, "")
    ),
    Wt_Rate: String(
      pickValue(
        row.Wt_Rate,
        designRow.Wt_Rate,
        designRow.wt_rate,
        fallback?.wtRate,
        ""
      )
    ),
    Polish: String(
      pickValue(
        row.Polish,
        designRow.Polish,
        designRow.polish_rate,
        designRow.polish,
        fallback?.polish,
        ""
      )
    ),
    DesignRow:
      designRows.length > 0
        ? designRows
        : fallback?.designs?.length
          ? fallback.designs.map((d) => ({
              Design_Id: Number(d.designId) || 0,
              Design_Name: d.designName,
              Design_No: d.designNo,
              Wt: d.wt,
              Wt_Rate: d.wtRate,
              Polish: d.polish,
              Image: d.image,
              ItemRow: (d.item || []).map((item) => ({
                Item_Id: Number(item.itemId) || 0,
                Item_Name: item.itemName,
                Item_GL: item.itemGl,
                Item_Sh_Name: item.itemShName,
                Item_Qnty: item.itemQuantity,
                Item_Rate: item.itemRate,
                Making_Rate: item.makingRate,
                Item_Tot: item.itemTotal,
              })),
            }))
          : row.DesignRow,
  };
};

const resolveSamplePrintDetailsPayload = (
  details: unknown
): Record<string, any> | null => {
  if (!details) return null;

  if (Array.isArray(details)) {
    return details[0] && typeof details[0] === "object"
      ? mergeSamplePrintRows(details as Record<string, any>[])
      : null;
  }
  if (typeof details !== "object") return null;

  const record = details as Record<string, any>;
  const nestedList = [
    record.sample_print,
    record.Sample_Print,
    record.sampleprint_array,
    record.SamplePrint_Array,
    record.SamplePrintRow,
    record.data,
    record.details,
  ].find((value) => Array.isArray(value) && value.length > 0);

  if (nestedList) {
    return mergeSamplePrintRows(nestedList as Record<string, any>[], record);
  }

  // Single object that itself wraps another sample_print list under print_slip.
  if (record.print_slip && typeof record.print_slip === "object") {
    const slipNested = [
      record.print_slip.sample_print,
      record.print_slip.Sample_Print,
      record.print_slip.sampleprint_array,
    ].find((value) => Array.isArray(value) && value.length > 0);
    if (slipNested) {
      return mergeSamplePrintRows(slipNested as Record<string, any>[], {
        ...record,
        ...record.print_slip,
      });
    }
  }

  if (record.DesignRow || record.Print_Id || record.Print_No || record.Id) {
    return record;
  }

  return record;
};

const mapSamplePrintDetailsToPrintData = (
  details: Record<string, any>,
  fallbackRow?: SamplePrintTableData
): SamplePrintFormData => {
  const designRows = firstNonEmptyArray(
    getDesignRows(details),
    Array.isArray(fallbackRow?.DesignRow) ? fallbackRow.DesignRow : null
  );
  const designRow = designRows[0] || {};
  const designId = String(
    pickValue(
      details.Design_Id,
      details.design_id,
      designRow.Design_Id,
      designRow.design_id,
      designRow.Id,
      fallbackRow?.Design_Id,
      ""
    )
  );

  const itemSource = firstNonEmptyArray(
    designRow.ItemRow,
    designRow.item_array,
    designRow.Item_Array,
    designRow.childrow,
    collectItemsFromDesignRows(designRows),
    collectItemsFromDesignRows(
      Array.isArray(details.DesignRow) ? details.DesignRow : []
    ),
    details.ItemRow,
    details.item_array,
    details.Item_Array,
    details.childrow,
    Array.isArray(details.sampleprint_array)
      ? details.sampleprint_array.filter(isSamplePrintItemRow)
      : null,
    Array.isArray(details.sample_print)
      ? details.sample_print.filter(isSamplePrintItemRow)
      : null,
    Array.isArray(details.Sample_Print)
      ? details.Sample_Print.filter(isSamplePrintItemRow)
      : null,
    Array.isArray(fallbackRow?.DesignRow?.[0]?.ItemRow)
      ? fallbackRow?.DesignRow?.[0]?.ItemRow
      : null
  );

  const items = mapChildItems(itemSource, designId).map((item) => {
    const quantity = Number(item.itemQuantity) || 0;
    const rate = Number(item.itemRate) || 0;
    const makingRate = Number(item.makingRate) || 0;
    const itemTotal =
      item.itemTotal && Number(item.itemTotal)
        ? toTwoDecimalString(item.itemTotal)
        : toTwoDecimalString(quantity * (rate + makingRate));

    return {
      ...item,
      itemRate: toTwoDecimalString(item.itemRate) || item.itemRate,
      makingRate: toTwoDecimalString(item.makingRate) || item.makingRate,
      itemTotal,
    };
  });

  const designs =
    designRows.length > 0
      ? designRows.map((row: Record<string, any>) => {
          const rowDesignId = String(
            pickValue(row.Design_Id, row.design_id, row.Id, designId, "")
          );
          const rowItemsSource = firstNonEmptyArray(
            row.ItemRow,
            row.item_array,
            row.Item_Array,
            row.childrow,
            items.filter((item) => String(item.designId) === rowDesignId)
          );
          const rowItems = mapChildItems(rowItemsSource, rowDesignId).map(
            (item) => {
              const quantity = Number(item.itemQuantity) || 0;
              const rate = Number(item.itemRate) || 0;
              const makingRate = Number(item.makingRate) || 0;
              const itemTotal =
                item.itemTotal && Number(item.itemTotal)
                  ? toTwoDecimalString(item.itemTotal)
                  : toTwoDecimalString(quantity * (rate + makingRate));
              return {
                ...item,
                designId: String(item.designId || rowDesignId),
                itemRate: toTwoDecimalString(item.itemRate) || item.itemRate,
                makingRate:
                  toTwoDecimalString(item.makingRate) || item.makingRate,
                itemTotal,
              };
            }
          );
          const rowWt = toTwoDecimalString(
            pickValue(row.Wt, row.WT, row.wt, "")
          );
          const rowWtRate = toTwoDecimalString(
            pickValue(row.Wt_Rate, row.wt_rate, "")
          );
          const rowPolish = toTwoDecimalString(
            pickValue(row.Polish, row.polish_rate, row.polish, "")
          );
          const rowItemsTotal = rowItems.reduce(
            (sum, item) => sum + (Number(item.itemTotal) || 0),
            0
          );
          const rowTotal =
            rowItemsTotal +
            (Number(rowWt) || 0) * (Number(rowWtRate) || 0) +
            (Number(rowPolish) || 0);

          return {
            designId: rowDesignId,
            designName: String(
              pickValue(row.Design_Name, row.design_name, row.DesignName, "")
            ),
            designNo: String(
              pickValue(row.Design_No, row.design_no, row.DesignNo, "")
            ),
            wt: rowWt || "",
            wtRate: rowWtRate || "",
            polish: rowPolish || "",
            image: String(pickValue(row.Image, row.image, "")),
            totalRate: rowTotal ? rowTotal.toFixed(2) : "",
            item: rowItems,
          };
        })
      : undefined;

  const printDateRaw = pickValue(
    details.Print_Date,
    details.print_date,
    details.Sample_Date,
    details.Ord_Date,
    fallbackRow?.Print_Date,
    ""
  );
  const printDateValue = printDateRaw
    ? new Date(String(printDateRaw))
    : new Date();

  const wt = toTwoDecimalString(
    pickValue(details.Wt, details.WT, designRow.Wt, designRow.WT, fallbackRow?.Wt, "")
  );
  const wtRate = toTwoDecimalString(
    pickValue(
      details.Wt_Rate,
      designRow.Wt_Rate,
      designRow.wt_rate,
      fallbackRow?.Wt_Rate,
      ""
    )
  );
  const polish = toTwoDecimalString(
    pickValue(
      details.Polish,
      designRow.Polish,
      designRow.polish_rate,
      fallbackRow?.Polish,
      ""
    )
  );
  const itemsTotal = items.reduce(
    (sum, item) => sum + (Number(item.itemTotal) || 0),
    0
  );
  const computedTotal =
    itemsTotal +
    (Number(wt) || 0) * (Number(wtRate) || 0) +
    (Number(polish) || 0);

  return {
    printDate: Number.isNaN(printDateValue.getTime())
      ? new Date()
      : printDateValue,
    partyId: String(
      pickValue(details.Party_Id, details.party_id, fallbackRow?.Party_Id, "")
    ),
    partyName: String(
      pickValue(
        details.Party_Name,
        details.party_name,
        fallbackRow?.Party_Name,
        ""
      )
    ),
    address: String(
      pickValue(
        details.Party_Add,
        details.party_add,
        details.Address,
        fallbackRow?.Address,
        ""
      )
    ),
    mobileNo: String(
      pickValue(
        details.Party_Mob,
        details.party_mob,
        details.Mobile,
        fallbackRow?.Mobile,
        ""
      )
    ),
    gstin: String(
      pickValue(
        details.Party_Gst,
        details.party_gst,
        details.Gstin,
        fallbackRow?.Gstin,
        ""
      )
    ),
    designId,
    designName: String(
      pickValue(
        details.Design_Name,
        designRow.Design_Name,
        designRow.design_name,
        fallbackRow?.Design_Name,
        ""
      )
    ),
    designNo: String(
      pickValue(
        details.Design_No,
        designRow.Design_No,
        designRow.design_no,
        fallbackRow?.Design_No,
        ""
      )
    ),
    wt: wt || "",
    wtRate: wtRate || "",
    polish: polish || "",
    image: String(
      pickValue(
        details.Image,
        designRow.Image,
        designRow.image,
        fallbackRow?.Image,
        ""
      )
    ),
    itemType: normalizeItemType(
      pickValue(
        details.Is_Own,
        details.is_own,
        details.Item_Type,
        fallbackRow?.Item_Type,
        "1"
      )
    ),
    item: items,
    designs:
      designs && designs.length > 0
        ? designs
        : designId
          ? [
              {
                designId,
                designName: String(
                  pickValue(
                    details.Design_Name,
                    designRow.Design_Name,
                    designRow.design_name,
                    fallbackRow?.Design_Name,
                    ""
                  )
                ),
                designNo: String(
                  pickValue(
                    details.Design_No,
                    designRow.Design_No,
                    designRow.design_no,
                    fallbackRow?.Design_No,
                    ""
                  )
                ),
                wt: wt || "",
                wtRate: wtRate || "",
                polish: polish || "",
                image: String(
                  pickValue(
                    details.Image,
                    designRow.Image,
                    designRow.image,
                    fallbackRow?.Image,
                    ""
                  )
                ),
                totalRate: computedTotal
                  ? computedTotal.toFixed(2)
                  : toTwoDecimalString(
                      pickValue(
                        details.Total,
                        details.Total_Amt,
                        details.Total_Order,
                        details.Total_Rate,
                        details.Qnty_Rate,
                        designRow.Qnty_Rate,
                        fallbackRow?.Total,
                        ""
                      )
                    ) || "",
                item: items,
              },
            ]
          : undefined,
    totalRate: computedTotal
      ? computedTotal.toFixed(2)
      : toTwoDecimalString(
          pickValue(
            details.Total,
            details.Total_Amt,
            details.Total_Order,
            details.Total_Rate,
            details.Qnty_Rate,
            designRow.Qnty_Rate,
            fallbackRow?.Total,
            ""
          )
        ) || "",
  };
};

export const useSamplePrint = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [addSamplePrintLoading, setAddSamplePrintLoading] = useState(false);
  const [deleteSamplePrintLoading, setDeleteSamplePrintLoading] =
    useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);
  const [finId, setFinId] = useState<number | null>(null);

  const [showDesignDialog, setShowDesignDialog] = useState(false);
  const keepDesignSelectionRef = useRef(false);

  const [designTableData, setDesignTableData] = useState<
    SamplePrintDesignTableData[]
  >([]);
  const [itemListData, setItemListData] = useState<
    SamplePrintFormData["item"]
  >([]);

  const [orderPartyInput, setOrderPartyInput] = useState("");
  const [orderDesignInput, setOrderDesignInput] = useState("");

  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [printData, setPrintData] = useState<SamplePrintFormData | null>(null);
  const [printLoading, setPrintLoading] = useState(false);

  const [selected, setSelected] = useState("form");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { perPage, handlePerPageChange } = useListPerPage(() =>
    setCurrentPage(1),
  );

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);

  const orderPartyData: OrderPartyData[] = useSelector(
    (state: RootState) => state?.orderBooking?.orderPartyData
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
      setFinId(getCookieData<number | null>("waxCraftClientFinId"));
    }
  }, []);

  const formSchema = yup.object({
    printDate: yup.date().required("Print date is required"),
    partyId: yup.string().required("Party is required"),
    address: yup.string().default(""),
    mobileNo: yup.string().default(""),
    gstin: yup.string().default(""),
    designId: yup.string().default(""),
    designName: yup.string().default(""),
    designNo: yup.string().default(""),
    wt: yup.string().default(""),
    wtRate: yup.string().default(""),
    polish: yup.string().default(""),
    image: yup.string().default(""),
    itemType: yup.string().required("Item type is required"),
    // Design line items are validated in the modal before Save; form Add uses
    // designTableData / itemListData, so empty or leftover item rows must not block submit.
    item: yup
      .array()
      .of(
        yup.object().shape({
          designId: yup.string().default(""),
          itemId: yup.string().default(""),
          itemName: yup.string().default(""),
          itemGl: yup.string().default(""),
          itemShName: yup.string().default(""),
          itemQuantity: yup.string().default(""),
          itemRate: yup
            .string()
            .default("")
            .test("is-valid-number", "Invalid rate", (value) => {
              if (!value || !String(value).trim()) return true;
              return itemRateRegex.test(String(value));
            }),
          makingRate: yup.string().default(""),
          itemTotal: yup.string().default(""),
        })
      )
      .default([]),
    totalRate: yup.string().default(""),
  });

  const form = useForm<SamplePrintFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      printDate: new Date(),
      partyId: "",
      address: "",
      mobileNo: "",
      gstin: "",
      designId: "",
      designName: "",
      designNo: "",
      wt: "",
      wtRate: "",
      polish: "",
      image: "",
      itemType: "1",
      item: [],
      totalRate: "",
    },
  });

  const { partyId, designId, itemType } = form.watch();
  const isPartyItem = itemType === "0";

  const item = useWatch({
    control: form.control,
    name: "item",
  });

  /** Row total: (qty * rate) + (qty * making rate), always 2 decimal places. */
  const calcRowTotal = (
    quantity: unknown,
    rate: unknown,
    makingRate: unknown
  ): string => {
    const qty = Number(quantity) || 0;
    const r = Number(rate) || 0;
    const m = Number(makingRate) || 0;
    const total = qty * r + qty * m;
    return Number.isFinite(total) ? total.toFixed(2) : "0.00";
  };

  const syncItemTotalsAndTotalRate = () => {
    const rows = form.getValues("item") || [];
    rows.forEach((row, index) => {
      const nextTotal = calcRowTotal(
        row?.itemQuantity,
        row?.itemRate,
        row?.makingRate
      );
      if (row?.itemTotal !== nextTotal) {
        form.setValue(`item.${index}.itemTotal`, nextTotal, {
          shouldDirty: false,
          shouldValidate: false,
        });
      }
    });

    const itemsTotal = (form.getValues("item") || []).reduce((acc, row) => {
      const rowTotal = Number(
        calcRowTotal(row?.itemQuantity, row?.itemRate, row?.makingRate)
      );
      return acc + (Number.isFinite(rowTotal) ? rowTotal : 0);
    }, 0);

    const nextTotalRate = (
      itemsTotal +
      (Number(form.getValues("wt")) || 0) *
        (Number(form.getValues("wtRate")) || 0) +
      (Number(form.getValues("polish")) || 0)
    ).toFixed(2);

    if (form.getValues("totalRate") !== nextTotalRate) {
      form.setValue("totalRate", nextTotalRate, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  };

  const resetSampleForm = () => {
    form.reset({
      printDate: new Date(),
      partyId: "",
      address: "",
      mobileNo: "",
      gstin: "",
      designId: "",
      designName: "",
      designNo: "",
      wt: "",
      wtRate: "",
      polish: "",
      image: "",
      itemType: "1",
      item: [],
      totalRate: "",
    });
    setOrderPartyInput("");
    setOrderDesignInput("");
    setDesignTableData([]);
    setItemListData([]);
  };

  const clearDesignSelectionFields = () => {
    form.setValue("item", []);
    form.setValue("designId", "");
    form.setValue("designName", "");
    form.setValue("designNo", "");
    form.setValue("wt", "");
    form.setValue("wtRate", "");
    form.setValue("polish", "");
    form.setValue("image", "");
    form.setValue("totalRate", "");
    form.clearErrors("item");
    setOrderDesignInput("");
  };

  const handleSubmit: SubmitHandler<SamplePrintFormData> = (values) => {
    if (!designTableData.length) {
      toast.error("Add at least one design");
      return;
    }
    if (!orgId) {
      toast.error("Somthing went wrong");
      return;
    }

    // Ensure transient modal item rows cannot block / pollute the save payload.
    form.setValue("item", []);
    form.clearErrors("item");
    addSamplePrintApiCall(values, orgId);
  };

  const handleShowDeleteDialog = (id: number) => {
    setShowDeleteDialog(true);
    setTempDeleteId(id);
  };

  const handleDeleteSamplePrint = () => {
    if (orgId && tempDeleteId) deleteSamplePrintApiCall(orgId, tempDeleteId);
  };

  const handleShowPrintFromHistory = async (row: SamplePrintTableData) => {
    if (!orgId) {
      toast.error("Something went wrong");
      return;
    }

    const printId = String(pickValue(row.Id, ""));
    if (!printId) {
      toast.error("Sample print not found");
      return;
    }

    setPrintLoading(true);

    try {
      const res: ApiResponse = await getSamplePrintDetailsAPI(orgId, printId);
      const responseData = res.data as Record<string, any> | undefined;
      const details =
        resolveSamplePrintDetailsPayload(responseData?.details) ||
        resolveSamplePrintDetailsPayload(responseData?.data) ||
        resolveSamplePrintDetailsPayload(responseData);

      if (res.status !== 200 || !details) {
        toast.error(
          typeof responseData?.message === "string" &&
            responseData.message.trim()
            ? responseData.message
            : "Unable to load print data"
        );
        return;
      }

      const printPayload = mapSamplePrintDetailsToPrintData(details, row);
      setPrintData({
        ...printPayload,
        partyName:
          printPayload.partyName || row.Party_Name || printPayload.partyName,
        partyId: printPayload.partyId || row.Party_Id || printPayload.partyId,
      });
      setShowPrintDialog(true);
    } catch {
      toast.error("Unable to load print data");
    } finally {
      setPrintLoading(false);
    }
  };

  const handleAddDesign = () => {
    const item = form.getValues("item") || [];
    const selectedDesignId = String(form.getValues("designId") || "").trim();

    const allHaveMakingRate = item.every(
      (i) => i.makingRate && String(i.makingRate).trim() !== ""
    );

    if (!selectedDesignId) {
      toast.error("Select a design");
      return;
    }

    if (
      designTableData.some(
        (row) => String(row.designId) === selectedDesignId
      )
    ) {
      toast.error("Design already added");
      return;
    }

    if (allHaveMakingRate) {
      const designName = String(form.getValues("designName") || "").trim();
      const designNo = String(form.getValues("designNo") || "").trim();
      const image = String(form.getValues("image") || "").trim();
      const totalRate =
        toTwoDecimalString(form.getValues("totalRate")) ||
        String(form.getValues("totalRate") || "").trim();

      setDesignTableData((prev) => [
        ...prev,
        {
          designId: selectedDesignId,
          designName,
          designNo,
          wt: toTwoDecimalString(form.getValues("wt")) || form.getValues("wt") || "",
          wtRate:
            toTwoDecimalString(form.getValues("wtRate")) ||
            form.getValues("wtRate") ||
            "",
          polish:
            toTwoDecimalString(form.getValues("polish")) ||
            form.getValues("polish") ||
            "",
          image,
          totalRate,
        },
      ]);
      setItemListData((prev) => [
        ...prev,
        ...item.map((row) => ({
          ...row,
          designId: String(row.designId || selectedDesignId),
          itemRate: toTwoDecimalString(row.itemRate) || row.itemRate,
          makingRate: toTwoDecimalString(row.makingRate) || row.makingRate,
          itemTotal: toTwoDecimalString(row.itemTotal) || row.itemTotal,
        })),
      ]);

      clearDesignSelectionFields();
      setShowDesignDialog(false);
    } else {
      toast.error("Add making rate to all item.");
    }
  };

  const handleDeleteDesignTableData = (designId: string) => {
    const id = String(designId);
    setDesignTableData((prev) =>
      prev.filter((row) => String(row.designId) !== id)
    );
    setItemListData((prev) =>
      prev.filter((row) => String(row.designId) !== id)
    );
  };

  const getDesignDetailsApiCall = async (orgId: number, designId: string) => {
    try {
      const res: ApiResponse = await getDesignDetailsAPI(orgId, designId);

      if (res.status === 200) {
        dispatch(getOrderDesignDetailsData(res.data.details[0]));
        form.setValue("designName", res.data.details[0].Design_Name);
        form.setValue("designNo", res.data.details[0].Design_No);
        form.setValue(
          "wt",
          toTwoDecimalString(res.data.details[0].WT) ||
            String(res.data.details[0].WT ?? ""),
        );
        form.setValue(
          "wtRate",
          toTwoDecimalString(res.data.details[0].Wt_Rate) || "",
        );
        form.setValue(
          "polish",
          toTwoDecimalString(res.data.details[0].Polish) ||
            String(res.data.details[0].Polish ?? ""),
        );
        form.setValue("image", res.data.details[0].Image);
        const partyItem = form.getValues("itemType") === "0";
        form.setValue(
          "item",
          (res.data.details[0].childrow || []).map((child: ChildRow) => {
            const quantity = Number(child.Qnty) || 0;
            const rate = partyItem
              ? "0.00"
              : toTwoDecimalString(child.Item_Rate) ||
                (child.Item_Rate != null ? String(child.Item_Rate) : "");
            const makingRate = "";
            const itemTotal = calcRowTotal(quantity, rate, makingRate);

            return {
              designId: res.data.details[0].Id,
              itemId: child.Item_Id,
              itemName: child.Item_Name,
              itemGl: child.Item_GL,
              itemShName: child.Item_Sh_Name,
              itemQuantity: child.Qnty,
              itemRate: rate,
              makingRate,
              itemTotal,
            };
          })
        );
        queueMicrotask(() => syncItemTotalsAndTotalRate());
      } else {
        dispatch(getOrderDesignDetailsData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getOrderDesignDetailsData([]));
    }
  };

  const addSamplePrintApiCall = async (
    values: SamplePrintFormData,
    orgId: number
  ) => {
    setAddSamplePrintLoading(true);

    const partyItem = values.itemType === "0";

    const itemDataList = itemListData.map((itemData) => ({
      design_id: itemData.designId || null,
      qnty: null,
      wt: null,
      wt_rate: null,
      tot_wt: null,
      polish_rate: null,
      tot_polish: null,
      qnty_rate: null,
      item_id: itemData.itemId,
      Item_Gl: itemData.itemGl,
      item_qnty: itemData.itemQuantity,
      item_rate: partyItem ? "0.00" : itemData.itemRate,
      item_tot: toTwoDecimalString(itemData.itemTotal) || itemData.itemTotal,
      item_grand_tot:
        toTwoDecimalString(itemData.itemTotal) || itemData.itemTotal,
      making_rate:
        toTwoDecimalString(itemData.makingRate) || itemData.makingRate,
    }));

    const designDetails = designTableData.map((data) => ({
      design_id: data.designId,
      qnty: "1",
      wt_rate: toTwoDecimalString(data.wtRate) || data.wtRate || null,
      wt: toTwoDecimalString(data.wt) || data.wt || null,
      tot_wt:
        toTwoDecimalString(
          (Number(data.wt) || 0) * (Number(data.wtRate) || 0)
        ) || null,
      polish_rate: toTwoDecimalString(data.polish) || data.polish || null,
      tot_polish: toTwoDecimalString(data.polish) || data.polish || null,
      qnty_rate: toTwoDecimalString(data.totalRate) || data.totalRate || null,
      item_id: null,
      Item_Gl: null,
      item_qnty: null,
      item_rate: null,
      item_tot: null,
      item_grand_tot: null,
      making_rate: null,
    }));

    const data = {
      org_id: orgId,
      ord_date: format(values.printDate, "yyyy-MM-dd"),
      party_id: values.partyId,
      is_own: values.itemType,
      year_id: finId,
      sampleprint_array: [...designDetails, ...itemDataList],
    };

    try {
      const res: ApiResponse = await addSamplePrintAPI(data);

      if (res.status === 200) {
        const partyName =
          orderPartyData.find((party) => party.Id.toString() === values.partyId)
            ?.Party_Name || "";
        const designs = designTableData.map((design) => ({
          ...design,
          item: itemListData.filter(
            (row) => String(row.designId) === String(design.designId)
          ),
        }));
        const firstDesign = designs[0];
        const combinedTotal = designs
          .reduce((sum, design) => sum + (Number(design.totalRate) || 0), 0)
          .toFixed(2);
        const printPayload: SamplePrintFormData = {
          ...values,
          partyName,
          designId: firstDesign?.designId || "",
          designName: firstDesign?.designName || "",
          designNo: firstDesign?.designNo || "",
          wt: firstDesign?.wt || "",
          wtRate: firstDesign?.wtRate || "",
          polish: firstDesign?.polish || "",
          image: firstDesign?.image || "",
          totalRate: combinedTotal,
          item: itemListData,
          designs,
        };
        setPrintData(printPayload);
        setShowPrintDialog(true);
        resetSampleForm();
        setCurrentPage(1);
        getSamplePrintApiCall(orgId, 1, "", printPayload);
        toast.success(
          typeof res.data.message === "string" && res.data.message.trim()
            ? res.data.message
            : "Sample print saved"
        );
      } else {
        toast.error(
          typeof res.data.message === "string" && res.data.message.trim()
            ? res.data.message
            : "Unable to save sample print"
        );
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddSamplePrintLoading(false);
    }
  };

  const deleteSamplePrintApiCall = async (
    orgId: number,
    samplePrintId: number
  ) => {
    setDeleteSamplePrintLoading(true);

    const data = {
      org_id: orgId,
      sampleprint_id: samplePrintId,
    };

    try {
      const res: ApiResponse = await deleteSamplePrintAPI(data);

      if (res.status === 200) {
        toast.success(
          typeof res.data.message === "string" && res.data.message.trim()
            ? res.data.message
            : "Sample print deleted"
        );
        setCurrentPage(1);
        getSamplePrintApiCall(orgId, 1, "");
        setShowDeleteDialog(false);
        setTempDeleteId(null);
      } else {
        toast.error(
          typeof res.data.message === "string" && res.data.message.trim()
            ? res.data.message
            : "Unable to delete sample print"
        );
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteSamplePrintLoading(false);
    }
  };

  const getSamplePrintApiCall = async (
    orgId: number,
    page: number,
    keyword: string,
    fallbackPrintData?: SamplePrintFormData
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getSamplePrintAPI(
        orgId,
        page,
        keyword,
        perPage,
      );

      if (res.status === 200) {
        const list = Array.isArray(res.data.details?.data)
          ? res.data.details.data
          : Array.isArray(res.data.details)
            ? res.data.details
            : [];

        let mapped: SamplePrintTableData[] = list.map(
          (row: Record<string, any>) => {
            const nested =
              row.sample_print ||
              row.Sample_Print ||
              row.sampleprint_array ||
              row.SamplePrint_Array;
            const source = Array.isArray(nested) && nested.length > 0
              ? mergeSamplePrintRows(nested, row)
              : row;
            return mapHistoryRow(source, undefined);
          }
        );

        // If the list omits design/total/type on the newest row, fill from the just-saved form.
        if (fallbackPrintData && mapped.length > 0) {
          let newestIndex = 0;
          for (let i = 1; i < mapped.length; i += 1) {
            if (Number(mapped[i].Id) > Number(mapped[newestIndex].Id)) {
              newestIndex = i;
            }
          }

          const newest = mapped[newestIndex];
          const needsEnrichment =
            !newest.Design_Name ||
            !newest.Design_No ||
            !newest.Total ||
            !newest.Item_Type;
          const sameParty =
            !fallbackPrintData.partyId ||
            !newest.Party_Id ||
            newest.Party_Id === fallbackPrintData.partyId;

          if (needsEnrichment && sameParty) {
            mapped[newestIndex] = mapHistoryRow(
              list[newestIndex],
              fallbackPrintData
            );
          }
        }

        dispatch(getSamplePrintData(mapped));
        setLastPage(
          res.data.details?.pagination?.last_page ||
            res.data.details?.last_page ||
            1
        );

        const designIds: string[] = Array.from(
          new Set(
            mapped
              .filter(
                (row: SamplePrintTableData) =>
                  row.Design_Id &&
                  (!row.Design_Name ||
                    !row.Design_No ||
                    !(Number(row.Wt) || Number(row.Polish)))
              )
              .map((row: SamplePrintTableData) => String(row.Design_Id))
          )
        );

        if (designIds.length > 0) {
          const detailsEntries = await Promise.all(
            designIds.map(async (designId: string) => {
              try {
                const detailRes: ApiResponse = await getDesignDetailsAPI(
                  orgId,
                  designId
                );
                if (detailRes.status === 200 && detailRes.data.details?.[0]) {
                  return [designId, detailRes.data.details[0]] as const;
                }
              } catch {
                return null;
              }
              return null;
            })
          );

          const detailsById = Object.fromEntries(
            detailsEntries.filter(Boolean) as [
              string,
              Record<string, any>,
            ][]
          );

          if (Object.keys(detailsById).length > 0) {
            mapped = mapped.map((row: SamplePrintTableData) => {
              const detail = row.Design_Id
                ? detailsById[String(row.Design_Id)]
                : null;
              if (!detail) return row;

              const wt = String(
                pickValue(row.Wt, detail.WT, detail.Wt, "")
              );
              const wtRate = String(
                pickValue(row.Wt_Rate, detail.Wt_Rate, "")
              );
              const polish = String(
                pickValue(row.Polish, detail.Polish, "")
              );
              const hadWtBefore =
                !!(Number(row.Wt) || Number(row.Wt_Rate) || Number(row.Polish));
              const stored = Number(row.Total) || 0;
              const additive =
                (Number(wt) || 0) * (Number(wtRate) || 0) +
                (Number(polish) || 0);
              const itemsBase = hadWtBefore
                ? Math.max(0, stored - additive)
                : stored;
              const grandTotal = computeSamplePrintGrandTotal(
                itemsBase,
                wt,
                wtRate,
                polish
              );

              return {
                ...row,
                Design_Name:
                  row.Design_Name ||
                  String(pickValue(detail.Design_Name, "")),
                Design_No:
                  row.Design_No || String(pickValue(detail.Design_No, "")),
                Image:
                  row.Image ||
                  String(pickValue(detail.Image, detail.image, "")),
                Wt: toTwoDecimalString(wt) || wt,
                Wt_Rate: toTwoDecimalString(wtRate) || wtRate,
                Polish: toTwoDecimalString(polish) || polish,
                Total: grandTotal || row.Total,
              };
            });

            dispatch(getSamplePrintData(mapped));
          }
        }
      } else {
        dispatch(getSamplePrintData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getSamplePrintData([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.setValue(
      "address",
      orderPartyData.find((party) => party.Id.toString() === partyId)
        ?.Party_Add || ""
    );
    form.setValue(
      "mobileNo",
      orderPartyData.find((party) => party.Id.toString() === partyId)
        ?.Party_Mob || ""
    );
    form.setValue(
      "gstin",
      orderPartyData.find((party) => party.Id.toString() === partyId)
        ?.Party_Gst || ""
    );
  }, [partyId]);

  // Party item: force rate to 0.00 whenever item type or rows change.
  useEffect(() => {
    if (!isPartyItem || !item?.length) return;
    item.forEach((row, index) => {
      if (row?.itemRate !== "0.00") {
        form.setValue(`item.${index}.itemRate`, "0.00", {
          shouldDirty: false,
          shouldValidate: false,
        });
      }
    });
  }, [isPartyItem, item, form]);

  // Recalculate row totals + total rate whenever rate / making rate / wt fields change.
  useEffect(() => {
    syncItemTotalsAndTotalRate();

    const subscription = form.watch((_value, info) => {
      const name = info?.name;
      if (!name) return;

      const touchesItemCalc =
        name.startsWith("item.") &&
        (name.endsWith(".itemRate") ||
          name.endsWith(".makingRate") ||
          name.endsWith(".itemQuantity") ||
          name === "item");
      const touchesHeaderCalc =
        name === "wt" || name === "wtRate" || name === "polish";

      if (touchesItemCalc || touchesHeaderCalc) {
        syncItemTotalsAndTotalRate();
      }
    });

    return () => subscription.unsubscribe();
  }, [form, item?.length]);

  useResetFormOnModalClose(showDesignDialog, () => {
    if (keepDesignSelectionRef.current) {
      keepDesignSelectionRef.current = false;
      return;
    }
    clearDesignSelectionFields();
  });

  return {
    getDesignDetailsApiCall,
    getSamplePrintApiCall,
    loading,
    addSamplePrintLoading,
    deleteSamplePrintLoading,
    form,
    handleSubmit,
    selected,
    setSelected,
    designId,
    showDesignDialog,
    setShowDesignDialog,
    handleAddDesign,
    designTableData,
    handleDeleteDesignTableData,
    showPrintDialog,
    setShowPrintDialog,
    printData,
    orderPartyInput,
    setOrderPartyInput,
    orderDesignInput,
    setOrderDesignInput,
    handleShowPrintFromHistory,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeleteSamplePrint,
    printLoading,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
  };
};
