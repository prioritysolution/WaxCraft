import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch, useSelector } from "react-redux";
import {
  GstBillFormData,
  InvoiceData,
  ItemTableData,
} from "@/types/inventoryVoucher/GstBillTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { addGstBillAPI, deleteGstBillAPI, getGstBillAPI } from "./GstBillApis";
import { getGstBillData } from "./GstBillReducer";

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

  const [selected, setSelected] = useState("form");

  const [itemTableData, setItemTableData] = useState<ItemTableData[]>([]);
  const [itemGrandTotal, setItemGrandTotal] = useState("");
  const [itemGst, setItemGst] = useState("");
  const [itemRoundOff, setItemRoundOff] = useState("");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);

  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

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
    if (orgId && tempDeleteId) deleteGstApiCall(orgId, tempDeleteId);
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

  const deleteGstApiCall = async (gstId: number, orgId: number) => {
    setDeleteGstBillLoading(true);

    const data = {
      org_id: orgId,
      gst_id: gstId,
    };

    try {
      const res: ApiResponse = await deleteGstBillAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        setCurrentPage(1);
        getGstBillApiCall(orgId, currentPage, "");
        setShowDeleteDialog(false);
      } else {
        toast.error(res.data.message);
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
      const res: ApiResponse = await getGstBillAPI(orgId, page, keyword);

      if (res.status === 200) {
        dispatch(getGstBillData(res.data.details?.data));
        setLastPage(res.data.details?.pagination?.last_page);
      } else {
        dispatch(getGstBillData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getGstBillData([]));
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
    currentPage,
    setCurrentPage,
    lastPage,
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
