import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
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
import { ChildRow } from "@/types/master/DesignTypes";
import { format } from "date-fns";
import { uptoThreeDigitDecimalRegex } from "@/utils/validationRegex";

interface OrderPartyData {
  Id: number;
  Party_Name: string;
  Party_Add: string;
  Party_Mob: string;
  Party_Gst: string;
}

interface OrderPartyData {
  Id: number;
  Party_Name: string;
}

interface OrderDesignData {
  Id: number;
  Design_Name: string;
}

interface OrderBookingState {
  orderPartyData: OrderPartyData[];
  orderDesignData: OrderDesignData[];
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
              return uptoThreeDigitDecimalRegex.test(value);
            }),
          makingRate: yup.string().default(""),
          itemTotal: yup.string().default(""),
        })
      )
      .required("Item is required"),
    totalRate: yup.string().default(""),
    orderQuantity: yup.string().default(""),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<OrderBookingFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      orderDate: undefined,
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

  const { partyId, designId, wt, wtRate, polish } = form.watch();

  const item = useWatch({
    control: form.control,
    name: "item", // Path to the array of objects
  });

  const calculateTotal = (index: number) => {
    const rate = item[index]?.itemRate || 0;
    const makingRate = item[index]?.makingRate || 0;
    const quantity = item[index]?.itemQuantity || 0;
    return (
      Number(rate) * Number(quantity) + Number(makingRate) * Number(quantity)
    );
  };

  // Handle form submission
  const handleSubmit: SubmitHandler<OrderBookingFormData> = (values) => {
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
    if (orgId && tempDeleteId) deleteOrderApiCall(orgId, tempDeleteId);
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
      const item = form.getValues("item");

      const allHaveMakingRate = item.every(
        (i) => i.makingRate && i.makingRate.trim() !== ""
      );

      if (allHaveMakingRate) {
        const ratePerDesign = form.getValues("totalRate");
        const orderQty = form.getValues("orderQuantity");

        setOrderTableData((prev) => [
          ...prev,
          {
            designId: orderDesignId,
            designName: form.getValues("designName"),
            designNo: form.getValues("designNo"),
            orderQuantity: orderQty,
            designRate: ratePerDesign,
            totalRate:
              (
                Number(ratePerDesign) *
                Number(orderQty)
              )?.toString() || "",
            wt: form.getValues("wt"),
            wtRate: form.getValues("wtRate"),
            polish: form.getValues("polish"),
            image: form.getValues("image"),
          },
        ]);
        setItemListData((prev) => [...prev, ...item]);
        form.setValue("orderQuantity", "");
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
        form.reset();
        setOrderPartyInput("");
        setOrderDesignInput("");
        setOrderTableData([]);
        setItemListData([]);
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

  const deleteOrderApiCall = async (orderId: number, orgId: number) => {
    setDeleteOrderBookingLoading(true);

    const data = {
      org_id: orgId,
      order_id: orderId,
    };

    try {
      const res: ApiResponse = await deleteOrderBookingAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        setCurrentPage(1);
        getOrderBookingApiCall(orgId, 1, "");
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
    keyword: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getOrderBookingAPI(orgId, page, keyword);

      if (res.status === 200) {
        dispatch(getOrderBookingData(res.data.details?.data));
        setLastPage(res.data.details?.pagination?.last_page);
      } else {
        dispatch(getOrderBookingData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getOrderBookingData([]));
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
    setLoading(true);

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
          res.data.details[0].childrow.map((child: ChildRow) => ({
            designId: res.data.details[0].Id,
            itemId: child.Item_Id,
            itemName: child.Item_Name,
            itemGl: child.Item_GL,
            itemShName: child.Item_Sh_Name,
            itemQuantity: child.Qnty,
            itemRate: child.Item_Rate,
            itemTotal: child.Item_Total,
          }))
        );
        setOrderDesignId(res.data.details[0].Id);
      } else {
        dispatch(getOrderDesignDetailsData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getOrderDesignDetailsData([]));
    } finally {
      setLoading(false);
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
    if (item) {
      item.forEach((_, index) => {
        const total = calculateTotal(index);

        // Only update if the total has changed
        const currentTotal = item[index]?.itemTotal;
        if (currentTotal !== total.toFixed(2)) {
          form.setValue(`item.${index}.itemTotal`, total.toFixed(2));
        }
      });
    }
  }, [item, form]); // Only trigger when 'item' or 'form' changes

  useEffect(() => {
    if (item) {
      let totalRate =
        item.reduce((acc, item) => {
          const rate = item.itemTotal ? parseFloat(item.itemTotal) : 0; // Convert string to number, default to 0 if invalid
          return acc + rate;
        }, 0) +
        (Number(wt) || 0) * (Number(wtRate) || 0) +
        (Number(polish) || 0);
      form.setValue("totalRate", totalRate.toString());
    }
  }, [item, polish, wt, , wtRate, form]); // Only trigger when 'item' or 'form' changes

  useResetFormOnModalClose(showDesignDialog, () => {
    form.setValue("designId", "");
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
    orderPartyInput,
    setOrderPartyInput,
    orderDesignInput,
    setOrderDesignInput,
    getPartyLedgerLoading,
    getOrderPartyLoading,
    getOrderDesignLoading,
  };
};
