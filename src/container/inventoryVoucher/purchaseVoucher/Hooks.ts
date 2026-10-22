import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useListPerPage } from "@/lib/useListPerPage";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch, useSelector } from "react-redux";
import {
  PurchaseVoucherFormData,
  PurchaseTableData,
  PurchaseVoucherTableData,
  ItemRequisitionRow,
} from "@/types/inventoryVoucher/PurchaseVoucherTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { format } from "date-fns";
import {
  addPurchaseVoucherAPI,
  deletePurchaseVoucherAPI,
  getItemRequisitionAPI,
  getPurchasePartyAPI,
  getPurchaseVoucherAPI,
  updatePurchaseVoucherAPI,
} from "./PurchaseVoucherApis";
import {
  getItemRequisitionData,
  getPurchasePartyData,
  getPurchaseVoucherData,
} from "./PurchaseVoucherReducer";
import { ItemTableData } from "@/types/master/ItemTypes";
import { getItemRateAPI } from "@/container/master/itemRate/ItemRateApis";
import { toTwoDecimalString } from "@/utils/formatDecimal";
import { resolvePurchaseOrderType } from "@/utils/purchaseType";

interface PurchasePartyData {
  Id: number;
  Party_Name: string;
}

interface ItemState {
  itemData: ItemTableData[];
}

interface PurchaseVoucherState {
  purchasePartyData: PurchasePartyData[];
}

interface RootState {
  purchaseVoucher: PurchaseVoucherState;
  item: ItemState;
}

const ORDER_ID_KEYS = ["Order_Id", "order_id", "Order_ID", "OrderId", "Ord_Id"];
const ORDER_NO_KEYS = ["Order_No", "order_no", "OrderNo", "Ord_No"];

const pickRecordValue = (source: object, keys: string[]) => {
  const record = source as Record<string, unknown>;
  for (const key of keys) {
    const value = String(record[key] ?? "").trim();
    if (value) return value;
  }
  return "";
};

