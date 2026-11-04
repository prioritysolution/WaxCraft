import { yupResolver } from "@/lib/yupResolver";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";
import { ApiResponse } from "@/types/ApiTypes";
import {
  PartyMakingRateFormData,
  PartyMakingRatePartyOption,
  PartyMakingRateTableData,
} from "@/types/master/PartyMakingRateTypes";
import getCookieData from "@/utils/getCookieData";
import { toRateString } from "@/utils/formatDecimal";
import { rateRegex } from "@/utils/validationRegex";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { getPartyAPI } from "@/container/master/party/PartyApis";
import {
  addPartyMakingRateAPI,
  deletePartyMakingRateAPI,
  getPartyMakingRateAPI,
  updatePartyMakingRateAPI,
} from "./PartyMakingRateApis";
import { getPartyMakingRateData } from "./PartyMakingRateReducer";
import {
  getMasterDeleteWarningMessage,
  isMasterDeleteDependencyResponse,
} from "@/lib/masterDelete";
import { resolveListTotalCount } from "@/lib/listTotalCount";
import { useListPerPage } from "@/lib/useListPerPage";
import { useSearchDebounce } from "@/lib/useSearchDebounce";

export const usePartyMakingRate = () => {
  const dispatch = useDispatch();
  const runDebouncedSearch = useSearchDebounce();

  const [addPartyMakingRateLoading, setAddPartyMakingRateLoading] =
    useState(false);
  const [updatePartyMakingRateLoading, setUpdatePartyMakingRateLoading] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { perPage, handlePerPageChange } = useListPerPage(() =>
    setCurrentPage(1),
  );
  const [totalCount, setTotalCount] = useState(0);
  const [tableInput, setTableInput] = useState("");

  const [orgId, setOrgId] = useState<number | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<PartyMakingRateTableData | null>(
    null,
  );

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);
  const [deletePartyMakingRateLoading, setDeletePartyMakingRateLoading] =
    useState(false);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  const [partyOptions, setPartyOptions] = useState<
    PartyMakingRatePartyOption[]
  >([]);
  const [partyInput, setPartyInput] = useState("");
  const [partyPage, setPartyPage] = useState(1);
  const [partyLastPage, setPartyLastPage] = useState(1);
  const [getPartyLoading, setGetPartyLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  const formSchema = yup.object({
    partyId: yup.string().required("Party is required"),
    makingRate: yup
      .string()
      .required("Making rate is required")
      .test("is-valid-number", "Invalid making rate", (value) => {
        if (!value) return false;
        return rateRegex.test(value);
      }),
  });

  const form = useForm<PartyMakingRateFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      partyId: "",
      makingRate: "",
    },
  });

  const handleSubmit: SubmitHandler<PartyMakingRateFormData> = (values) => {
    if (orgId) {
      if (editData && Object.keys(editData).length > 0) {
        updatePartyMakingRateApiCall(editData.Id, values, orgId);
      } else {
        addPartyMakingRateApiCall(values, orgId);
      }
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const handleEditData = (data: PartyMakingRateTableData) => {
    setPartyOptions((prev) => {
      if (prev.some((p) => Number(p.Id) === Number(data.Party_Id))) return prev;
      return [
        { Id: data.Party_Id, Party_Name: data.Party_Name },
        ...prev,
      ];
    });
    setPartyInput(data.Party_Name || "");
    setEditData(data);
    setIsOpen(true);
  };

  const handleShowDeleteDialog = (id: number) => {
    setTempDeleteId(id);
    setDeleteWarning(null);
    setShowDeleteDialog(true);
  };

  const handleDeletePartyMakingRate = () => {
    if (orgId && tempDeleteId) {
      deletePartyMakingRateApiCall(orgId, tempDeleteId);
    }
  };

  const handleFilterTableData = (value: string) => {
    setTableInput(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
      return;
    }
    runDebouncedSearch(() => {
      if (orgId) getPartyMakingRateApiCall(orgId, 1, value);
    });
  };

  const getPartyDropdownApiCall = async (
    orgIdValue: number,
    page: number,
    keyword: string,
  ) => {
    setGetPartyLoading(true);
    try {
      const res: ApiResponse = await getPartyAPI(orgIdValue, page, keyword, 20);
      if (res.status === 200 || res.status === 202) {
        const details = res.data.details;
        const rows: PartyMakingRatePartyOption[] = Array.isArray(details)
          ? details
          : Array.isArray(details?.data)
            ? details.data
            : [];
        setPartyOptions((prev) => (page > 1 ? [...prev, ...rows] : rows));
        setPartyLastPage(
          Array.isArray(details)
            ? 1
            : Number(details?.last_page) > 0
              ? Number(details.last_page)
              : 1,
        );
      } else if (page === 1) {
        setPartyOptions([]);
        setPartyLastPage(1);
      }
    } catch {
      if (page === 1) {
        setPartyOptions([]);
        setPartyLastPage(1);
      }
    } finally {
      setGetPartyLoading(false);
    }
  };

  const handleSearchParty = () => {
    if (!orgId) return;
    setPartyPage(1);
    getPartyDropdownApiCall(orgId, 1, partyInput);
  };

  const handleScrollParty = () => {
    if (!orgId || partyPage >= partyLastPage || getPartyLoading) return;
    const nextPage = partyPage + 1;
    setPartyPage(nextPage);
    getPartyDropdownApiCall(orgId, nextPage, partyInput);
  };

  const addPartyMakingRateApiCall = async (
    item: PartyMakingRateFormData,
    orgIdValue: number,
  ) => {
    setAddPartyMakingRateLoading(true);

    const data = {
      org_id: orgIdValue,
      party_id: item.partyId,
      making_rate: toRateString(item.makingRate),
    };

    try {
      const res: ApiResponse = await addPartyMakingRateAPI(data);

      if (res.status === 200) {
        form.reset();
        setPartyInput("");
        setIsOpen(false);
        setCurrentPage(1);
        setTableInput("");
        getPartyMakingRateApiCall(orgIdValue, 1, "");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setAddPartyMakingRateLoading(false);
    }
  };

  const updatePartyMakingRateApiCall = async (
    makingRateId: number,
    item: PartyMakingRateFormData,
    orgIdValue: number,
  ) => {
    const data = {
      org_id: orgIdValue,
      making_rate_id: makingRateId,
      party_id: item.partyId,
      making_rate: toRateString(item.makingRate),
    };

    setUpdatePartyMakingRateLoading(true);
    try {
      const res = await updatePartyMakingRateAPI(data);
      if (res.status === 200) {
        toast.success(res.data.message);
        form.reset();
        setPartyInput("");
        setCurrentPage(1);
        setTableInput("");
        getPartyMakingRateApiCall(orgIdValue, 1, "");
        setIsOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdatePartyMakingRateLoading(false);
    }
  };

  const getPartyMakingRateApiCall = async (
    orgIdValue: number,
    page: number,
    keyword: string,
    requestPerPage?: number,
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getPartyMakingRateAPI(
        orgIdValue,
        page,
        keyword,
        requestPerPage ?? perPage,
      );

      if (res.status === 200 || res.status === 202) {
        const details = res.data.details;
        const newData = Array.isArray(details)
          ? details
          : Array.isArray(details?.data)
            ? details.data
            : [];
        dispatch(getPartyMakingRateData(newData));
        setLastPage(
          Array.isArray(details)
            ? 1
            : Number(details?.last_page) > 0
              ? Number(details.last_page)
              : 1,
        );
        if (!keyword) {
          setTotalCount(resolveListTotalCount(details));
        }
      } else {
        dispatch(getPartyMakingRateData([]));
        if (!keyword) {
          setTotalCount(0);
        }
      }
    } catch {
      toast.error("Something went wrong");
      dispatch(getPartyMakingRateData([]));
      if (!keyword) {
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const deletePartyMakingRateApiCall = async (
    orgIdValue: number,
    makingRateId: number,
  ) => {
    setDeletePartyMakingRateLoading(true);

    const data = {
      org_id: orgIdValue,
      making_rate_id: makingRateId,
    };

    try {
      const res: ApiResponse = await deletePartyMakingRateAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        setShowDeleteDialog(false);
        setTempDeleteId(null);
        setDeleteWarning(null);
        setCurrentPage(1);
        setTableInput("");
        getPartyMakingRateApiCall(orgIdValue, 1, "");
      } else if (isMasterDeleteDependencyResponse(res)) {
        setDeleteWarning(getMasterDeleteWarningMessage(res));
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletePartyMakingRateLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        partyId: String(editData.Party_Id ?? ""),
        makingRate: toRateString(editData.Making_Rate),
      });
    } else {
      form.reset({ partyId: "", makingRate: "" });
    }
  }, [editData, form.reset]);

  useEffect(() => {
    if (editData && !isOpen) {
      setEditData(null);
    }
  }, [isOpen, editData]);

  useEffect(() => {
    if (isOpen && orgId) {
      setPartyPage(1);
      getPartyDropdownApiCall(orgId, 1, partyInput || "");
    }
  }, [isOpen, orgId]);

  useResetFormOnModalClose(isOpen, () => {
    form.reset();
    setPartyInput("");
  });

  return {
    getPartyMakingRateApiCall,
    addPartyMakingRateLoading,
    updatePartyMakingRateLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    totalCount,
    tableInput,
    handleFilterTableData,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeletePartyMakingRate,
    deletePartyMakingRateLoading,
    deleteWarning,
    partyOptions,
    partyInput,
    setPartyInput,
    handleSearchParty,
    handleScrollParty,
    getPartyLoading,
  };
};
