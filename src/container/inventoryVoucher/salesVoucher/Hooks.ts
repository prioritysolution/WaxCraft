import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useListPerPage } from "@/lib/useListPerPage";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch, useSelector } from "react-redux";
import {
  SalesVoucherFormData,
  SalesVoucherTableData,
} from "@/types/inventoryVoucher/SalesVoucherTypes";
import { ApiResponse } from "@/types/ApiTypes";
import {
  getDate,
  getGstAmount,
  getGstChoice,
  getInvoiceListData,
  getInvoicePrintData,
  getPartyId,
  getSalesVoucherData,
  getSalesVoucherProcessData,
} from "../salesVoucher/SalesVoucherReducer";
import {
  addSalesVoucherAPI,
  deleteInvoiceDataAPI,
  getInvoiceListDataAPI,
  getInvoicePrintDataAPI,
  getSalesVoucherAPI,
} from "./SalesVoucherApis";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface SalesVoucherState {
  salesVoucherProcessData: SalesVoucherTableData[];
  salesVoucherData: SalesVoucherTableData[];
  partyId: string;
  date: string;
  gstChoice: string;
  gstAmount: string;
}

interface RootState {
  salesVoucher: SalesVoucherState;
}

export const useSalesVoucher = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [addSalesVoucherLoading, setAddSalesVoucherLoading] = useState(false);
  const [deleteInvoiceLoading, setDeleteInvoiceLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);
  const [finId, setFinId] = useState<number | null>(null);

  const [orderPartyInput, setOrderPartyInput] = useState("");

  const [tabSelected, setTabSelected] = useState("form");

  // const [isSelected, setIsSelected] = useState(false);
  const [parentSelected, setParentSelected] = useState(false);

  const [totalOrderAmount, setTotalOrderAmount] = useState(0);

  const [selected, setSelected] = useState<SalesVoucherTableData[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { perPage, handlePerPageChange } = useListPerPage(() =>
    setCurrentPage(1),
  );

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);

  const [value, setValue] = useState("");

  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);

  const postPartyId: string = useSelector(
    (state: RootState) => state?.salesVoucher?.partyId
  );

  const date: string = useSelector(
    (state: RootState) => state?.salesVoucher?.date
  );

  const postGstAmount: string = useSelector(
    (state: RootState) => state?.salesVoucher?.gstAmount
  );

  const postGstChoice: string = useSelector(
    (state: RootState) => state?.salesVoucher?.gstChoice
  );

  const salesVoucherProcessData: SalesVoucherTableData[] = useSelector(
    (state: RootState) => state?.salesVoucher?.salesVoucherProcessData
  );

  const salesVoucherData: SalesVoucherTableData[] = useSelector(
    (state: RootState) => state?.salesVoucher?.salesVoucherData
  );

  const handleIsSelected = (data: SalesVoucherTableData) => {
    setSelected((prev) => {
      const isAlreadySelected = prev.some((row) => row.Id === data.Id);

      if (isAlreadySelected) {
        // Remove the row if already selected
        return prev.filter((row) => row.Id !== data.Id);
      } else {
        // Add the row if not selected
        return [...prev, data];
      }
    });
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
      setFinId(getCookieData<number | null>("waxCraftClientFinId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    partyName: yup.string().default(""),
    invoiceDate: yup.date().required("Invoice date is required"),
    partyId: yup.string().required("Party is required"),
    gstChoice: yup.string().required("Gst choice required"),
    gstAmount: yup.string().required("Gst amount required"),
    transMode: yup.string().required("Mode is required"),
    bankId: yup.string().default(""),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<SalesVoucherFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      partyName: "",
      invoiceDate: undefined,
      partyId: "",
      gstChoice: "N",
      gstAmount: "",
      transMode: "C",
      bankId: "",
    },
  });

  const { partyId, gstChoice, transMode } = form.watch();

  const handleSalesVoucherProcess = () => {
    if (selected.length > 0 && form.getValues("invoiceDate")) {
      if (gstChoice === "Y") {
        dispatch(getGstAmount(form.getValues("gstAmount")));
      } else {
        dispatch(getGstAmount(0));
      }
      dispatch(getPartyId(form.getValues("partyId")));
      dispatch(getDate(format(form.getValues("invoiceDate"), "yyyy-MM-dd")));
      dispatch(getGstChoice(form.getValues("gstChoice")));
      dispatch(getSalesVoucherProcessData(selected));
      router.push(`/inventoryVoucher/salesVoucher/process`);
    } else {
      toast.error("Please select a order and date first");
    }
  };

  const handleSubmit = () => {
    addOrderBookingApiCall();
  };

  const handleShowDeleteDialog = (id: number) => {
    setShowDeleteDialog(true);
    setTempDeleteId(id);
  };

  const handleShowInvoiceDialog = (id: number) => {
    setShowInvoiceDialog(true);
    if (orgId) getInvoicePrintDataApiCall(orgId, id);
  };

  const handleDeleteInvoiceData = () => {
    if (orgId && tempDeleteId) deleteInvoiceDataApiCall(orgId, tempDeleteId);
  };

  const addOrderBookingApiCall = async () => {
    setAddSalesVoucherLoading(true);

    const invoiceData = salesVoucherProcessData.flatMap((itemData) => [
      {
        order_id: itemData.Id,
        design_id: itemData.DesignRow[0].Design_Id,
        qnty: itemData.DesignRow[0].Order_Qnty,

        wt: itemData.DesignRow[0].Wt,
        wt_rate: itemData.DesignRow[0].Wt_Rate,
        tot_wt: itemData.DesignRow[0].Tot_Wt,
        polish_rate: itemData.DesignRow[0].Polish,
        tot_polish: itemData.DesignRow[0].Tot_Polish,
        item_id: null,
        item_qnty: null,
        item_rate: null,
        item_tot: null,
        making_rate: null,
      },
      ...itemData.DesignRow[0].ItemRow.map((item) => ({
        order_id: itemData.Id,
        design_id: itemData.DesignRow[0].Design_Id,
        qnty: null,
        wt: null,
        wt_rate: null,
        tot_wt: null,
        polish_rate: null,
        tot_polish: null,
        item_id: item.Item_Id,
        item_qnty:
          Number(item.Item_Qnty) * Number(itemData.DesignRow[0].Order_Qnty),
        item_rate: item.Item_Rate,
        item_tot:
          Number(item.Item_Tot) * Number(itemData.DesignRow[0].Order_Qnty),
        making_rate: item.Making_Rate,
      })),
    ]);

    const data = {
      org_id: orgId,
      sales_date: date,
      party_id: postPartyId,
      tot_amount: totalOrderAmount,
      gst_rate: postGstAmount,
      tot_cgst: postGstAmount
        ? (totalOrderAmount * Number(postGstAmount)) / 200
        : 0,
      tot_sgst: postGstAmount
        ? (totalOrderAmount * Number(postGstAmount)) / 200
        : 0,
      tot_igst: 0,
      tot_round:
        // @ts-expect-error nodescription
        Math.abs(
          (totalOrderAmount +
            totalOrderAmount *
              (postGstChoice === "Y" ? Number(postGstAmount) / 100 : 0)) %
            1
        ).toFixed(2) > 0.5
          ? (
              1 -
              Math.abs(
                (totalOrderAmount +
                  totalOrderAmount *
                    (postGstChoice === "Y" ? Number(postGstAmount) / 100 : 0)) %
                  1
              )
            ).toFixed(2)
          : -Math.abs(
              (totalOrderAmount +
                totalOrderAmount *
                  (postGstChoice === "Y" ? Number(postGstAmount) / 100 : 0)) %
                1
            ).toFixed(2),
      tot_discount: value || "0",
      year_id: finId,
      is_credit: transMode === "Cr" ? 1 : null,
      invoise_data: invoiceData,
      bank_id: transMode === "B" ? form.getValues("bankId") : null,
    };

    try {
      const res: ApiResponse = await addSalesVoucherAPI(data);

      if (res.status === 200) {
        form.reset();
        setOrderPartyInput("");
        setValue("");
        setTotalOrderAmount(0);
        setParentSelected(false);
        setShowInvoiceDialog(true);
        if (orgId && res.data.details)
          getInvoicePrintDataApiCall(orgId, res.data.details);
        dispatch(getSalesVoucherProcessData([]));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddSalesVoucherLoading(false);
    }
  };

  const deleteInvoiceDataApiCall = async (
    orgId: number,
    salesId: string | number
  ) => {
    setDeleteInvoiceLoading(true);

    const data = {
      org_id: orgId,
      sales_id: salesId,
    };

    try {
      const res: ApiResponse = await deleteInvoiceDataAPI(data);

      if (res.status === 200) {
        setShowDeleteDialog(false);
        setTempDeleteId(null);
        setCurrentPage(1);
        getInvoiceListApiCall(orgId, 1, "");

        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteInvoiceLoading(false);
    }
  };

  const getInvoicePrintDataApiCall = async (orgId: number, salesId: number) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getInvoicePrintDataAPI(orgId, salesId);

      if (res.status === 200) {
        dispatch(getInvoicePrintData(res.data.details));
        console.log(res.data.details);
      } else {
        dispatch(getInvoicePrintData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getInvoicePrintData([]));
    } finally {
      setLoading(false);
    }
  };

  const getSalesVoucherApiCall = async (
    orgId: number,
    partyId: string,
    page: number,
    keyword: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getSalesVoucherAPI(
        orgId,
        partyId,
        page,
        keyword
      );

      if (res.status === 200) {
        dispatch(getSalesVoucherData(res.data.details));
      } else {
        dispatch(getSalesVoucherData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getSalesVoucherData([]));
    } finally {
      setLoading(false);
    }
  };

  const getInvoiceListApiCall = async (
    orgId: number,
    page: number,
    keyword: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getInvoiceListDataAPI(
        orgId,
        page,
        keyword,
        perPage,
      );

      if (res.status === 200) {
        dispatch(getInvoiceListData(res.data.details?.data));
        setLastPage(res.data.details?.last_page);
      } else {
        dispatch(getInvoiceListData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getInvoiceListData([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      salesVoucherData.length > 0 &&
      selected.length === salesVoucherData.length
    )
      setParentSelected(true);
    else setParentSelected(false);
  }, [selected, salesVoucherData]);

  useEffect(() => {
    if (salesVoucherData.length > 0) {
      if (!parentSelected) setSelected([]);
      else setSelected(salesVoucherData);
    }
  }, [parentSelected, salesVoucherData]);

  return {
    getSalesVoucherApiCall,
    deleteInvoiceLoading,
    getInvoiceListApiCall,
    addSalesVoucherLoading,
    loading,
    form,
    handleSalesVoucherProcess,
    partyId,
    parentSelected,
    setParentSelected,
    selected,
    handleIsSelected,
    totalOrderAmount,
    setTotalOrderAmount,
    value,
    setValue,
    handleSubmit,
    tabSelected,
    setTabSelected,
    handleShowDeleteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleDeleteInvoiceData,
    showInvoiceDialog,
    setShowInvoiceDialog,
    handleShowInvoiceDialog,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    orderPartyInput,
    setOrderPartyInput,
  };
};
