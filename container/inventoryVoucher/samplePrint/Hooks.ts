import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";
import { useDispatch, useSelector } from "react-redux";
import {
  SamplePrintFormData,
  SamplePrintTableData,
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

  const sampleArray = row.sampleprint_array || row.SamplePrint_Array || row.SamplePrintRow;
  if (Array.isArray(sampleArray) && sampleArray.length > 0) {
    const designOnly = sampleArray.filter(
      (entry: Record<string, any>) =>
        (entry.design_id || entry.Design_Id) &&
        !entry.item_id &&
        !entry.Item_Id
    );
    if (designOnly.length > 0) return designOnly;
    return sampleArray;
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

const SAMPLE_PRINT_CACHE_KEY = "waxCraftSamplePrintCache";

/** Redux requires serializable values — store printDate as ISO string. */
const serializePrintData = (
  data: SamplePrintFormData
): SamplePrintFormData => {
  const rawDate = data.printDate
    ? data.printDate instanceof Date
      ? data.printDate
      : new Date(data.printDate as unknown as string)
    : null;
  const iso =
    rawDate && !Number.isNaN(rawDate.getTime()) ? rawDate.toISOString() : "";

  return {
    ...data,
    printDate: iso as unknown as Date,
  };
};

const deserializePrintData = (
  data: SamplePrintFormData
): SamplePrintFormData => ({
  ...data,
  printDate: data.printDate
    ? new Date(data.printDate as unknown as string)
    : new Date(),
});

const readPrintCache = (): Record<string, SamplePrintFormData> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(SAMPLE_PRINT_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writePrintCache = (cache: Record<string, SamplePrintFormData>) => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SAMPLE_PRINT_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore quota / private mode errors
  }
};

const cacheSamplePrintData = (
  sampleNo: string,
  data: SamplePrintFormData
) => {
  if (!sampleNo) return;
  const cache = readPrintCache();
  cache[sampleNo] = serializePrintData(data);
  writePrintCache(cache);
};

const getCachedSamplePrintData = (
  sampleNo: string
): SamplePrintFormData | null => {
  if (!sampleNo) return null;
  const cached = readPrintCache()[sampleNo];
  if (!cached) return null;
  return deserializePrintData(cached);
};

/**
 * Same grand-total formula as PrintModal:
 * items total + (WT × Wt_Rate) + Polish
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
    itemId: String(pickValue(item.Item_Id, item.item_id, "")),
    itemGl: String(pickValue(item.Item_GL, item.Item_Gl, item.item_gl, "")),
    itemName: String(pickValue(item.Item_Name, item.item_name, "")),
    itemShName: String(pickValue(item.Item_Sh_Name, item.item_sh_name, "")),
    itemQuantity: String(
      pickValue(item.Item_Qnty, item.item_qnty, item.Qnty, item.qnty, "")
    ),
    itemRate: String(pickValue(item.Item_Rate, item.item_rate, "")),
    makingRate: String(pickValue(item.Making_Rate, item.making_rate, "")),
    itemTotal: String(
      pickValue(item.Item_Tot, item.item_tot, item.Item_Total, item.item_total, "")
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
  const cached = getCachedSamplePrintData(sampleNo);
  const fallback = fallbackPrintData || cached || undefined;

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
    Design_Name: String(
      pickValue(
        row.Design_Name,
        row.design_name,
        designRow.Design_Name,
        designRow.design_name,
        designRow.DesignName,
        fallback?.designName,
        ""
      )
    ),
    Design_No: String(
      pickValue(
        row.Design_No,
        row.design_no,
        designRow.Design_No,
        designRow.design_no,
        designRow.DesignNo,
        fallback?.designNo,
        ""
      )
    ),
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
      // API Total is items-only; add WT × rate + Polish (same as PrintModal).
      // fallback.totalRate is already a full grand total — use it only when API Total is absent.
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
    printData: fallback
      ? serializePrintData({
          ...fallback,
          partyName:
            fallback.partyName ||
            String(pickValue(row.Party_Name, row.party_name, "")),
          printDate: fallback.printDate
            ? new Date(fallback.printDate)
            : new Date(),
        })
      : undefined,
    DesignRow: designRows.length > 0 ? designRows : row.DesignRow,
  };
};

const mapRowToPrintData = (row: SamplePrintTableData): SamplePrintFormData => {
  if (row.printData) {
    return {
      ...deserializePrintData(row.printData),
      partyName: row.printData.partyName || row.Party_Name || "",
    };
  }

  const cached = getCachedSamplePrintData(row.Sample_No);
  if (cached) {
    return {
      ...cached,
      partyName: cached.partyName || row.Party_Name || "",
    };
  }

  const designRow = (row.DesignRow?.[0] || {}) as Record<string, any>;
  const printDateValue = row.Print_Date ? new Date(row.Print_Date) : new Date();
  const designId = String(
    pickValue(
      row.Design_Id,
      designRow.Design_Id,
      designRow.design_id,
      designRow.Id,
      ""
    )
  );
  const itemRows = Array.isArray(designRow.ItemRow)
    ? designRow.ItemRow
    : Array.isArray(designRow.item_array)
      ? designRow.item_array
      : Array.isArray(designRow.Item_Array)
        ? designRow.Item_Array
        : Array.isArray(designRow.childrow)
          ? designRow.childrow
          : [];

  return {
    printDate: Number.isNaN(printDateValue.getTime())
      ? new Date()
      : printDateValue,
    partyId: row.Party_Id || "",
    partyName: row.Party_Name || "",
    address: row.Address || "",
    mobileNo: row.Mobile || "",
    gstin: row.Gstin || "",
    designId,
    designName: String(
      pickValue(
        row.Design_Name,
        designRow.Design_Name,
        designRow.design_name,
        ""
      )
    ),
    designNo: String(
      pickValue(row.Design_No, designRow.Design_No, designRow.design_no, "")
    ),
    wt: String(pickValue(row.Wt, designRow.Wt, designRow.WT, designRow.wt, "")),
    wtRate: String(
      pickValue(row.Wt_Rate, designRow.Wt_Rate, designRow.wt_rate, "")
    ),
    polish: String(
      pickValue(row.Polish, designRow.Polish, designRow.polish_rate, "")
    ),
    image: String(pickValue(row.Image, designRow.Image, designRow.image, "")),
    itemType: row.Item_Type || "1",
    item: mapChildItems(itemRows, designId),
    totalRate: row.Total || "",
  };
};

const resolveSamplePrintDetailsPayload = (
  details: unknown
): Record<string, any> | null => {
  if (!details) return null;
  if (Array.isArray(details)) {
    return details[0] && typeof details[0] === "object"
      ? (details[0] as Record<string, any>)
      : null;
  }
  if (typeof details !== "object") return null;

  const record = details as Record<string, any>;

  // GetSamplePrintDetails shape: { print_slip, sample_print: [ {...} ] }
  if (Array.isArray(record.sample_print) && record.sample_print[0]) {
    return record.sample_print[0] as Record<string, any>;
  }
  if (Array.isArray(record.Sample_Print) && record.Sample_Print[0]) {
    return record.Sample_Print[0] as Record<string, any>;
  }
  if (Array.isArray(record.data) && record.data[0]) {
    return record.data[0] as Record<string, any>;
  }
  if (record.DesignRow || record.Print_Id || record.Print_No) {
    return record;
  }

  return record;
};

const mapSamplePrintDetailsToPrintData = (
  details: Record<string, any>,
  fallbackRow?: SamplePrintTableData
): SamplePrintFormData => {
  const designRows = getDesignRows(details);
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

  const itemSource = Array.isArray(designRow.ItemRow)
    ? designRow.ItemRow
    : Array.isArray(designRow.childrow)
      ? designRow.childrow
      : Array.isArray(designRow.item_array)
        ? designRow.item_array
        : Array.isArray(details.ItemRow)
          ? details.ItemRow
          : Array.isArray(details.childrow)
            ? details.childrow
            : Array.isArray(details.sampleprint_array)
              ? details.sampleprint_array.filter(
                  (entry: Record<string, any>) =>
                    entry.item_id || entry.Item_Id
                )
              : [];

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
    totalRate:
      toTwoDecimalString(
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
      ) || (computedTotal ? computedTotal.toFixed(2) : ""),
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

  const [orderPartyInput, setOrderPartyInput] = useState("");
  const [orderDesignInput, setOrderDesignInput] = useState("");

  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [printData, setPrintData] = useState<SamplePrintFormData | null>(null);
  const [printLoading, setPrintLoading] = useState(false);

  const [selected, setSelected] = useState("form");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

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
              if (!value) return false;
              return itemRateRegex.test(value);
            }),
          makingRate: yup.string().default(""),
          itemTotal: yup.string().default(""),
        })
      )
      .required("Item is required"),
    totalRate: yup.string().default(""),
  });

  const form = useForm<SamplePrintFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      printDate: undefined,
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

  const { partyId, designId, wt, wtRate, polish } = form.watch();

  const item = useWatch({
    control: form.control,
    name: "item",
  });

  const calculateTotal = (index: number) => {
    const rate = item[index]?.itemRate || 0;
    const makingRate = item[index]?.makingRate || 0;
    const quantity = item[index]?.itemQuantity || 0;
    return (
      Number(rate) * Number(quantity) + Number(makingRate) * Number(quantity)
    );
  };

  const resetSampleForm = () => {
    form.reset();
    setOrderPartyInput("");
    setOrderDesignInput("");
  };

  const handleSubmit: SubmitHandler<SamplePrintFormData> = (values) => {
    if (orgId) {
      addSamplePrintApiCall(values, orgId);
    } else {
      toast.error("Somthing went wrong");
    }
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
      const details = resolveSamplePrintDetailsPayload(res.data?.details);

      if (res.status !== 200 || !details) {
        toast.error(
          typeof res.data?.message === "string" && res.data.message.trim()
            ? res.data.message
            : "Unable to load print data"
        );
        return;
      }

      const printPayload = mapSamplePrintDetailsToPrintData(details, row);

      if (row.Sample_No || printPayload.designName) {
        cacheSamplePrintData(
          String(
            pickValue(
              row.Sample_No,
              details.Print_No,
              details.Sample_No,
              details.sample_no,
              printId
            )
          ),
          printPayload
        );
      }

      setPrintData(printPayload);
      setShowPrintDialog(true);
    } catch {
      toast.error("Unable to load print data");
    } finally {
      setPrintLoading(false);
    }
  };

  const handleAddDesign = () => {
    const item = form.getValues("item") || [];

    const allHaveMakingRate = item.every(
      (i) => i.makingRate && String(i.makingRate).trim() !== ""
    );

    if (allHaveMakingRate) {
      keepDesignSelectionRef.current = true;
      setOrderDesignInput(form.getValues("designName") || "");
      setShowDesignDialog(false);
    } else {
      toast.error("Add making rate to all item.");
    }
  };

  const getDesignDetailsApiCall = async (orgId: number, designId: string) => {
    try {
      const res: ApiResponse = await getDesignDetailsAPI(orgId, designId);

      if (res.status === 200) {
        dispatch(getOrderDesignDetailsData(res.data.details[0]));
        form.setValue("designName", res.data.details[0].Design_Name);
        form.setValue("designNo", res.data.details[0].Design_No);
        form.setValue("wt", res.data.details[0].WT);
        form.setValue("wtRate", res.data.details[0].Wt_Rate || "");
        form.setValue("polish", res.data.details[0].Polish);
        form.setValue("image", res.data.details[0].Image);
        form.setValue(
          "item",
          (res.data.details[0].childrow || []).map((child: ChildRow) => ({
            designId: res.data.details[0].Id,
            itemId: child.Item_Id,
            itemName: child.Item_Name,
            itemGl: child.Item_GL,
            itemShName: child.Item_Sh_Name,
            itemQuantity: child.Qnty,
            itemRate: child.Item_Rate != null ? String(child.Item_Rate) : "",
            makingRate: "",
            itemTotal: child.Item_Total != null ? String(child.Item_Total) : "",
          }))
        );
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

    const itemDataList = (values.item || []).map((itemData) => ({
      design_id: itemData.designId || values.designId || null,
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
      item_rate: itemData.itemRate,
      item_tot: itemData.itemTotal,
      item_grand_tot: itemData.itemTotal,
      making_rate: itemData.makingRate,
    }));

    const designDetails = values.designId
      ? [
          {
            design_id: values.designId,
            qnty: "1",
            wt_rate: values.wtRate || null,
            wt: values.wt || null,
            tot_wt:
              (Number(values.wt) || 0) * (Number(values.wtRate) || 0) || null,
            polish_rate: values.polish || null,
            tot_polish: values.polish || null,
            qnty_rate: values.totalRate || null,
            item_id: null,
            Item_Gl: null,
            item_qnty: null,
            item_rate: null,
            item_tot: null,
            item_grand_tot: null,
            making_rate: null,
          },
        ]
      : [];

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
        const printPayload: SamplePrintFormData = {
          ...values,
          partyName,
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
      const res: ApiResponse = await getSamplePrintAPI(orgId, page, keyword);

      if (res.status === 200) {
        const list = Array.isArray(res.data.details?.data)
          ? res.data.details.data
          : Array.isArray(res.data.details)
            ? res.data.details
            : [];

        let mapped: SamplePrintTableData[] = list.map((row: Record<string, any>) =>
          mapHistoryRow(row, undefined)
        );

        // If API omits design/total/type on the newest row, fill from the just-saved form.
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

          if (mapped[newestIndex]?.Sample_No) {
            cacheSamplePrintData(
              mapped[newestIndex].Sample_No,
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

        // Dynamically fill missing design details for history rows.
        const designIds: string[] = Array.from(
          new Set(
            mapped
              .filter(
                (row: SamplePrintTableData) =>
                  row.Design_Id &&
                  (!row.Design_Name ||
                    !row.Design_No ||
                    !row.printData?.item?.length ||
                    // Need WT/Polish from design so list Total matches print Grand Total
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

              const designId = String(
                pickValue(detail.Id, detail.Design_Id, row.Design_Id, "")
              );
              const items = mapChildItems(
                detail.childrow || detail.ItemRow || [],
                designId
              );
              const itemsTotal = items.reduce(
                (sum, item) => sum + (Number(item.itemTotal) || 0),
                0
              );
              const wt = String(
                pickValue(row.Wt, detail.WT, detail.Wt, "")
              );
              const wtRate = String(
                pickValue(row.Wt_Rate, detail.Wt_Rate, "")
              );
              const polish = String(
                pickValue(row.Polish, detail.Polish, "")
              );
              // List/API Total is items-only. If WT was already on the row,
              // mapHistoryRow may have turned Total into a grand total — strip
              // WT/Polish so we never double-count. Prefer API items over design
              // master item sums (those can differ from the saved sample print).
              const hadWtBefore =
                !!(Number(row.Wt) || Number(row.Wt_Rate) || Number(row.Polish));
              const stored = Number(row.Total) || 0;
              const additive =
                (Number(wt) || 0) * (Number(wtRate) || 0) +
                (Number(polish) || 0);
              const itemsBase = hadWtBefore
                ? Math.max(0, stored - additive)
                : stored > 0
                  ? stored
                  : itemsTotal;
              const grandTotal = computeSamplePrintGrandTotal(
                itemsBase,
                wt,
                wtRate,
                polish
              );

              const enriched: SamplePrintTableData = {
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
                Total: grandTotal,
                DesignRow: [
                  {
                    Design_Id: Number(designId) || 0,
                    Design_Name: String(
                      pickValue(detail.Design_Name, row.Design_Name, "")
                    ),
                    Design_No: String(
                      pickValue(detail.Design_No, row.Design_No, "")
                    ),
                    Wt: wt,
                    Wt_Rate: wtRate,
                    Polish: polish,
                    Image: String(
                      pickValue(detail.Image, detail.image, row.Image, "")
                    ),
                    ItemRow: items.map((item) => ({
                      Item_Id: Number(item.itemId) || 0,
                      Item_Name: item.itemName,
                      Item_GL: item.itemGl,
                      Item_Sh_Name: item.itemShName,
                      Item_Qnty: item.itemQuantity,
                      Item_Rate: item.itemRate,
                      Making_Rate: item.makingRate,
                      Item_Tot: item.itemTotal,
                    })),
                  },
                ],
              };

              if (!enriched.printData && items.length > 0) {
                enriched.printData = serializePrintData({
                  ...mapRowToPrintData(enriched),
                  item: items,
                  totalRate: enriched.Total,
                });
              }

              if (enriched.Sample_No && enriched.printData) {
                cacheSamplePrintData(
                  enriched.Sample_No,
                  deserializePrintData(enriched.printData)
                );
              }

              return enriched;
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

  useEffect(() => {
    if (item) {
      item.forEach((_, index) => {
        const total = calculateTotal(index);
        const currentTotal = item[index]?.itemTotal;
        if (currentTotal !== total.toFixed(2)) {
          form.setValue(`item.${index}.itemTotal`, total.toFixed(2));
        }
      });
    }
  }, [item, form]);

  useEffect(() => {
    if (item) {
      let totalRate =
        item.reduce((acc, item) => {
          const rate = item.itemTotal ? parseFloat(item.itemTotal) : 0;
          return acc + rate;
        }, 0) +
        (Number(wt) || 0) * (Number(wtRate) || 0) +
        (Number(polish) || 0);
      form.setValue("totalRate", totalRate.toString());
    }
  }, [item, polish, wt, wtRate, form]);

  useResetFormOnModalClose(showDesignDialog, () => {
    if (keepDesignSelectionRef.current) {
      keepDesignSelectionRef.current = false;
      return;
    }
    form.setValue("designId", "");
    setOrderDesignInput("");
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
  };
};
