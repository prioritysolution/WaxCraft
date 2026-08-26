import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";
import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import { PartyFormData, PartyTableData } from "@/types/master/PartyTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { getPartyData, getPartyLedgerData } from "./PartyReducer";
import {
  addPartyAPI,
  deletePartyAPI,
  getPartyAPI,
  getPartyLedgerAPI,
  updatePartyAPI,
} from "./PartyApis";
import { decimalRegex } from "@/utils/validationRegex";
import { toTwoDecimalString } from "@/utils/formatDecimal";
import {
  getMasterDeleteWarningMessage,
  isMasterDeleteDependencyResponse,
} from "@/lib/masterDelete";
import { resolveListTotalCount } from "@/lib/listTotalCount";

export const useParty = () => {
  const dispatch = useDispatch();

  const [addPartyLoading, setAddPartyLoading] = useState(false);
  const [updatePartyLoading, setUpdatePartyLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [getPartyLedgerLoading, setGetPartyLedgerLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [partyTableInput, setPartyTableInput] = useState("");

  const [orgId, setOrgId] = useState<number | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<PartyTableData | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);
  const [deletePartyLoading, setDeletePartyLoading] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    partyType: yup.string().required("PartyType is required"),
    partyName: yup.string().required("Party name is required"),
    address: yup.string().required("Address is required"),
    mobileNo: yup.string().required("Mobile no. required"),
    email: yup.string().email("Invalid email").default(""),
    gstin: yup.string().default(""),
    underLedger: yup.string().required("Under ledger is required"),
    openingBalance: yup
      .string()
      .required("Opening Balance is required")
      .test("is-valid-number", "Invalid opening balance", (value) => {
        if (!value) return false; // Ensure the field is not empty
        return decimalRegex.test(value); // Validate against the regex
      }),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<PartyFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      partyType: "",
      partyName: "",
      address: "",
      mobileNo: "",
      email: "",
      gstin: "",
      underLedger: "",
      openingBalance: "",
    },
  });

  const { partyType } = form.watch();

  // Handle form submission
  const handleSubmit: SubmitHandler<PartyFormData> = (values) => {
    if (orgId) {
      if (editData && Object.keys(editData).length > 0) {
        updatePartyApiCall(editData.Id, values, orgId);
      } else {
        addPartyApiCall(values, orgId);
      }
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const handleEditData = (data: PartyTableData) => {
    setEditData(data);
    setIsOpen(true);
  };

  const handleShowDeleteDialog = (id: number) => {
    setTempDeleteId(id);
    setDeleteWarning(null);
    setShowDeleteDialog(true);
  };

  const handleDeleteParty = () => {
    if (orgId && tempDeleteId) {
      deletePartyApiCall(orgId, tempDeleteId);
    }
  };

  const handleFilterTableData = (value: string) => {
    setPartyTableInput(value);
    setCurrentPage(1);
    if (orgId) getPartyApiCall(orgId, 1, value);
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
      open_balance: toTwoDecimalString(item.openingBalance),
      party_mail: item.email || "",
      party_gst: item.gstin || "",
    };

    try {
      const res: ApiResponse = await addPartyAPI(data);

      if (res.status === 200) {
        form.reset();
        setIsOpen(false);
        setCurrentPage(1);
        setPartyTableInput("");
        getPartyApiCall(orgId, 1, "");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddPartyLoading(false);
    }
  };

  const updatePartyApiCall = async (
    partyId: number,
    item: PartyFormData,
    orgId: number
  ) => {
    let data = {
      org_id: orgId,
      party_id: partyId,
      party_type: item.partyType,
      party_Name: item.partyName,
      party_add: item.address,
      party_mob: item.mobileNo,
      under_ledger: item.underLedger,
      open_balance: toTwoDecimalString(item.openingBalance),
      party_mail: item.email || "",
      party_gst: item.gstin || "",
    };
    setUpdatePartyLoading(true);
    try {
      const res = await updatePartyAPI(data);
      if (res.status === 200) {
        toast.success(res.data.message);
        form.reset();
        setCurrentPage(1);
        setPartyTableInput("");
        getPartyApiCall(orgId, 1, "");
        setIsOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdatePartyLoading(false);
    }
  };

  const getPartyApiCall = async (
    orgId: number,
    page: number,
    keyword: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getPartyAPI(orgId, page, keyword);

      if (res.status === 200) {
        dispatch(getPartyData(res.data.details?.data));
        setLastPage(res.data.details?.last_page);
        if (!keyword) {
          setTotalCount(resolveListTotalCount(res.data.details));
        }
      } else {
        dispatch(getPartyData([]));
        if (!keyword) {
          setTotalCount(0);
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getPartyData([]));
      if (!keyword) {
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const getPartyLedgerApiCall = async (orgId: number, type: string) => {
    setGetPartyLedgerLoading(true);

    try {
      const res: ApiResponse = await getPartyLedgerAPI(orgId, type);

      if (res.status === 200) {
        dispatch(getPartyLedgerData(res.data.details));
      } else {
        dispatch(getPartyLedgerData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getPartyLedgerData([]));
    } finally {
      setGetPartyLedgerLoading(false);
    }
  };

  const deletePartyApiCall = async (
    orgId: number,
    partyId: number) => {
    setDeletePartyLoading(true);

    const data = {
      org_id: orgId,
      party_id: partyId,
    };

    try {
      const res: ApiResponse = await deletePartyAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        setShowDeleteDialog(false);
        setTempDeleteId(null);
        setDeleteWarning(null);
        setCurrentPage(1);
        setPartyTableInput("");
        getPartyApiCall(orgId, 1, "");
      } else if (isMasterDeleteDependencyResponse(res)) {
        setDeleteWarning(getMasterDeleteWarningMessage(res));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeletePartyLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        partyType: editData.Party_Type.toString() || "",
        partyName: editData.Party_Name || "",
        address: editData.Party_Add || "",
        mobileNo: editData.Party_Mob || "",
        email: editData.Party_Mail || "",
        gstin: editData.Party_Gst || "",
        underLedger: editData.Ledger_Id.toString() || "",
        openingBalance: toTwoDecimalString(editData.Open_Bal),
      });
    } else {
      form.reset({
        partyType: "",
        partyName: "",
        address: "",
        mobileNo: "",
        email: "",
        gstin: "",
        underLedger: "",
        openingBalance: "",
      });
    }
  }, [editData, form.reset]);

  useEffect(() => {
    if (editData && !isOpen) {
      setEditData(null);
    }
  }, [isOpen, editData]);

  useResetFormOnModalClose(isOpen, () => {
    form.reset();
  });

  return {
    getPartyApiCall,
    getPartyLedgerApiCall,
    addPartyLoading,
    updatePartyLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    partyType,
    partyTableInput,
    handleFilterTableData,
    currentPage,
    setCurrentPage,
    lastPage,
    totalCount,
    getPartyLedgerLoading,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteParty,
    deletePartyLoading,
    deleteWarning,
  };
};
