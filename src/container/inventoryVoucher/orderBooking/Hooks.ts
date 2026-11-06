import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useListPerPage } from "@/lib/useListPerPage";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";
import getCookieData from "@/utils/getCookieData";
import { useDispatch, useSelector } from "react-redux";
import {
  OrderBookingBody,
  OrderBookingFormData,
  OrderBookingTableData,
  OrderItemListData,
  OrderTableData,
} from "@/types/inventoryVoucher/OrderBookingTypes";
import { ApiResponse } from "@/types/ApiTypes";
import {
  addOrderBookingAPI,
  deleteOrderBookingAPI,
  getDesignDetailsAPI,
  getOrderBookingAPI,
  getOrderDesignAPI,
  getOrderPartyAPI,
  updateOrderBookingAPI,
} from "./OrderBookingApis";
import {
  getOrderBookingData,
  getOrderDesignData,
  getOrderDesignDetailsData,
  getOrderPartyData,
} from "./OrderBookingReducer";
import { useParty } from "@/container/master/party/Hooks";
import { PartyFormData } from "@/types/master/PartyTypes";
import { addPartyAPI } from "@/container/master/party/PartyApis";
import { ChildRow, DesignTableData } from "@/types/master/DesignTypes";
import { format } from "date-fns";
import { resolveListLastPage } from "@/lib/listTotalCount";
import { loadAllParties } from "@/lib/loadAllParties";
import { useSearchDebounce } from "@/lib/useSearchDebounce";
import { toRateString } from "@/utils/formatDecimal";
import { toApiDate } from "@/lib/voucherTableDate";
import { getPartyMakingRateByPartyAPI } from "@/container/master/partyMakingRate/PartyMakingRateApis";
import {
  findDesignPartyMakingRate,
  findPartyMakingRate,
  parsePartyMakingRateRows,
  PartyMakingRateSetup,
} from "@/utils/partyMakingRate";

interface OrderPartyData {
  Id: number;
  Party_Name: string;
  Party_Add: string;
  Party_Mob: string;
  Party_Gst: string;
}

interface OrderDesignData {
  Id: number;
  Design_Name: string;
  Design_No?: string;
}

interface OrderBookingState {
  orderPartyData: OrderPartyData[];
  orderDesignData: OrderDesignData[];
  orderDesignDetailsData: DesignTableData;
}

interface RootState {
  orderBooking: OrderBookingState;
}

const extractOrderIds = (details: unknown): string[] => {
  if (details == null || details === "") return [];

  if (typeof details === "string" || typeof details === "number") {
    const value = String(details).trim();
    if (!value) return [];
    if (value.includes(",")) {
      return value
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
    }
    return [value];
  }

  if (Array.isArray(details)) {
    return details.flatMap((item) => extractOrderIds(item)).filter(Boolean);
  }

  if (typeof details === "object") {
    const record = details as Record<string, unknown>;
    const candidates = [
      record.Order_No,
      record.order_no,
      record.OrderNo,
      record.orderNo,
      record.Order_Id,
      record.order_id,
      record.OrderId,
      record.orderId,
      record.Id,
      record.id,
      record.order_nos,
      record.Order_Nos,
      record.orders,
      record.Order_List,
      record.order_list,
      record.data,
      record.details,
    ];

    for (const candidate of candidates) {
      const ids = extractOrderIds(candidate);
      if (ids.length) return Array.from(new Set(ids));
    }
  }

  return [];
};

