import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";
import { useDispatch, useSelector } from "react-redux";
import {
  SamplePrintFormData,
  SamplePrintTableData,
} from "@/types/inventoryVoucher/SamplePrintTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { ChildRow } from "@/types/master/DesignTypes";
import { uptoThreeDigitDecimalRegex } from "@/utils/validationRegex";
import { getOrderDesignDetailsData } from "../orderBooking/OrderBookingReducer";
import { getDesignDetailsAPI } from "../orderBooking/OrderBookingApis";
import {
  addSamplePrintAPI,
  deleteSamplePrintAPI,
  getSamplePrintAPI,
} from "./SamplePrintApis";
import { getSamplePrintData } from "./SamplePrintReducer";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";

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

const mapHistoryRow = (
  row: Record<string, any>,
  fallbackPrintData?: SamplePrintFormData
): SamplePrintTableData => {
  const designRow = row?.DesignRow?.[0] || {};
  const printDate = pickValue(
    row.Print_Date,
    row.Sample_Date,
    row.Ord_Date,
    row.Order_Date,
    fallbackPrintData?.printDate
      ? format(fallbackPrintData.printDate, "yyyy-MM-dd")
      : ""
  );

  return {
    Id: Number(pickValue(row.Id, row.id, Date.now())),
    Print_Date: String(printDate),
    Sample_No: String(
      pickValue(row.Sample_No, row.Print_No, row.Order_No, row.sample_no, "")
    ),
    Party_Name: String(pickValue(row.Party_Name, row.party_name, "")),
    Party_Id: String(pickValue(row.Party_Id, row.party_id, fallbackPrintData?.partyId, "")),
    Design_Name: String(
      pickValue(
        row.Design_Name,
        designRow.Design_Name,
        fallbackPrintData?.designName,
        ""
      )
    ),
    Design_No: String(
      pickValue(
        row.Design_No,
        designRow.Design_No,
        fallbackPrintData?.designNo,
        ""
      )
    ),
    Total: String(
      pickValue(row.Total_Amt, row.Total_Order, row.Total, fallbackPrintData?.totalRate, "")
    ),
    Item_Type: String(
      pickValue(row.Is_Own, row.is_own, fallbackPrintData?.itemType, "")
    ),
    Address: String(
      pickValue(row.Party_Add, row.party_add, fallbackPrintData?.address, "")
    ),
    Mobile: String(
      pickValue(row.Party_Mob, row.party_mob, fallbackPrintData?.mobileNo, "")
    ),
    Gstin: String(
      pickValue(row.Party_Gst, row.party_gst, fallbackPrintData?.gstin, "")
    ),
    Image: String(
      pickValue(row.Image, designRow.Image, fallbackPrintData?.image, "")
    ),
    Wt: String(pickValue(row.Wt, designRow.Wt, fallbackPrintData?.wt, "")),
    Wt_Rate: String(
      pickValue(row.Wt_Rate, designRow.Wt_Rate, fallbackPrintData?.wtRate, "")
    ),
    Polish: String(
      pickValue(row.Polish, designRow.Polish, fallbackPrintData?.polish, "")
    ),
    printData: fallbackPrintData,
    DesignRow: row.DesignRow,
  };
};

const mapRowToPrintData = (row: SamplePrintTableData): SamplePrintFormData => {
  if (row.printData) return row.printData;

  const designRow = row.DesignRow?.[0];
  const printDateValue = row.Print_Date ? new Date(row.Print_Date) : new Date();

  return {
    printDate: Number.isNaN(printDateValue.getTime())
      ? new Date()
      : printDateValue,
    partyId: row.Party_Id || "",
    address: row.Address || "",
    mobileNo: row.Mobile || "",
    gstin: row.Gstin || "",
    designId: designRow?.Design_Id ? String(designRow.Design_Id) : "",
    designName: row.Design_Name || designRow?.Design_Name || "",
    designNo: row.Design_No || designRow?.Design_No || "",
    wt: row.Wt || designRow?.Wt || "",
    wtRate: row.Wt_Rate || designRow?.Wt_Rate || "",
    polish: row.Polish || designRow?.Polish || "",
    image: row.Image || designRow?.Image || "",
    itemType: row.Item_Type || "1",
    item:
      designRow?.ItemRow?.map((item) => ({
        designId: designRow.Design_Id ? String(designRow.Design_Id) : "",
        itemId: String(item.Item_Id ?? ""),
        itemGl: String(item.Item_GL ?? ""),
        itemName: item.Item_Name || "",
        itemShName: item.Item_Sh_Name || "",
        itemQuantity: item.Item_Qnty || "",
        itemRate: item.Item_Rate || "",
        makingRate: item.Making_Rate || "",
        itemTotal: item.Item_Tot || "",
      })) || [],
    totalRate: row.Total || "",
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

  const [orderPartyInput, setOrderPartyInput] = useState("");
  const [orderDesignInput, setOrderDesignInput] = useState("");

  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [printData, setPrintData] = useState<SamplePrintFormData | null>(null);

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
              return uptoThreeDigitDecimalRegex.test(value);
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

  const handleShowPrintFromHistory = (row: SamplePrintTableData) => {
    setPrintData(mapRowToPrintData(row));
    setShowPrintDialog(true);
  };

  const handleAddDesign = () => {
    const item = form.getValues("item");

    const allHaveMakingRate = item.every(
      (i) => i.makingRate && i.makingRate.trim() !== ""
    );

    if (allHaveMakingRate) {
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
        setPrintData(values);
        setShowPrintDialog(true);
        resetSampleForm();
        setCurrentPage(1);
        getSamplePrintApiCall(orgId, 1, "");
        toast.success(res.data.message || "Sample print saved");
      } else {
        toast.error(res.data.message || "Unable to save sample print");
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
        toast.success(res.data.message);
        setCurrentPage(1);
        getSamplePrintApiCall(orgId, 1, "");
        setShowDeleteDialog(false);
        setTempDeleteId(null);
      } else {
        toast.error(res.data.message);
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
    keyword: string
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
        dispatch(
          getSamplePrintData(
            list.map((row: Record<string, any>) => mapHistoryRow(row))
          )
        );
        setLastPage(res.data.details?.pagination?.last_page || 1);
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
    currentPage,
    setCurrentPage,
    lastPage,
  };
};
