import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useListPerPage } from "@/lib/useListPerPage";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";
import getCookieData from "@/utils/getCookieData";
import { useDispatch, useSelector } from "react-redux";
import {
  OrderBookingFormData,
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

export const useOrderBooking = () => {
  const dispatch = useDispatch();

  const [addOrderBookingLoading, setAddOrderBookingLoading] = useState(false);
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

  const [selected, setSelected] = useState("form");

  const [showDesignDialog, setShowDesignDialog] = useState(false);

  const [orderDesignId, setOrderDesignId] = useState<number | null>(null);

  const [orderTableData, setOrderTableData] = useState<OrderTableData[]>([]);

  const [itemListData, setItemListData] = useState<
    {
      designId: string;
      itemId: string;
      itemName: string;
      itemGl: string;
      itemShName?: string;
      itemQuantity: string;
      itemRate: string;
      makingRate: string;
      itemTotal: string;
    }[]
  >([]);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);

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
      addOrderBookingApiCall(values, orgId);
    } else {
      toast.error("Somthing went wrong");
    }
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

      const allHaveMakingRate = item.every(
        (i) => i.makingRate && i.makingRate.trim() !== ""
      );

      if (allHaveMakingRate) {
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

        setOrderTableData((prev) => [
          ...prev,
          {
            designId: orderDesignId,
            designName,
            designNo,
            orderQuantity: orderQty,
            designRate: ratePerDesign,
            totalRate: (
              Number(ratePerDesign) * Number(orderQty)
            ).toFixed(2),
            wt: form.getValues("wt"),
            wtRate: form.getValues("wtRate"),
            polish: form.getValues("polish"),
            image,
          },
        ]);
        setItemListData((prev) => [...prev, ...item]);
        form.setValue("orderQuantity", "");
        form.setValue("item", []);
        form.setValue("designId", "");
        form.setValue("designName", "");
        form.setValue("designNo", "");
        form.setValue("wt", "");
        form.setValue("wtRate", "");
        form.setValue("polish", "");
        form.setValue("image", "");
        form.setValue("totalRate", "");
        setOrderDesignInput("");
        setOrderDesignId(null);
        setShowDesignDialog(false);
      } else {
        toast.error("Add making rate to all item.");
      }
    }
  };

  const handleDeleteOrderTableData = (Id: number) => {
    const newOrderTableData = orderTableData.filter(
      (data) => data.designId !== Id
    );
    setOrderTableData(newOrderTableData);

    const newItemListData = itemListData.filter(
      (data) => data.designId === Id.toString()
    );
    setItemListData(newItemListData);
  };

  const addOrderBookingApiCall = async (
    item: OrderBookingFormData,
    orgId: number
  ) => {
    setAddOrderBookingLoading(true);

    const itemDataList = itemListData.map((itemData) => ({
      design_id: itemData.designId,
      qnty: null,
      wt: null,
      wt_rate: null,
      tot_wt: null,
      polish_rate: null,
      tot_polish: null,
      qnty_rate: null,
      item_id: itemData.itemId,
      Item_Gl: itemData.itemGl,
      item_qnty:
        Number(itemData.itemQuantity) *
        Number(
          orderTableData.find(
            (data) => data.designId.toString() === itemData.designId.toString()
          )?.orderQuantity
        ),
      item_rate: itemData.itemRate,
      item_tot:
        Number(itemData.itemQuantity) *
        Number(itemData.itemRate) *
        Number(
          orderTableData.find(
            (data) => data.designId.toString() === itemData.designId.toString()
          )?.orderQuantity
        ),
      item_grand_tot:
        Number(itemData.itemTotal) *
        Number(
          orderTableData.find(
            (data) => data.designId.toString() === itemData.designId.toString()
          )?.orderQuantity
        ),
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
      qnty_rate: data.designRate,
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
      ord_date: format(item.orderDate, "yyyy-MM-dd"),
      party_id: item.partyId,
      is_own: item.itemType,
      year_id: finId,
      order_array: [...designDetails, ...itemDataList],
    };

    try {
      const res: ApiResponse = await addOrderBookingAPI(data);

      if (res.status === 200) {
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
        setCurrentPage(1);
        setSelected("table");
        getOrderBookingApiCall(orgId, 1, "", perPage);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddOrderBookingLoading(false);
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
        setCurrentPage(1);
        setTempDeleteId(null);
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
        pageSize
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
        setLastPage(resolveListLastPage(details, pageSize));
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

  const getOrderPartyApiCall = async (
    orgId: number,
    page: number,
    keyword: string,
    partyId?: number | string
  ) => {
    setGetOrderPartyLoading(true);

    try {
      const res: ApiResponse = await getOrderPartyAPI(
        orgId,
        page,
        keyword,
        partyId
      );

      if (res.status === 200) {
        const newData =
          page === 1
            ? res.data.details?.data
            : [...orderPartyData, ...res.data.details?.data];
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

  const getDesignDetailsApiCall = async (orgId: number, designId: string) => {
    try {
      const res: ApiResponse = await getDesignDetailsAPI(orgId, designId);

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
        form.setValue("designName", designName);
        form.setValue("designNo", designNo);
        form.setValue("wt", detail.WT);
        form.setValue("wtRate", detail.Wt_Rate || "");
        form.setValue("polish", detail.Polish);
        form.setValue("image", image);
        form.setValue(
          "item",
          (detail.childrow ?? []).map((child: ChildRow) => {
            const isPartyItem = form.getValues("itemType") === "0";
            const quantity = child.Qnty ?? "";
            const itemRate = isPartyItem
              ? "0"
              : String(child.Item_Rate ?? "");
            const makingRate = "";
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
              itemTotal,
            };
          }),
        );
        setOrderDesignId(detail.Id);
        // Ensure Total Rate includes WT/Polish after items load.
        queueMicrotask(() => syncDesignItemTotals());
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
    form.clearErrors("orderQuantity");
    setOrderDesignInput("");
  });

  return {
    getOrderBookingApiCall,
    getOrderPartyApiCall,
    getOrderDesignApiCall,
    getDesignDetailsApiCall,
    addOrderBookingLoading,
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
    handleDeleteOrderTableData,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeleteOrder,
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
    orderPartyInput,
    setOrderPartyInput,
    orderDesignInput,
    setOrderDesignInput,
    getPartyLedgerLoading,
    getOrderPartyLoading,
    getOrderDesignLoading,
  };
};