export const useOrderBooking = () => {
  const dispatch = useDispatch();
  const runDebouncedSearch = useSearchDebounce();

  const [addOrderBookingLoading, setAddOrderBookingLoading] = useState(false);
  const [updateOrderBookingLoading, setUpdateOrderBookingLoading] =
    useState(false);
  const [editOrderId, setEditOrderId] = useState<number | null>(null);
  const [editOrderNo, setEditOrderNo] = useState("");
  const [deleteOrderBookingLoading, setDeleteOrderBookingLoading] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const [getOrderPartyLoading, setGetOrderPartyLoading] = useState(false);
  const [getOrderDesignLoading, setGetOrderDesignLoading] = useState(false);

  const [addPartyLoading, setAddPartyLoading] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<number | null>(null);
  const [finId, setFinId] = useState<number | null>(null);

  const [currentOrderPartyPage, setCurrentOrderPartyPage] = useState(1);
  const [lastOrderPartyPage, setLastOrderPartyPage] = useState(1);
  const [orderPartyInput, setOrderPartyInput] = useState("");

  const [currentOrderDesignPage, setCurrentOrderDesignPage] = useState(1);
  const [lastOrderDesignPage, setLastOrderDesignPage] = useState(1);
  const [orderDesignInput, setOrderDesignInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { perPage, handlePerPageChange } = useListPerPage(() =>
    setCurrentPage(1),
  );
  const [orderTableInput, setOrderTableInput] = useState("");
  const [orderFromDate, setOrderFromDate] = useState<Date | undefined>();
  const [orderToDate, setOrderToDate] = useState<Date | undefined>();
  const [orderPartyFilter, setOrderPartyFilter] = useState("");
  const [orderItemTypeFilter, setOrderItemTypeFilter] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const orderFromDateApi = useMemo(
    () => toApiDate(orderFromDate),
    [orderFromDate],
  );
  const orderToDateApi = useMemo(() => toApiDate(orderToDate), [orderToDate]);
  const orderListFiltersRef = useRef({
    fromDate: "",
    toDate: "",
    partyId: "",
    itemType: "",
    orderStatus: "",
  });
  orderListFiltersRef.current = {
    fromDate: orderFromDateApi,
    toDate: orderToDateApi,
    partyId: orderPartyFilter,
    itemType: orderItemTypeFilter,
    orderStatus: orderStatusFilter,
  };

  const [selected, setSelected] = useState("form");

  const [showDesignDialog, setShowDesignDialog] = useState(false);

  const [orderDesignId, setOrderDesignId] = useState<number | null>(null);

  const [orderTableData, setOrderTableData] = useState<OrderTableData[]>([]);

  const orderLineSeqRef = useRef(0);

  const [itemListData, setItemListData] = useState<OrderItemListData[]>([]);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successOrderIds, setSuccessOrderIds] = useState<string[]>([]);

  const orderPartyData: OrderPartyData[] = useSelector(
    (state: RootState) => state?.orderBooking?.orderPartyData
  );

  const orderDesignData: OrderDesignData[] = useSelector(
    (state: RootState) => state?.orderBooking?.orderDesignData
  );

  const orderDesignDetailsData = useSelector(
    (state: RootState) => state?.orderBooking?.orderDesignDetailsData
  );

  const {
    getPartyLedgerApiCall,
    isOpen,
    setIsOpen,
    form: partyForm,
    partyType,
    getPartyLedgerLoading,
  } = useParty();

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
      setFinId(getCookieData<number | null>("waxCraftClientFinId"));
      setToken(getCookieData<string | null>("waxCraftClientToken"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    orderDate: yup.date().required("Order date is required"),
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
    ghat: yup.string().default(""),
    manualDesignRates: yup.boolean().default(false),
    image: yup.string().default(""),
    itemType: yup.string().required("Item type is required"),
    // Design-modal rows only; validated in the modal, not on main order submit.
    item: yup.array().default([]),
    totalRate: yup.string().default(""),
    orderQuantity: yup.string().default(""),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<OrderBookingFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      orderDate: new Date(),
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
      ghat: "",
      manualDesignRates: false,
      image: "",
      itemType: "1",
      item: [],
      totalRate: "",
      orderQuantity: "",
    },
  });

  const { partyId, designId } = form.watch();

  const toNum = (value: unknown) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  /** Line total: (rate × qty) + (makingRate × qty). Party item forces rate to 0. */
  const computeItemLineTotal = (
    row: {
      itemQuantity?: string | number;
      itemRate?: string | number;
      makingRate?: string | number;
    },
    forcePartyRate = false,
  ) => {
    const qty = toNum(row?.itemQuantity);
    const rate = forcePartyRate ? 0 : toNum(row?.itemRate);
    const making = toNum(row?.makingRate);
    return qty * rate + qty * making;
  };

  const syncingTotalsRef = useRef(false);

  const syncDesignItemTotals = () => {
    if (syncingTotalsRef.current) return;
    syncingTotalsRef.current = true;
    try {
      const rows = form.getValues("item") ?? [];
      if (!rows.length) {
        form.setValue("totalRate", "0.00", { shouldDirty: false });
        return;
      }

      const isPartyItem = form.getValues("itemType") === "0";

      rows.forEach((row, index) => {
        if (isPartyItem && String(row.itemRate ?? "") !== "0") {
          form.setValue(`item.${index}.itemRate`, "0", { shouldDirty: false });
        }

        const nextTotal = computeItemLineTotal(row, isPartyItem).toFixed(2);
        if (String(row.itemTotal ?? "") !== nextTotal) {
          form.setValue(`item.${index}.itemTotal`, nextTotal, {
            shouldDirty: false,
          });
        }
      });

      const refreshed = form.getValues("item") ?? [];
      const itemsSum = refreshed.reduce(
        (acc, row) => acc + toNum(row.itemTotal),
        0,
      );
      const designExtras =
        toNum(form.getValues("wt")) * toNum(form.getValues("wtRate")) +
        toNum(form.getValues("polish"));
       
      const nextTotalRate = (itemsSum + designExtras).toFixed(2); // Total rate includes WT/Polish, not just item totals and making rates two decimal places.

      if (String(form.getValues("totalRate") ?? "") !== nextTotalRate) {
        form.setValue("totalRate", nextTotalRate, { shouldDirty: false });
      }
    } finally {
      syncingTotalsRef.current = false;
    }
  };

  // Handle form submission
  const handleSubmit: SubmitHandler<OrderBookingFormData> = (values) => {
    if (!orderTableData.length) {
      toast.error("Add at least one design to the order.");
      return;
    }
    if (orgId) {
      if (editOrderId != null) {
        updateOrderBookingApiCall(values, orgId, editOrderId);
      } else {
        addOrderBookingApiCall(values, orgId);
      }
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const resetOrderForm = () => {
    form.reset({
      orderDate: new Date(),
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
      ghat: "",
      manualDesignRates: false,
      image: "",
      itemType: "1",
      item: [],
      totalRate: "",
      orderQuantity: "",
    });
    setOrderPartyInput("");
    setOrderDesignInput("");
    setOrderTableData([]);
    setItemListData([]);
  };

  const toFormNumber = (value: number) =>
    Number.isFinite(value) ? String(Number(value.toFixed(4))) : "";

  // GetActiveOrder returns order-total quantities/weights (as posted by
  // PostOrder); the form works per design unit, so divide by Order_Qnty.
  const handleEditOrder = async (order: OrderBookingTableData) => {
    if (!orgId) return;
    if (order.Order_Status !== "Ordered") {
      toast.error("Only orders with status Ordered can be edited.");
      return;
    }

    resetOrderForm();
    setEditOrderId(order.Id);
    setEditOrderNo(String(order.Order_No ?? ""));
    setSelected("form");

    const designs = order.DesignRow ?? [];
    const source = order as unknown as Record<string, unknown>;
    const ownFlag = source.Is_Own ?? source.is_own;
    const allItemsZeroRate =
      designs.some((d) => (d.ItemRow ?? []).length > 0) &&
      designs.every((d) =>
        (d.ItemRow ?? []).every((child) => toNum(child.Item_Rate) === 0),
      );
    const itemType =
      ownFlag == null || String(ownFlag).trim() === ""
        ? allItemsZeroRate
          ? "0"
          : "1"
        : ownFlag === false || String(ownFlag).trim() === "0"
          ? "0"
          : "1";

    const nextOrderLines: OrderTableData[] = [];
    const nextItems: OrderItemListData[] = [];

    designs.forEach((design) => {
      const orderQty = toNum(design.Order_Qnty);
      const perUnit = (value: unknown) =>
        orderQty > 0 ? toNum(value) / orderQty : toNum(value);

      orderLineSeqRef.current += 1;
      const lineKey = `${design.Design_Id}-${orderLineSeqRef.current}`;

      const lineItems: OrderItemListData[] = (design.ItemRow ?? []).map(
        (child) => {
          const record = child as unknown as Record<string, unknown>;
          const itemQuantity = perUnit(child.Item_Qnty);
          const itemRate = itemType === "0" ? 0 : toNum(child.Item_Rate);
          const makingRate = toNum(child.Making_Rate);
          return {
            lineKey,
            designId: String(design.Design_Id),
            itemId: String(child.Item_Id),
            itemName: child.Item_Name,
            itemGl: String(
              record.Item_GL ?? record.Item_Gl ?? record.item_gl ?? "",
            ),
            itemShName: String(
              record.Item_Sh_Name ?? record.item_sh_name ?? child.Item_Name ?? "",
            ),
            itemQuantity: toFormNumber(itemQuantity),
            itemRate:
              itemType === "0"
                ? toFormNumber(itemRate)
                : toRateString(child.Item_Rate) || toFormNumber(itemRate),
            makingRate:
              toRateString(child.Making_Rate) || toFormNumber(makingRate),
            itemTotal: (
              itemQuantity * itemRate +
              itemQuantity * makingRate
            ).toFixed(2),
          };
        },
      );

      const wt = perUnit(design.Wt);
      const wtRate = toNum(design.Wt_Rate);
      const polish = toNum(design.Polish);
      const itemsSum = lineItems.reduce(
        (acc, row) => acc + toNum(row.itemTotal),
        0,
      );
      const designRate =
        String(design.Design_Rate ?? "").trim() !== ""
          ? toNum(design.Design_Rate)
          : itemsSum + wt * wtRate + polish;
      const ghatRaw = design.Ghat_Rate;

      nextOrderLines.push({
        lineKey,
        designId: design.Design_Id,
        designName: String(design.Design_Name ?? "").trim(),
        designNo: String(design.Design_No ?? "").trim(),
        orderQuantity: toFormNumber(orderQty),
        designRate: designRate.toFixed(2),
        totalRate: (designRate * orderQty).toFixed(2),
        wt: toFormNumber(wt),
        wtRate: toRateString(design.Wt_Rate) || toFormNumber(wtRate),
        polish: toFormNumber(polish),
        ghat:
          ghatRaw == null || String(ghatRaw).trim() === ""
            ? ""
            : String(ghatRaw).trim(),
        image: String(design.Image ?? "").trim(),
      });
      nextItems.push(...lineItems);
    });

    // Load the party first so the address/mobile/GSTIN effect can resolve it.
    await getOrderPartyApiCall(orgId, 1, "", order.Party_Id);

    form.setValue("orderDate", new Date(order.Order_Date));
    form.setValue("itemType", itemType);
    form.setValue("partyId", String(order.Party_Id ?? ""));
    setOrderPartyInput(String(order.Party_Name ?? ""));
    setOrderTableData(nextOrderLines);
    setItemListData(nextItems);
  };

  const handleCancelEditOrder = () => {
    setEditOrderId(null);
    setEditOrderNo("");
    resetOrderForm();
  };

  const handleShowDeleteDialog = (id: number) => {
    setShowDeleteDialog(true);
    setTempDeleteId(id);
  };

  const handleDeleteOrder = () => {
    if (orgId && tempDeleteId != null) {
      deleteOrderApiCall(orgId, tempDeleteId);
    }
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setSuccessMessage("");
    setSuccessOrderIds([]);
  };

  const handleShowPartyForm = () => {
    setIsOpen(true);
  };

  const handlePartySubmit: SubmitHandler<PartyFormData> = (values) => {
    if (orgId) {
      addPartyApiCall(values, orgId);
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const handleAddDesign = () => {
    if (orderDesignId) {
      const orderQty = form.getValues("orderQuantity");
      if (!(Number(orderQty) > 0)) {
        form.setError("orderQuantity", {
          type: "manual",
          message: "Order quantity must be greater than 0",
        });
        return;
      }
      form.clearErrors("orderQuantity");

      const item = form.getValues("item");

      if (item.length && !item.some((i) => toNum(i.itemQuantity) > 0)) {
        toast.error(
          item.length === 1
            ? "Item quantity must be greater than 0."
            : "At least one item quantity must be greater than 0.",
        );
        return;
      }

      const missingMakingRate = item.some(
        (i) =>
          toNum(i.itemQuantity) > 0 &&
          !String(i.makingRate ?? "").trim(),
      );

      if (missingMakingRate) {
        toast.error("Enter making rate for all items.");
        return;
      }

      {
        const ratePerDesign = form.getValues("totalRate");
        const details = orderDesignDetailsData as DesignTableData & {
          Image?: string;
        };
        const selectedDesign = orderDesignData.find(
          (design) => design.Id === orderDesignId
        );
        const designName =
          String(
            form.getValues("designName") ||
              details?.Design_Name ||
              selectedDesign?.Design_Name ||
              ""
          ).trim();
        const designNo = String(
          form.getValues("designNo") ||
            details?.Design_No ||
            selectedDesign?.Design_No ||
            ""
        ).trim();
        const image = String(
          form.getValues("image") ||
            details?.Image ||
            details?.image ||
            ""
        ).trim();

        // Same design can be added multiple times (e.g. different item colours),
        // so each order line needs its own key to link its items and quantity.
        orderLineSeqRef.current += 1;
        const lineKey = `${orderDesignId}-${orderLineSeqRef.current}`;

        // Read before the fields are cleared below: state updaters run later,
        // so calling form.getValues inside them would see the reset values.
        const newOrderLine: OrderTableData = {
          lineKey,
          designId: orderDesignId,
          designName,
          designNo,
          orderQuantity: orderQty,
          designRate: ratePerDesign,
          totalRate: (Number(ratePerDesign) * Number(orderQty)).toFixed(2),
          wt: form.getValues("wt"),
          wtRate: form.getValues("wtRate"),
          polish: form.getValues("polish"),
          ghat: form.getValues("ghat"),
          image,
        };

        setOrderTableData((prev) => [...prev, newOrderLine]);
        setItemListData((prev) => [
          ...prev,
          ...item.map((row) => ({ ...row, lineKey })),
        ]);
        form.setValue("orderQuantity", "");
        form.setValue("item", []);
        form.setValue("designId", "");
        form.setValue("designName", "");
        form.setValue("designNo", "");
        form.setValue("wt", "");
        form.setValue("wtRate", "");
        form.setValue("polish", "");
        form.setValue("ghat", "");
        form.setValue("manualDesignRates", false);
        form.setValue("image", "");
        form.setValue("totalRate", "");
        setOrderDesignInput("");
        setOrderDesignId(null);
        setShowDesignDialog(false);
      }
    }
  };

  const handleDeleteOrderTableData = (lineKey: string) => {
    const newOrderTableData = orderTableData.filter(
      (data) => data.lineKey !== lineKey
    );
    setOrderTableData(newOrderTableData);

    const newItemListData = itemListData.filter(
      (data) => data.lineKey !== lineKey
    );
    setItemListData(newItemListData);
  };

  const findOrderLine = (itemData: { lineKey?: string; designId: string }) =>
    orderTableData.find((data) =>
      itemData.lineKey
        ? data.lineKey === itemData.lineKey
        : data.designId.toString() === itemData.designId.toString()
    );

  const buildOrderBookingBody = (
    item: OrderBookingFormData,
    orgId: number
  ): OrderBookingBody => {
    const itemDataList = itemListData
      .filter((itemData) => toNum(itemData.itemQuantity) > 0)
      .map((itemData) => ({
      design_id: itemData.designId,
      qnty: null,
      wt: null,
      wt_rate: null,
      tot_wt: null,
      polish_rate: null,
      tot_polish: null,
      ghat_rate: null,
      tot_ghat: null,
      qnty_rate: null,
      item_id: itemData.itemId,
      Item_Gl: itemData.itemGl,
      item_qnty:
        Number(itemData.itemQuantity) *
        Number(findOrderLine(itemData)?.orderQuantity),
      item_rate: itemData.itemRate,
      item_tot:
        Number(itemData.itemQuantity) *
        Number(itemData.itemRate) *
        Number(findOrderLine(itemData)?.orderQuantity),
      item_grand_tot:
        Number(itemData.itemTotal) *
        Number(findOrderLine(itemData)?.orderQuantity),
      making_rate: itemData.makingRate,
    }));

    const designDetails = orderTableData.map((data) => ({
      design_id: data.designId,
      qnty: data.orderQuantity,
      wt_rate: data.wtRate,
      wt: Number(data.wt) * Number(data.orderQuantity),
      tot_wt:
        Number(data.wt) * Number(data.wtRate) * Number(data.orderQuantity),
      polish_rate: data.polish,
      tot_polish: Number(data.polish) * Number(data.orderQuantity),
      ghat_rate: String(data.ghat ?? "").trim() || null,
      tot_ghat: String(data.ghat ?? "").trim()
        ? Number(data.ghat) * Number(data.orderQuantity)
        : null,
      qnty_rate: data.designRate,
      item_id: null,
      Item_Gl: null,
      item_qnty: null,
      item_rate: null,
      item_tot: null,
      item_grand_tot: null,
      making_rate: null,
    }));

    return {
      org_id: orgId,
      ord_date: format(item.orderDate, "yyyy-MM-dd"),
      party_id: item.partyId,
      is_own: item.itemType,
      year_id: finId,
      order_array: [...designDetails, ...itemDataList],
    };
  };

  const addOrderBookingApiCall = async (
    item: OrderBookingFormData,
    orgId: number
  ) => {
    setAddOrderBookingLoading(true);

    const data = buildOrderBookingBody(item, orgId);

    try {
      const res: ApiResponse = await addOrderBookingAPI(data);

      if (res.status === 200) {
        const orderIds = extractOrderIds(res.data.details);
        resetOrderForm();
        setCurrentPage(1);
        setSelected("table");
        setOrderTableInput("");
        getOrderBookingApiCall(orgId, 1, "", perPage);
        setSuccessMessage(
          String(res.data.message || "Order booked successfully").trim(),
        );
        setSuccessOrderIds(orderIds);
        setShowSuccessDialog(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddOrderBookingLoading(false);
    }
  };

  const updateOrderBookingApiCall = async (
    item: OrderBookingFormData,
    orgId: number,
    orderId: number
  ) => {
    setUpdateOrderBookingLoading(true);

    const data = { ...buildOrderBookingBody(item, orgId), order_id: orderId };

    try {
      const res: ApiResponse = await updateOrderBookingAPI(data);

      if (res.status === 200) {
        toast.success(
          String(res.data.message || "Order updated successfully").trim(),
        );
        setEditOrderId(null);
        setEditOrderNo("");
        resetOrderForm();
        setCurrentPage(1);
        setSelected("table");
        setOrderTableInput("");
        getOrderBookingApiCall(orgId, 1, "", perPage);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setUpdateOrderBookingLoading(false);
    }
  };

  const deleteOrderApiCall = async (orgIdValue: number, orderId: number) => {
    setDeleteOrderBookingLoading(true);

    const data = {
      org_id: orgIdValue,
      order_id: orderId,
    };

    try {
      const res: ApiResponse = await deleteOrderBookingAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        if (editOrderId === orderId) handleCancelEditOrder();
        setCurrentPage(1);
        setTempDeleteId(null);
        setOrderTableInput("");
        getOrderBookingApiCall(orgIdValue, 1, "", perPage);
        setShowDeleteDialog(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteOrderBookingLoading(false);
    }
  };

  const getOrderBookingApiCall = async (
    orgId: number,
    page: number,
    keyword: string,
    requestPerPage?: number
  ) => {
    setLoading(true);

    const pageSize = requestPerPage ?? perPage;

    try {
      const res: ApiResponse = await getOrderBookingAPI(
        orgId,
        page,
        keyword,
        pageSize,
        orderListFiltersRef.current,
      );

      if (res.status === 200) {
        const details = res.data.details;
        const rows = Array.isArray(details)
          ? details
          : Array.isArray(details?.data)
            ? details.data
            : Array.isArray(details?.pagination?.data)
              ? details.pagination.data
              : [];

        dispatch(getOrderBookingData(rows));
        const apiLastPage = resolveListLastPage(details, pageSize);
        setLastPage(rows.length < pageSize ? page : apiLastPage);
      } else {
        dispatch(getOrderBookingData([]));
        setLastPage(1);
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getOrderBookingData([]));
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterOrderTable = (value: string) => {
    setOrderTableInput(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
      return;
    }
    runDebouncedSearch(() => {
      if (orgId) getOrderBookingApiCall(orgId, 1, value.trim(), perPage);
    });
  };

  const handleOrderFromDateChange = (value: Date | undefined) => {
    setOrderFromDate(value);
    setCurrentPage(1);
  };

  const handleOrderToDateChange = (value: Date | undefined) => {
    setOrderToDate(value);
    setCurrentPage(1);
  };

  const handleOrderPartyFilterChange = (value: string) => {
    setOrderPartyFilter(value);
    setCurrentPage(1);
  };

  const handleOrderItemTypeFilterChange = (value: string) => {
    setOrderItemTypeFilter(value);
    setCurrentPage(1);
  };

  const handleOrderStatusFilterChange = (value: string) => {
    setOrderStatusFilter(value);
    setCurrentPage(1);
  };

  const handleResetOrderFilters = () => {
    setOrderFromDate(undefined);
    setOrderToDate(undefined);
    setOrderPartyFilter("");
    setOrderItemTypeFilter("");
    setOrderStatusFilter("");
    setOrderTableInput("");
    orderListFiltersRef.current = {
      fromDate: "",
      toDate: "",
      partyId: "",
      itemType: "",
      orderStatus: "",
    };
    setCurrentPage(1);
    if (orgId) getOrderBookingApiCall(orgId, 1, "", perPage);
  };

  const readOrderPartyRows = (details: unknown): OrderPartyData[] => {
    if (Array.isArray(details)) return details as OrderPartyData[];
    if (details && typeof details === "object") {
      const data = (details as { data?: unknown }).data;
      if (Array.isArray(data)) return data as OrderPartyData[];
    }
    return [];
  };

  const getOrderPartyApiCall = async (
    orgId: number,
    page: number,
    keyword: string,
    partyId?: number | string
  ) => {
    setGetOrderPartyLoading(true);

    try {
      const loadEveryParty = page === 1 && !keyword && !partyId;

      if (loadEveryParty) {
        const parties = await loadAllParties(orgId);
        dispatch(getOrderPartyData(parties));
        setLastOrderPartyPage(1);
        return;
      }

      const res: ApiResponse = await getOrderPartyAPI(
        orgId,
        page,
        keyword,
        partyId
      );

      if (res.status === 200) {
        const batch = readOrderPartyRows(res.data.details);
        const newData = page === 1 ? batch : [...orderPartyData, ...batch];
        dispatch(getOrderPartyData(newData));
        setLastOrderPartyPage(res.data.details?.last_page);
      } else {
        dispatch(getOrderPartyData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getOrderPartyData([]));
    } finally {
      setGetOrderPartyLoading(false);
    }
  };

  const addPartyApiCall = async (item: PartyFormData, orgId: number) => {
    setAddPartyLoading(true);

    const data = {
      org_id: orgId,
      party_type: item.partyType,
      party_Name: item.partyName,
      party_add: item.address,
      party_mob: item.mobileNo,
      under_ledger: item.underLedger,
      open_balance: item.openingBalance,
      party_mail: item.email || "",
      party_gst: item.gstin || "",
    };

    try {
      const res: ApiResponse = await addPartyAPI(data);

      if (res.status === 200) {
        partyForm.reset();
        setIsOpen(false);
        getOrderPartyApiCall(orgId, 1, "", res.data.details)
          .then(() => {
            // Perform the subsequent tasks after the API call is successful
            const selectedPartyId = res.data.details?.toString();
            const selectedParty = orderPartyData.find(
              (party) => party.Id === selectedPartyId
            );

            form.setValue("partyId", selectedPartyId);
            form.setValue("address", selectedParty?.Party_Add || "");
            form.setValue("mobileNo", selectedParty?.Party_Mob || "");
            form.setValue("gstin", selectedParty?.Party_Gst || "");
          })
          .catch(() => {
            // Handle errors if the API call fails
            toast.error("Error fetching order party data");
          });
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
      console.log(orderPartyData);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddPartyLoading(false);
    }
  };

  const getOrderDesignApiCall = async (
    orgId: number,
    page: number,
    keyword: string
  ) => {
    setGetOrderDesignLoading(true);

    try {
      const res: ApiResponse = await getOrderDesignAPI(orgId, page, keyword);

      if (res.status === 200) {
        const newData =
          page === 1
            ? res.data.details?.data
            : [...orderDesignData, ...res.data.details?.data];
        dispatch(getOrderDesignData(newData));
        setLastOrderDesignPage(res.data.details?.last_page);
      } else {
        dispatch(getOrderDesignData([]));
        // toast.error(res.data.message || "No  data available");
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getOrderDesignData([]));
    } finally {
      setGetOrderDesignLoading(false);
    }
  };

  const fetchPartyMakingRates = async (
    orgIdValue: number,
    partyIdValue: string,
  ): Promise<PartyMakingRateSetup[]> => {
    if (!partyIdValue) return [];
    try {
      const res: ApiResponse = await getPartyMakingRateByPartyAPI(
        orgIdValue,
        partyIdValue,
      );
      if (res.status === 200 || res.status === 202) {
        return parsePartyMakingRateRows(res.data?.details);
      }
    } catch {
      // Keep rates empty if the party setup cannot be loaded.
    }
    return [];
  };

  const openDesignDetail = () => {
    const detail = orderDesignDetailsData as DesignTableData | DesignTableData[] | null;
    if (!detail || Array.isArray(detail) || !detail.Id) return null;
    return detail;
  };

  const designRateFallback = (detail?: DesignTableData | null) => ({
    wtRate: toRateString(detail?.Wt_Rate) || "",
    polish:
      detail?.Polish == null || String(detail.Polish).trim() === ""
        ? ""
        : toRateString(detail.Polish) || String(detail.Polish).trim(),
    ghat:
      detail?.Ghat == null || String(detail.Ghat).trim() === ""
        ? ""
        : String(detail.Ghat).trim(),
  });

  const applyPartyMakingRates = (
    setups: PartyMakingRateSetup[],
    detail?: DesignTableData | null,
  ) => {
    const rows = form.getValues("item") ?? [];
    const isPartyItem = form.getValues("itemType") === "0";
    const source = detail ?? openDesignDetail();
    const children = source?.childrow ?? [];

    rows.forEach((row, index) => {
      const setup = findPartyMakingRate(setups, row.modelId);
      const makingRateManual =
        !setup || !String(setup.makingRate ?? "").trim();
      const child = children.find(
        (item) => String(item.Item_Id) === String(row.itemId),
      );
      const makingRate = makingRateManual
        ? toRateString(child?.Making_Rate) || ""
        : setup?.makingRate ?? "";
      form.setValue(`item.${index}.makingRate`, makingRate, {
        shouldDirty: true,
      });
      form.setValue(`item.${index}.makingRateManual`, makingRateManual, {
        shouldDirty: false,
      });
      const nextTotal = computeItemLineTotal(
        { ...row, makingRate },
        isPartyItem,
      ).toFixed(2);
      form.setValue(`item.${index}.itemTotal`, nextTotal, {
        shouldDirty: false,
      });
    });

    const designSetup = findDesignPartyMakingRate(
      setups,
      rows.map((row) => row.modelId),
    );
    const manualDesignRates = !designSetup;
    const fallback = designRateFallback(source);
    form.setValue("manualDesignRates", manualDesignRates, {
      shouldDirty: false,
    });
    form.setValue(
      "wtRate",
      manualDesignRates ? fallback.wtRate : designSetup?.wtRate ?? "",
      { shouldDirty: true },
    );
    form.setValue(
      "polish",
      manualDesignRates ? fallback.polish : designSetup?.polish ?? "",
      { shouldDirty: true },
    );
    form.setValue(
      "ghat",
      manualDesignRates ? fallback.ghat : designSetup?.ghat ?? "",
      { shouldDirty: true },
    );
    // Item totals and design rate use the rates now on the form.
    syncDesignItemTotals();
  };

  const getDesignDetailsApiCall = async (orgId: number, designId: string) => {
    try {
      const selectedPartyId = String(form.getValues("partyId") ?? "").trim();
      const [res, partyMakingRates] = await Promise.all([
        getDesignDetailsAPI(orgId, designId),
        fetchPartyMakingRates(orgId, selectedPartyId),
      ]);

      if (res.status === 200) {
        const detail = res.data.details[0] as DesignTableData & {
          Image?: string;
          Design_Name?: string;
          Design_No?: string;
        };
        const selectedDesign = orderDesignData.find(
          (design) => design.Id.toString() === designId.toString()
        );
        const designName = String(
          detail?.Design_Name || selectedDesign?.Design_Name || ""
        ).trim();
        const designNo = String(
          detail?.Design_No || selectedDesign?.Design_No || ""
        ).trim();
        const image = String(detail?.Image || detail?.image || "").trim();

        dispatch(getOrderDesignDetailsData(detail));
        const designSetup = findDesignPartyMakingRate(
          partyMakingRates,
          (detail.childrow ?? []).map((child) => {
            const record = child as ChildRow & Record<string, unknown>;
            return (
              record.Model_Id ??
              record.model_id ??
              record.item_mod ??
              record.Mod_Id ??
              record.mod_id
            );
          }),
        );
        const manualDesignRates = !designSetup;
        const fallback = designRateFallback(detail);
        const partyWtRate = manualDesignRates
          ? fallback.wtRate
          : designSetup?.wtRate ?? "";
        const partyPolish = manualDesignRates
          ? fallback.polish
          : designSetup?.polish ?? "";
        const partyGhat = manualDesignRates
          ? fallback.ghat
          : designSetup?.ghat ?? "";

        form.setValue("designName", designName);
        form.setValue("designNo", designNo);
        form.setValue("wt", detail.WT);
        form.setValue("image", image);
        form.setValue("manualDesignRates", manualDesignRates);
        form.setValue("wtRate", partyWtRate);
        form.setValue("polish", partyPolish);
        form.setValue("ghat", partyGhat);
        form.setValue(
          "item",
          (detail.childrow ?? []).map((child: ChildRow) => {
            const isPartyItem = form.getValues("itemType") === "0";
            const quantity = child.Qnty ?? "";
            const itemRate = isPartyItem
              ? "0"
              : String(child.Item_Rate ?? "");
            const pickAttr = (...keys: (keyof ChildRow)[]) => {
              for (const key of keys) {
                const value = child[key];
                if (value == null || String(value).trim() === "") continue;
                return String(value);
              }
              return "";
            };
            const modelId = pickAttr(
              "Model_Id",
              "model_id",
              "item_mod",
              "Mod_Id" as keyof ChildRow,
              "mod_id" as keyof ChildRow,
            );
            const itemSetup = findPartyMakingRate(partyMakingRates, modelId);
            const makingRateManual =
              !itemSetup || !String(itemSetup.makingRate ?? "").trim();
            const makingRate = makingRateManual
              ? toRateString(child.Making_Rate) || ""
              : itemSetup?.makingRate ?? "";
            const itemTotal = computeItemLineTotal(
              {
                itemQuantity: quantity,
                itemRate,
                makingRate,
              },
              isPartyItem,
            ).toFixed(2);

            return {
              designId: String(detail.Id),
              itemId: String(child.Item_Id),
              itemName: child.Item_Name,
              itemGl: child.Item_GL ?? "",
              itemShName: child.Item_Sh_Name,
              itemQuantity: String(quantity),
              itemRate,
              makingRate,
              makingRateManual,
              itemTotal,
              catId: pickAttr("Cat_Id", "cat_id"),
              modelId,
              sizeId: pickAttr("Size_Id", "size_id", "item_size"),
              colorId: pickAttr("Color_Id", "color_id", "item_color"),
            };
          }),
        );
        setOrderDesignId(detail.Id);
        syncDesignItemTotals();
      } else {
        dispatch(getOrderDesignDetailsData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getOrderDesignDetailsData([]));
    }
  };

  useEffect(() => {
    if (token && orgId && partyType) {
      getPartyLedgerApiCall(orgId, partyType);
    }
    partyForm.setValue("underLedger", "");
  }, [token, orgId, partyType]);

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

  // If party changes while Design Details is open, refresh making rates.
  useEffect(() => {
    if (!orgId || !showDesignDialog || !partyId) return;
    const rows = form.getValues("item") ?? [];
    if (!rows.length) return;

    let cancelled = false;
    (async () => {
      const setups = await fetchPartyMakingRates(orgId, String(partyId));
      if (cancelled) return;
      applyPartyMakingRates(setups, openDesignDetail());
    })();

    return () => {
      cancelled = true;
    };
  }, [orgId, partyId, showDesignDialog]);

  useEffect(() => {
    const subscription = form.watch((_values, info) => {
      const name = info?.name;
      if (!name) return;

      // Avoid loops from our own writes.
      if (name === "totalRate" || name.endsWith(".itemTotal")) return;

      const shouldSync =
        name === "item" ||
        name.startsWith("item.") ||
        name === "wt" ||
        name === "wtRate" ||
        name === "polish" ||
        name === "itemType";

      if (shouldSync) {
        syncDesignItemTotals();
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  useResetFormOnModalClose(showDesignDialog, () => {
    form.setValue("designId", "");
    form.setValue("item", []);
    form.setValue("manualDesignRates", false);
    form.clearErrors("orderQuantity");
    setOrderDesignInput("");
  });

  return {
    getOrderBookingApiCall,
    getOrderPartyApiCall,
    getOrderDesignApiCall,
    getDesignDetailsApiCall,
    addOrderBookingLoading,
    updateOrderBookingLoading,
    editOrderId,
    editOrderNo,
    handleEditOrder,
    handleCancelEditOrder,
    deleteOrderBookingLoading,
    loading,
    form,
    handleSubmit,
    selected,
    setSelected,
    addPartyLoading,
    isOpen,
    setIsOpen,
    partyForm,
    handlePartySubmit,
    handleShowPartyForm,
    designId,
    showDesignDialog,
    setShowDesignDialog,
    handleAddDesign,
    orderTableData,
    itemListData,
    handleDeleteOrderTableData,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeleteOrder,
    showSuccessDialog,
    setShowSuccessDialog,
    successMessage,
    successOrderIds,
    handleCloseSuccessDialog,
    currentOrderPartyPage,
    setCurrentOrderPartyPage,
    lastOrderPartyPage,
    currentOrderDesignPage,
    setCurrentOrderDesignPage,
    lastOrderDesignPage,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    orderTableInput,
    handleFilterOrderTable,
    orderFromDate,
    orderToDate,
    orderFromDateApi,
    orderToDateApi,
    handleOrderFromDateChange,
    handleOrderToDateChange,
    orderPartyFilter,
    handleOrderPartyFilterChange,
    orderItemTypeFilter,
    handleOrderItemTypeFilterChange,
    orderStatusFilter,
    handleOrderStatusFilterChange,
    handleResetOrderFilters,
    orderPartyInput,
    setOrderPartyInput,
    orderDesignInput,
    setOrderDesignInput,
    getPartyLedgerLoading,
    getOrderPartyLoading,
    getOrderDesignLoading,
  };
};
