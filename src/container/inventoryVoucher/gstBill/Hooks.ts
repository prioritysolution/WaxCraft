import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useListPerPage } from "@/lib/useListPerPage";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch, useSelector } from "react-redux";
import {
  GstBillFormData,
  GstBillTableData,
  InvoiceData,
  ItemTableData,
} from "@/types/inventoryVoucher/GstBillTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { addGstBillAPI, deleteGstBillAPI, getGstBillAPI, getGstBillPrintAPI } from "./GstBillApis";
import { getGstBillData } from "./GstBillReducer";
import { getInvoicePrintDataAPI } from "../salesVoucher/SalesVoucherApis";

import {
  uptoThreeDigitDecimalRegex,
  decimalRegex,
} from "@/utils/validationRegex";
import { format } from "date-fns";

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

interface OrderBookingState {
  orderPartyData: OrderPartyData[];
}

interface RootState {
  orderBooking: OrderBookingState;
}

export const useGstBill = () => {
  const dispatch = useDispatch();

  const [addGstBillLoading, setAddGstBillLoading] = useState(false);
  const [deleteGstBillLoading, setDeleteGstBillLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<number | null>(null);
  const [finId, setFinId] = useState<number | null>(null);

  const [orderPartyInput, setOrderPartyInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { perPage, handlePerPageChange } = useListPerPage(() =>
    setCurrentPage(1),
  );

  const [selected, setSelected] = useState("form");

  const [itemTableData, setItemTableData] = useState<ItemTableData[]>([]);
  const [itemGrandTotal, setItemGrandTotal] = useState("");
  const [itemGst, setItemGst] = useState("");
  const [itemRoundOff, setItemRoundOff] = useState("");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);

  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [printLoading, setPrintLoading] = useState(false);

  const orderPartyData: OrderPartyData[] = useSelector(
    (state: RootState) => state?.orderBooking?.orderPartyData
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
      setFinId(getCookieData<number | null>("waxCraftClientFinId"));
      setToken(getCookieData<string | null>("waxCraftClientToken"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    date: yup.date().required("Date is required"),
    billNo: yup.string().required("Bill No. is required"),
    partyId: yup.string().required("Party is required"),
    address: yup.string().default(""),
    mobileNo: yup.string().default(""),
    gstin: yup.string().default(""),
    gstRate: yup
      .string()
      .required("GST rate is required")
      .test("is-valid-number", "Invalid GST", (value) => {
        if (!value) return false;
        return decimalRegex.test(value);
      }),
    itemName: yup.string().required("Item name is required"),
    itemUnit: yup.string().required("Item unit is required"),
    itemQuantity: yup.string().required("Item quantity is required"),
    itemRate: yup
      .string()
      .required("Item rate is required")
      .test("is-valid-number", "Invalid rate", (value) => {
        if (!value) return false;
        return uptoThreeDigitDecimalRegex.test(value);
      }),
    itemHsn: yup.string().required("Item HSN is required"),
    discount: yup.string().default(""),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<GstBillFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      date: undefined,
      partyId: "",
      address: "",
      mobileNo: "",
      gstin: "",
      itemName: "",
      itemUnit: "",
      itemQuantity: "",
      itemRate: "",
      itemHsn: "",
      discount: "",
    },
  });

  const { partyId } = form.watch();

  // Handle form submission
  const handleSubmit: SubmitHandler<GstBillFormData> = (values) => {
    setItemTableData((prev) => [
      ...prev,
      {
        ...values,
        itemTotal: (
          (values.itemQuantity ? Number(values.itemQuantity) : 0) *
          (values.itemRate ? Number(values.itemRate) : 0)
        ).toString(),
      },
    ]);
    form.reset({
      date: values.date,
      billNo: values.billNo,
      gstRate: values.gstRate,
      partyId: values.partyId,
      address: values.address,
      mobileNo: values.mobileNo,
      gstin: values.gstin,
      itemName: "",
      itemUnit: "",
      itemQuantity: "",
      itemRate: "",
      itemHsn: "",
    });
  };

  const handleShowDeleteDialog = (id: number) => {
    setShowDeleteDialog(true);
    setTempDeleteId(id);
  };

  const handleDeleteGst = () => {
    if (orgId && tempDeleteId) {
      deleteGstApiCall(orgId, tempDeleteId);
    }
  };

  const resolveGstInvoicePayload = (
    details: unknown,
    fallback?: GstBillTableData
  ): InvoiceData | null => {
    const record = Array.isArray(details)
      ? details[0]
      : details &&
          typeof details === "object" &&
          Array.isArray((details as { data?: unknown }).data)
        ? (details as { data: unknown[] }).data[0]
        : details;

    if (!record || typeof record !== "object") {
      if (!fallback) return null;
      return {
        Sales_Id: fallback.Id as InvoiceData["Sales_Id"],
        Sales_Date: String(fallback.Sales_Date || fallback.Bill_Date || ""),
        Sales_No: String(fallback.Sales_No || fallback.Bill_No || ""),
        Party_Name: String(fallback.Party_Name || ""),
        Gross_Amt: Number(fallback.Gross_Amt || 0),
        Cgst_Rate: 0,
        Cgst_Amt: Number(fallback.Cgst_Amt || 0),
        Sgst_Rate: 0,
        Sgst_Amt: Number(fallback.Sgst_Amt || 0),
        Igst_Amt: Number(fallback.Igst_Amt || 0),
        Round_Amt: Number(fallback.Round_Amt || 0),
        Discount: Number(fallback.Discount || 0),
        ItemData: [],
      };
    }

    const row = record as Record<string, unknown>;
    const itemSource =
      (Array.isArray(row.ItemData) && row.ItemData) ||
      (Array.isArray(row.ItemRow) && row.ItemRow) ||
      (Array.isArray(row.invoise_data) && row.invoise_data) ||
      [];

    return {
      Sales_Id: Number(
        row.Sales_Id ?? row.Id ?? fallback?.Id ?? 0
      ) as InvoiceData["Sales_Id"],
      Sales_Date: String(
        row.Sales_Date ??
          row.Bill_Date ??
          fallback?.Sales_Date ??
          fallback?.Bill_Date ??
          ""
      ),
      Sales_No: String(
        row.Sales_No ?? row.Bill_No ?? fallback?.Sales_No ?? fallback?.Bill_No ?? ""
      ),
      Party_Name: String(
        row.Party_Name ?? fallback?.Party_Name ?? ""
      ),
      Gross_Amt: Number(row.Gross_Amt ?? fallback?.Gross_Amt ?? 0),
      Cgst_Rate: Number(row.Cgst_Rate ?? 0),
      Cgst_Amt: Number(row.Cgst_Amt ?? fallback?.Cgst_Amt ?? 0),
      Sgst_Rate: Number(row.Sgst_Rate ?? 0),
      Sgst_Amt: Number(row.Sgst_Amt ?? fallback?.Sgst_Amt ?? 0),
      Igst_Amt: Number(row.Igst_Amt ?? fallback?.Igst_Amt ?? 0),
      Round_Amt: Number(row.Round_Amt ?? fallback?.Round_Amt ?? 0),
      Discount: Number(row.Discount ?? fallback?.Discount ?? 0),
      ItemData: (itemSource as Record<string, unknown>[]).map((item) => ({
        Item_Name: String(item.Item_Name ?? item.item_name ?? ""),
        Item_Qnty: Number(item.Item_Qnty ?? item.item_qnty ?? 0),
        Item_Unit: String(item.Item_Unit ?? item.item_unit ?? ""),
        Item_Rate: Number(item.Item_Rate ?? item.item_rate ?? 0),
        Item_Hsn: Number(item.Item_Hsn ?? item.item_hsn ?? 0),
        Item_Tot: Number(item.Item_Tot ?? item.item_tot ?? 0),
      })),
    };
  };

  const handleShowPrint = async (row: GstBillTableData) => {
    if (!orgId) {
      toast.error("Something went wrong");
      return;
    }

    const salesId = Number(row.Sales_Id ?? row.Id);
    if (!salesId) {
      toast.error("GST bill not found");
      return;
    }

    setPrintLoading(true);
    try {
      let res: ApiResponse = await getGstBillPrintAPI(orgId, salesId);

      // Some backends reuse the sales invoice print endpoint for GST bills.
      if (res.status !== 200) {
        res = await getInvoicePrintDataAPI(orgId, salesId);
      }

      if (res.status === 200) {
        const payload = resolveGstInvoicePayload(res.data.details, row);
        if (!payload) {
          toast.error("Unable to load print data");
          return;
        }
        setInvoiceData(payload);
        setShowInvoice(true);
      } else {
        const payload = resolveGstInvoicePayload(null, row);
        if (payload) {
          setInvoiceData(payload);
          setShowInvoice(true);
        } else {
          toast.error(res.data.message || "Unable to load print data");
        }
      }
    } catch {
      const payload = resolveGstInvoicePayload(null, row);
      if (payload) {
        setInvoiceData(payload);
        setShowInvoice(true);
      } else {
        toast.error("Unable to load print data");
      }
    } finally {
      setPrintLoading(false);
    }
  };

  const handleDeleteItemTableData = (id: number) => {
    const newItemTableData = itemTableData.filter((_, index) => index !== id);
    setItemTableData(newItemTableData);
  };

  const handleAddGstBill = () => {
    if (orgId) {
      if (itemTableData.length > 0) addGstBillApiCall();
      else toast.error("Add atleast one item in table");
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const addGstBillApiCall = async () => {
    setAddGstBillLoading(true);

    const itemData = itemTableData.map((item) => ({
      item_name: item.itemName,
      item_qnty: item.itemQuantity,
      item_unit: item.itemUnit,
      item_hsn: item.itemHsn,
      item_rate: item.itemRate,
      item_tot: item.itemTotal,
    }));

    const data = {
      org_id: orgId,
      year_id: finId,
      trans_date: form.getValues("date")
        ? format(form.getValues("date"), "yyyy-MM-dd")
        : "",
      bill_no: form.getValues("billNo") || "",
      party_id: form.getValues("partyId") || "",
      tot_amt: itemGrandTotal,
      gst_rate: form.getValues("gstRate"),
      cgst_amt: itemGst,
      sgst_amt: itemGst,
      igst_amt: "0",
      round_amt: itemRoundOff || "0",
      disc_amt: form.getValues("discount") || "0",
      invoise_data: itemData,
    };

    try {
      const res: ApiResponse = await addGstBillAPI(data);

      if (res.status === 200) {
        form.reset({
          date: undefined,
          partyId: "",
          billNo: "",
          gstRate: "",
          address: "",
          mobileNo: "",
          gstin: "",
          itemName: "",
          itemUnit: "",
          itemQuantity: "",
          itemRate: "",
          itemHsn: "",
          discount: "",
        });
        setOrderPartyInput("");
        setItemTableData([]);
        setShowInvoice(true);
        setInvoiceData(res.data.details[0]);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddGstBillLoading(false);
    }
  };

  const deleteGstApiCall = async (orgId: number, salesId: number) => {
    setDeleteGstBillLoading(true);

    const data = {
      org_id: orgId,
      sales_id: salesId,
    };

    try {
      const res: ApiResponse = await deleteGstBillAPI(data);
      const message = String(res.data?.message ?? "");
      const failed =
        res.status >= 400 ||
        /not found|already cancel|required/i.test(message);

      if ((res.status === 200 || res.status === 202) && !failed) {
        toast.success(message || "GST bill cancelled");
        setShowDeleteDialog(false);
        setTempDeleteId(null);
        setCurrentPage(1);
        getGstBillApiCall(orgId, 1, "");
      } else {
        toast.error(message || "Unable to cancel GST bill");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteGstBillLoading(false);
    }
  };

  const getGstBillApiCall = async (
    orgId: number,
    page: number,
    keyword: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getGstBillAPI(
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
        const normalized = rows.map((row: Record<string, unknown>) => {
          // Prefer Sales_Id — CancelGstBill / print APIs key off sales_id, not list row Id.
          const salesId = Number(
            row.Sales_Id ??
              row.sales_id ??
              row.Gst_Id ??
              row.gst_id ??
              row.Id ??
              0
          );
          return {
            ...row,
            Id: salesId,
            Sales_Id: salesId,
          };
        });
        dispatch(getGstBillData(normalized));
        setLastPage(
          Number(details?.pagination?.last_page) > 0
            ? Number(details.pagination.last_page)
            : Number(details?.last_page) > 0
              ? Number(details.last_page)
              : 1,
        );
      } else {
        dispatch(getGstBillData([]));
        setLastPage(1);
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getGstBillData([]));
      setLastPage(1);
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
    if (itemTableData.length > 0) {
      const grandTotal = itemTableData.reduce(
        (sum, item) => sum + parseFloat(item.itemTotal),
        0
      );
      const gst = (grandTotal * (Number(form.getValues("gstRate")) || 0)) / 200;
      const roundOff =
        Number(((grandTotal + Number(gst.toFixed(2)) * 2) % 1).toFixed(2)) > 0.5
          ? 1 -
            Number(((grandTotal + Number(gst.toFixed(2)) * 2) % 1).toFixed(2))
          : Number(((grandTotal + Number(gst.toFixed(2)) * 2) % 1).toFixed(2)) *
            -1;
      setItemRoundOff(roundOff.toFixed(2));
      setItemGrandTotal(grandTotal.toFixed(2));
      setItemGst(gst.toFixed(2));
    } else {
      setItemGrandTotal("");
      setItemGst("");
    }
  }, [itemTableData]);

  return {
    getGstBillApiCall,
    addGstBillLoading,
    deleteGstBillLoading,
    loading,
    form,
    handleSubmit,
    selected,
    setSelected,
    itemTableData,
    handleDeleteItemTableData,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeleteGst,
    handleShowPrint,
    printLoading,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    itemGrandTotal,
    itemGst,
    itemRoundOff,
    handleAddGstBill,
    showInvoice,
    setShowInvoice,
    invoiceData,
    setInvoiceData,
    orderPartyInput,
    setOrderPartyInput,
  };
};