export const usePurchaseVoucher = () => {
  const dispatch = useDispatch();

  const [addPurchaseVoucherLoading, setAddPurchaseVoucherLoading] =
    useState(false);
  const [deletePurchaseVoucherLoading, setDeletePurchaseVoucherLoading] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);
  const [finId, setFinId] = useState<number | null>(null);

  const [currentPurchasePartyPage, setCurrentPurchasePartyPage] = useState(1);
  const [lastPurchasePartyPage, setLastPurchasePartyPage] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { perPage, handlePerPageChange } = useListPerPage(() =>
    setCurrentPage(1),
  );

  const [purchasePartyInput, setPurchasePartyInput] = useState("");
  const [itemInput, setItemInput] = useState("");

  const [selected, setSelected] = useState("form");

  const [purchaseTableData, setPurchaseTableData] = useState<
    PurchaseTableData[] | []
  >([]);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRequisitionModal, setShowRequisitionModal] = useState(false);
  const [requisitionLoading, setRequisitionLoading] = useState(false);
  const lastOrderPurchaseTypeRef = useRef("R");

  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);
  const [editPurchaseId, setEditPurchaseId] = useState<number | null>(null);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successPurchaseNos, setSuccessPurchaseNos] = useState<string[]>([]);

  const purchasePartyData: PurchasePartyData[] = useSelector(
    (state: RootState) => state?.purchaseVoucher?.purchasePartyData
  );

  const itemData: ItemTableData[] = useSelector(
    (state: RootState) => state?.item?.itemData
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
      setFinId(getCookieData<number | null>("waxCraftClientFinId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    purchaseType: yup.string().required("Purchase type is required"),
    orderPurchaseType: yup.string().required("Purchase type is required"),
    purchaseDate: yup.date().required("Purchase date is required"),
    partyId: yup.string().required("Party is required"),
    purchaseNo: yup.string().required("Purchase no. is required"),
    itemId: yup.string().required("Item is required"),
    quantity: yup.string().required("Quantity is required"),
    rate: yup.string().required("Rate is required"),
    roundOff: yup.string().default(""),
    discount: yup.string().default(""),
    transMode: yup.string().required("Trans mode is required"),
    bankId: yup.string().default(""),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<PurchaseVoucherFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      purchaseType: "N",
      orderPurchaseType: "R",
      purchaseDate: new Date(),
      partyId: "",
      purchaseNo: "",
      itemId: "",
      quantity: "",
      rate: "",
      roundOff: "",
      discount: "",
      transMode: "C",
      bankId: "",
    },
  });

  const { purchaseType, orderPurchaseType } = form.watch();

  const buildPurchaseRow = ({
    itemId,
    itemName,
    quantity,
    rate,
    itemGl,
    values,
    orderId = "",
    orderNo = "",
  }: {
    itemId: string;
    itemName: string;
    quantity: string;
    rate: string;
    itemGl: string | number;
    values: PurchaseVoucherFormData;
    orderId?: string;
    orderNo?: string;
  }): PurchaseTableData => {
    const masterItem = itemData.find((item) => item.Id.toString() === itemId);
    const taxableTotal = Number(quantity) * Number(rate);
    const cgstRate = Number(masterItem?.CGST) || 0;
    const sgstRate = Number(masterItem?.SGST) || 0;
    const cgst = purchaseType === "Y" ? (cgstRate * taxableTotal) / 100 : "";
    const sgst = purchaseType === "Y" ? (sgstRate * taxableTotal) / 100 : "";
    const gstTotal =
      purchaseType === "Y"
        ? (cgstRate * taxableTotal) / 100 + (sgstRate * taxableTotal) / 100
        : 0;

    return {
      purchaseDate: values.purchaseDate,
      partyId: values.partyId,
      partyName:
        purchasePartyData.find(
          (party) => party.Id.toString() === values.partyId
        )?.Party_Name || "",
      purchaseNo: values.purchaseNo,
      itemId,
      itemName: itemName || masterItem?.Item_Name || "",
      quantity,
      rate,
      taxableTotal,
      cgst,
      sgst,
      grandTotal: taxableTotal + gstTotal,
      itemGl: itemGl || masterItem?.Purchase_Gl || "",
      orderPurchaseType: values.orderPurchaseType || "R",
      orderId,
      orderNo,
    };
  };

  const resetLineFields = () => {
    // Only clear line-item fields. Keep purchase header so final Add still has
    // date / party / purchase no after rows are added to the table.
    form.setValue("itemId", "");
    form.setValue("quantity", "");
    form.setValue("rate", "");
    form.clearErrors(["itemId", "quantity", "rate"]);
    setItemInput("");
  };

  // Handle form submission
  const handleSubmit: SubmitHandler<PurchaseVoucherFormData> = (values) => {
    setPurchaseTableData((prev) => [
      ...prev,
      buildPurchaseRow({
        itemId: values.itemId,
        itemName: "",
        quantity: values.quantity,
        rate: values.rate,
        itemGl: "",
        values,
      }),
    ]);

    resetLineFields();
  };

  const pickRequisitionRate = (row: Record<string, unknown>) => {
    const candidates = [
      row.Item_Rate,
      row.item_rate,
      row.Rate,
      row.rate,
      row.Pur_Rate,
      row.pur_rate,
      row.Purchase_Rate,
      row.purchase_rate,
      row.Order_Rate,
      row.order_rate,
    ];

    for (const candidate of candidates) {
      const value = toTwoDecimalString(candidate);
      if (value && Number(value) >= 0 && String(candidate ?? "").trim() !== "") {
        return value;
      }
    }

    return "";
  };

  const fetchItemPurchaseRate = async (
    orgId: number,
    itemId: string,
    fallbackRate?: unknown,
  ) => {
    const fromFallback = toTwoDecimalString(fallbackRate);
    if (fromFallback && Number(fromFallback) > 0) return fromFallback;

    if (!itemId) return fromFallback || "";

    try {
      const res: ApiResponse = await getItemRateAPI(orgId, itemId);
      if (res.status === 200 && res.data.details != null) {
        const fetched = toTwoDecimalString(res.data.details);
        if (fetched) return fetched;
      }
    } catch {
      // Keep fallback rate if fetch fails.
    }

    return fromFallback || "";
  };

  const enrichRequisitionRowsWithRates = async (
    orgId: number,
    rows: ItemRequisitionRow[],
  ) => {
    const uniqueItemIds = [
      ...new Set(
        rows
          .map((row) => String(row.Item_Id ?? row.Id ?? "").trim())
          .filter(Boolean),
      ),
    ];

    const rateEntries = await Promise.all(
      uniqueItemIds.map(async (itemId) => {
        const existing = rows.find(
          (row) => String(row.Item_Id ?? row.Id ?? "") === itemId,
        );
        const rate = await fetchItemPurchaseRate(
          orgId,
          itemId,
          pickRequisitionRate((existing || {}) as Record<string, unknown>),
        );
        return [itemId, rate] as const;
      }),
    );

    const rateByItemId = Object.fromEntries(rateEntries);

    return rows.map((row) => {
      const itemId = String(row.Item_Id ?? row.Id ?? "");
      const rate =
        rateByItemId[itemId] ||
        pickRequisitionRate(row as unknown as Record<string, unknown>);

      return {
        ...row,
        Item_Rate: rate,
      };
    });
  };

  /** Only party orders not yet invoiced (Is_Party = 1, Is_Invoise = 0); missing flags are trusted to the API. */
  const isPendingPartyOrder = (row: ItemRequisitionRow) => {
    const isParty = row.Is_Party;
    const isInvoise = row.Is_Invoise;
    const partyOk =
      isParty == null || String(isParty).trim() === "" ||
      isParty === true || String(isParty).trim() === "1";
    const invoiseOk =
      isInvoise == null || String(isInvoise).trim() === "" ||
      isInvoise === false || String(isInvoise).trim() === "0";
    return partyOk && invoiseOk;
  };

  const normalizeRequisitionRows = (details: unknown): ItemRequisitionRow[] => {
    const source = details as
      | ItemRequisitionRow[]
      | { data?: ItemRequisitionRow[] }
      | null;
    const raw = Array.isArray(source)
      ? source
      : Array.isArray(source?.data)
        ? source.data
        : [];

    const rows: ItemRequisitionRow[] = [];

    raw.filter(isPendingPartyOrder).forEach((row, rowIndex) => {
      if (Array.isArray(row.ItemRow) && row.ItemRow.length > 0) {
        row.ItemRow.forEach((item, itemIndex) => {
          const itemRecord = item as unknown as Record<string, unknown>;
          rows.push({
            ...item,
            Id: item.Id ?? item.Item_Id ?? row.Id,
            Item_Id: item.Item_Id ?? item.Id,
            Item_Name: item.Item_Name,
            Item_Qnty: item.Item_Qnty ?? item.Qnty ?? item.Quantity,
            Item_Rate: pickRequisitionRate(itemRecord),
            Order_No: item.Order_No ?? row.Order_No ?? row.Req_No,
            Req_No: item.Req_No ?? row.Req_No,
            Party_Name: item.Party_Name ?? row.Party_Name,
            Req_Id: item.Req_Id ?? row.Req_Id ?? row.Id,
            Order_Id: item.Order_Id ?? row.Order_Id ?? row.Id,
            Purchase_Gl: item.Purchase_Gl,
            Is_Party: item.Is_Party ?? row.Is_Party,
            Is_Invoise: item.Is_Invoise ?? row.Is_Invoise,
            Row_Key: `req-${row.Id ?? row.Req_Id ?? rowIndex}-${item.Item_Id ?? item.Id ?? itemIndex}-${itemIndex}`,
          });
        });
        return;
      }

      const rowRecord = row as unknown as Record<string, unknown>;
      rows.push({
        ...row,
        Id: row.Id ?? row.Item_Id,
        Item_Id: row.Item_Id ?? row.Id,
        Item_Name: row.Item_Name,
        Item_Qnty: row.Item_Qnty ?? row.Qnty ?? row.Quantity,
        Item_Rate: pickRequisitionRate(rowRecord),
        Order_No: row.Order_No ?? row.Req_No,
        Party_Name: row.Party_Name,
        Req_Id: row.Req_Id ?? row.Id,
        Order_Id: row.Order_Id ?? row.Req_Id,
        Row_Key: `req-${row.Id ?? row.Req_Id ?? row.Item_Id ?? rowIndex}-${rowIndex}`,
      });
    });

    return rows.filter(isPendingPartyOrder);
  };

  const getItemRequisitionApiCall = async (orgId: number) => {
    setRequisitionLoading(true);

    try {
      const res: ApiResponse = await getItemRequisitionAPI(orgId, 1, "");

      if (res.status === 200) {
        const normalized = normalizeRequisitionRows(res.data.details);
        const enriched = await enrichRequisitionRowsWithRates(
          orgId,
          normalized,
        );
        dispatch(getItemRequisitionData(enriched));
      } else {
        dispatch(getItemRequisitionData([]));
        toast.error(res.data.message || "Unable to load requisition list");
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getItemRequisitionData([]));
    } finally {
      setRequisitionLoading(false);
    }
  };

  const handleOrderPurchaseTypeChange = (value: string) => {
    const typeChanged = lastOrderPurchaseTypeRef.current !== value;
    lastOrderPurchaseTypeRef.current = value;

    if (typeChanged) {
      form.reset({
        purchaseType: "N",
        orderPurchaseType: value,
        purchaseDate: new Date(),
        partyId: "",
        purchaseNo: "",
        itemId: "",
        quantity: "",
        rate: "",
        roundOff: "",
        discount: "",
        transMode: "C",
        bankId: "",
      });
      form.clearErrors();
      setPurchasePartyInput("");
      setItemInput("");
      setPurchaseTableData([]);
    }

    if (value === "O") {
      setShowRequisitionModal(true);
      if (orgId) getItemRequisitionApiCall(orgId);
      return;
    }

    setShowRequisitionModal(false);
  };

  const handleAddRequisitionItems = async (rows: ItemRequisitionRow[]) => {
    if (!rows.length) {
      toast.error("Select at least one requisition item.");
      return;
    }

    if (!orgId) {
      toast.error("Something went wrong");
      return;
    }

    const values = form.getValues();
    const lineKey = (itemId: string, orderId: string) => `${itemId}:${orderId}`;
    const rowOrderId = (row: ItemRequisitionRow) =>
      String(row.Order_Id ?? "").trim();
    const existingKeys = new Set(
      purchaseTableData.map((item) => lineKey(item.itemId, item.orderId ?? "")),
    );
    const filtered = rows.filter((row) => {
      const itemId = String(row.Item_Id ?? row.Id ?? "");
      return itemId && !existingKeys.has(lineKey(itemId, rowOrderId(row)));
    });

    if (!filtered.length) {
      toast.error("Selected items are already in the table.");
      return;
    }

    const mergedByLine = new Map<string, ItemRequisitionRow>();
    filtered.forEach((row) => {
      const itemId = String(row.Item_Id ?? row.Id ?? "");
      const key = lineKey(itemId, rowOrderId(row));
      const quantity = Number(row.Item_Qnty ?? row.Qnty ?? row.Quantity ?? 0) || 0;
      const existing = mergedByLine.get(key);
      if (existing) {
        existing.Item_Qnty = toTwoDecimalString(
          (Number(existing.Item_Qnty) || 0) + quantity,
        );
        return;
      }
      mergedByLine.set(key, {
        ...row,
        Item_Qnty: toTwoDecimalString(quantity),
      });
    });

    const nextRows = await Promise.all(
      Array.from(mergedByLine.values()).map(async (row) => {
        const itemId = String(row.Item_Id ?? row.Id ?? "");
        const rate = await fetchItemPurchaseRate(
          orgId,
          itemId,
          pickRequisitionRate(row as unknown as Record<string, unknown>),
        );

        return buildPurchaseRow({
          itemId,
          itemName: row.Item_Name || "",
          quantity: String(row.Item_Qnty ?? row.Qnty ?? row.Quantity ?? ""),
          rate,
          itemGl: row.Purchase_Gl || "",
          values: {
            ...values,
            orderPurchaseType: "O",
          },
          orderId: rowOrderId(row),
          orderNo: String(row.Order_No || row.Req_No || ""),
        });
      }),
    );

    setPurchaseTableData((prev) => [...prev, ...nextRows]);
    setShowRequisitionModal(false);
  };

  const resetPurchaseForm = () => {
    form.reset({
      purchaseType: "N",
      orderPurchaseType: "R",
      purchaseDate: new Date(),
      partyId: "",
      purchaseNo: "",
      itemId: "",
      quantity: "",
      rate: "",
      roundOff: "",
      discount: "",
      transMode: "C",
      bankId: "",
    });
    form.clearErrors();
    lastOrderPurchaseTypeRef.current = "R";
    setPurchasePartyInput("");
    setItemInput("");
    setPurchaseTableData([]);
  };

  const handleEditPurchase = (data: PurchaseVoucherTableData) => {
    const items = data.ItemRow ?? [];
    const orderPurchaseType =
      resolvePurchaseOrderType(data) ??
      (items.some((item) => pickRecordValue(item, ORDER_ID_KEYS)) ? "O" : "R");
    const withGst = items.some(
      (item) => Number(item.Item_CGST) > 0 || Number(item.Item_SGST) > 0,
    );
    const isCredit = String(data.Is_Credit ?? "").trim() === "1";
    const bankId = String(data.Bank_Id ?? "").trim();
    const transMode = isCredit ? "Cr" : bankId ? "B" : "C";
    const purchaseDate = data.Purchase_Date
      ? new Date(data.Purchase_Date)
      : new Date();
    const partyId = String(data.Party_Id ?? "");
    const purchaseNo = String(data.Purchase_No ?? "");

    lastOrderPurchaseTypeRef.current = orderPurchaseType;
    form.reset({
      purchaseType: withGst ? "Y" : "N",
      orderPurchaseType,
      purchaseDate,
      partyId,
      purchaseNo,
      itemId: "",
      quantity: "",
      rate: "",
      roundOff: "",
      discount:
        data.Tot_Discount == null || Number(data.Tot_Discount) === 0
          ? ""
          : String(data.Tot_Discount),
      transMode,
      bankId: transMode === "B" ? bankId : "",
    });
    form.clearErrors();
    setPurchasePartyInput(String(data.Party_Name ?? ""));
    setItemInput("");
    setPurchaseTableData(
      items.map((item) => {
        const itemId = String(item.Item_Id ?? "");
        const masterItem = itemData.find(
          (master) => master.Id.toString() === itemId,
        );
        const quantity = String(item.Item_Qnty ?? "");
        const rate = String(item.Item_Rate ?? "");
        const taxableTotal = (Number(quantity) || 0) * (Number(rate) || 0);
        const cgst = withGst ? Number(item.Item_CGST) || 0 : "";
        const sgst = withGst ? Number(item.Item_SGST) || 0 : "";

        return {
          purchaseDate,
          partyId,
          partyName: String(data.Party_Name ?? ""),
          purchaseNo,
          itemId,
          itemName: item.Item_Name || masterItem?.Item_Name || "",
          quantity,
          rate,
          taxableTotal,
          cgst,
          sgst,
          grandTotal: taxableTotal + (Number(cgst) || 0) + (Number(sgst) || 0),
          itemGl: item.Item_Gl ?? masterItem?.Purchase_Gl ?? "",
          orderPurchaseType,
          orderId:
            orderPurchaseType === "O"
              ? pickRecordValue(item, ORDER_ID_KEYS) ||
                pickRecordValue(data, ORDER_ID_KEYS)
              : "",
          orderNo:
            pickRecordValue(item, ORDER_NO_KEYS) ||
            pickRecordValue(data, ORDER_NO_KEYS),
        };
      }),
    );
    setShowRequisitionModal(false);
    setEditPurchaseId(data.Id);
    setSelected("form");
  };

  const handleCancelEditPurchase = () => {
    setEditPurchaseId(null);
    resetPurchaseForm();
    setSelected("table");
  };

  const handleShowDeleteDialog = (id: number) => {
    setShowDeleteDialog(true);
    setTempDeleteId(id);
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setSuccessMessage("");
    setSuccessPurchaseNos([]);
  };

  const handleDeletePurchase = () => {
    if (orgId && tempDeleteId) deletePurchaseApiCall(orgId, tempDeleteId);
  };

  const handleAddPurchase = () => {
    if (!orgId) {
      toast.error("Something went wrong");
      return;
    }

    if (purchaseTableData.length === 0) {
      toast.error("Add at least one item to the table");
      return;
    }

    const firstRow = purchaseTableData[0];
    const purchaseDate =
      form.getValues("purchaseDate") || firstRow?.purchaseDate;
    const purchaseNo =
      form.getValues("purchaseNo") || firstRow?.purchaseNo || "";
    const partyId = form.getValues("partyId") || firstRow?.partyId || "";
    const transMode = form.getValues("transMode") || "C";
    const bankId = form.getValues("bankId") || "";

    if (!purchaseDate) {
      toast.error("Purchase date is required");
      return;
    }
    if (!partyId) {
      toast.error("Party is required");
      return;
    }
    if (!purchaseNo) {
      toast.error("Purchase no. is required");
      return;
    }
    if (transMode === "B" && !bankId) {
      toast.error("Bank is required");
      return;
    }

    addPurchaseVoucherApiCall(orgId);
  };

  const handleDeletePurchaseTableData = (Id: number) => {
    const newPurchaseTableData = purchaseTableData.filter((_, i) => i !== Id);
    setPurchaseTableData(newPurchaseTableData);
  };

  const handleUpdatePurchaseTableRate = (index: number, rate: string) => {
    setPurchaseTableData((prev) =>
      prev.map((row, rowIndex) => {
        if (rowIndex !== index) return row;

        const quantity = Number(row.quantity) || 0;
        const nextRate = Number(rate) || 0;
        const taxableTotal = quantity * nextRate;
        const masterItem = itemData.find(
          (item) => item.Id.toString() === String(row.itemId),
        );
        const cgstRate = Number(masterItem?.CGST) || 0;
        const sgstRate = Number(masterItem?.SGST) || 0;
        const withGst = purchaseType === "Y";
        const cgst = withGst ? (cgstRate * taxableTotal) / 100 : "";
        const sgst = withGst ? (sgstRate * taxableTotal) / 100 : "";
        const gstTotal = withGst
          ? (cgstRate * taxableTotal) / 100 + (sgstRate * taxableTotal) / 100
          : 0;

        return {
          ...row,
          rate,
          taxableTotal,
          cgst,
          sgst,
          grandTotal: taxableTotal + gstTotal,
        };
      }),
    );
  };

  const addPurchaseVoucherApiCall = async (orgId: number) => {
    setAddPurchaseVoucherLoading(true);

    const firstRow = purchaseTableData[0];
    const purchaseDate =
      form.getValues("purchaseDate") || firstRow?.purchaseDate;
    const purchaseNo =
      form.getValues("purchaseNo") || firstRow?.purchaseNo || "";
    const partyId = form.getValues("partyId") || firstRow?.partyId || "";
    const roundOff = form.getValues("roundOff");
    const discount = form.getValues("discount");

    const isOrderPurchase = form.getValues("orderPurchaseType") === "O";
    const orderIds = isOrderPurchase
      ? Array.from(
          new Set(
            purchaseTableData
              .map((item) => String(item.orderId ?? "").trim())
              .filter(Boolean),
          ),
        )
      : [];

    const invoicePostData = purchaseTableData.map((item) => ({
      order_id: isOrderPurchase && item.orderId ? item.orderId : null,
      item_id: item.itemId,
      item_gl: item.itemGl,
      item_qnty: item.quantity,
      item_rate: item.rate,
      item_tot: item.taxableTotal,
      item_cgst: item.taxableTotal * (Number(item.cgst) / 100 || 0),
      item_sgst: item.taxableTotal * (Number(item.sgst) / 100 || 0),
      item_igst: null,
    }));

    const data = {
      org_id: orgId,
      pur_date: purchaseDate ? format(purchaseDate, "yyyy-MM-dd") : "",
      pur_no: purchaseNo,
      party_id: partyId,
      tot_amount: purchaseTableData.reduce((acc, item) => {
        const rate = item.taxableTotal ? item.taxableTotal : 0;
        return acc + rate;
      }, 0),
      tot_cgst: invoicePostData.reduce((acc, item) => {
        const rate = item.item_cgst ? Number(item.item_cgst) : 0;
        return acc + rate;
      }, 0),
      tot_sgst: invoicePostData.reduce((acc, item) => {
        const rate = item.item_sgst ? Number(item.item_sgst) : 0;
        return acc + rate;
      }, 0),
      tot_igst: 0,
      tot_round: roundOff === "" || roundOff == null ? 0 : roundOff,
      tot_discount: discount === "" || discount == null ? 0 : discount,
      year_id: finId,
      is_credit: form.getValues("transMode") === "Cr" ? 1 : null,
      is_order: isOrderPurchase ? 1 : 0,
      order_id: orderIds.length ? orderIds.join(",") : null,
      invoise_data: invoicePostData,
      bank_id:
        form.getValues("transMode") === "B" ? form.getValues("bankId") : null,
    };

    const isEditing = editPurchaseId != null;

    try {
      const res: ApiResponse = isEditing
        ? await updatePurchaseVoucherAPI({ ...data, pur_id: editPurchaseId })
        : await addPurchaseVoucherAPI(data);

      if (res.status === 200 && isEditing) {
        setEditPurchaseId(null);
        resetPurchaseForm();
        setCurrentPage(1);
        setSelected("table");
        getPurchaseVoucherApiCall(orgId, 1, "");
        toast.success(res.data.message || "Purchase updated successfully");
      } else if (res.status === 200) {
        const savedPurchaseNo = String(purchaseNo || "").trim();
        form.reset({
          purchaseType: "N",
          orderPurchaseType: "R",
          purchaseDate: new Date(),
          partyId: "",
          purchaseNo: "",
          itemId: "",
          quantity: "",
          rate: "",
          roundOff: "",
          discount: "",
          transMode: "C",
          bankId: "",
        });
        setPurchasePartyInput("");
        setItemInput("");
        setPurchaseTableData([]);
        setCurrentPage(1);
        setSelected("table");
        getPurchaseVoucherApiCall(orgId, 1, "");
        setSuccessMessage(
          String(res.data.message || "Purchase added successfully").trim(),
        );
        setSuccessPurchaseNos(savedPurchaseNo ? [savedPurchaseNo] : []);
        setShowSuccessDialog(true);
      } else {
        toast.error(
          res.data.message ||
            (isEditing ? "Unable to update purchase" : "Unable to add purchase"),
        );
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddPurchaseVoucherLoading(false);
    }
  };

  const deletePurchaseApiCall = async (orgId: number, purchaseId: number) => {
    setDeletePurchaseVoucherLoading(true);

    const data = {
      org_id: orgId,
      pur_id: purchaseId,
    };

    try {
      const res: ApiResponse = await deletePurchaseVoucherAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        if (editPurchaseId === purchaseId) {
          setEditPurchaseId(null);
          resetPurchaseForm();
        }
        setCurrentPage(1);
        getPurchaseVoucherApiCall(orgId, 1, "");
        setShowDeleteDialog(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeletePurchaseVoucherLoading(false);
    }
  };

  const getPurchaseVoucherApiCall = async (
    orgId: number,
    page: number,
    keyword: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getPurchaseVoucherAPI(
        orgId,
        page,
        keyword,
        perPage,
      );

      if (res.status === 200) {
        const details = res.data.details;
        const rows = Array.isArray(details)
          ? details
          : Array.isArray(details?.data)
            ? details.data
            : [];
        dispatch(getPurchaseVoucherData(rows));
        setLastPage(
          Number(details?.pagination?.last_page) > 0
            ? Number(details.pagination.last_page)
            : Number(details?.last_page) > 0
              ? Number(details.last_page)
              : 1,
        );
      } else {
        dispatch(getPurchaseVoucherData([]));
        setLastPage(1);
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getPurchaseVoucherData([]));
    } finally {
      setLoading(false);
    }
  };

  const getPurchasePartyApiCall = async (
    orgId: number,
    page: number,
    keyword: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getPurchasePartyAPI(orgId, page, keyword);

      if (res.status === 200) {
        const newData =
          page === 1
            ? res.data.details?.data
            : [...purchasePartyData, ...res.data.details?.data];
        dispatch(getPurchasePartyData(newData));
        setLastPurchasePartyPage(res.data.details?.last_page);
      } else {
        dispatch(getPurchasePartyData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getPurchasePartyData([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (purchaseTableData.length > 0) {
      const totalAmount = purchaseTableData.reduce((acc, item) => {
        const rate = item.grandTotal ? item.grandTotal : 0; // Convert string to number, default to 0 if invalid
        return acc + rate;
      }, 0);

      const roundedTotal = Math.round(totalAmount);
      const roundOffAmount = roundedTotal - totalAmount;
      form.setValue("roundOff", roundOffAmount.toFixed(2).toString());
    } else {
      form.setValue("roundOff", "");
    }
  }, [purchaseTableData]);

  return {
    getPurchaseVoucherApiCall,
    getPurchasePartyApiCall,
    addPurchaseVoucherLoading,
    deletePurchaseVoucherLoading,
    loading,
    form,
    handleSubmit,
    selected,
    setSelected,
    handleAddPurchase,
    purchaseTableData,
    handleDeletePurchaseTableData,
    handleUpdatePurchaseTableRate,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeletePurchase,
    purchaseType,
    orderPurchaseType,
    handleOrderPurchaseTypeChange,
    showRequisitionModal,
    setShowRequisitionModal,
    requisitionLoading,
    handleAddRequisitionItems,
    showSuccessDialog,
    setShowSuccessDialog,
    successMessage,
    successPurchaseNos,
    handleCloseSuccessDialog,
    editPurchaseId,
    handleEditPurchase,
    handleCancelEditPurchase,
    currentPurchasePartyPage,
    setCurrentPurchasePartyPage,
    lastPurchasePartyPage,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    purchasePartyInput,
    setPurchasePartyInput,
    itemInput,
    setItemInput,
  };
};
