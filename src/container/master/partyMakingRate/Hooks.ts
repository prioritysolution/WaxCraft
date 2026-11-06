import { yupResolver } from "@/lib/yupResolver";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";
import { ApiResponse } from "@/types/ApiTypes";
import {
  PartyMakingRateFormData,
  PartyMakingRateLineForm,
  PartyMakingRateModelOption,
  PartyMakingRatePartyOption,
  PartyMakingRateSaveBody,
  PartyMakingRateTableData,
} from "@/types/master/PartyMakingRateTypes";
import getCookieData from "@/utils/getCookieData";
import { toRateString } from "@/utils/formatDecimal";
import { rateRegex } from "@/utils/validationRegex";
import { getItemModelAPI } from "@/container/master/itemModel/ItemModelApis";
import { useEffect, useMemo, useRef, useState } from "react";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { getPartyAPI } from "@/container/master/party/PartyApis";
import {
  addPartyMakingRateAPI,
  deletePartyMakingRateAPI,
  getPartyMakingRateAPI,
  getPartyMakingRateByPartyAPI,
  savePartyMakingRateAPI,
  updatePartyMakingRateAPI,
} from "./PartyMakingRateApis";
import { getPartyMakingRateData } from "./PartyMakingRateReducer";
import { useListPerPage } from "@/lib/useListPerPage";
import { useSearchDebounce } from "@/lib/useSearchDebounce";
import {
  buildPartyMakingRateFormRows,
  groupPartyMakingRateRows,
  parsePartyLevelRates,
  parsePartyMakingRateStoredRows,
} from "@/utils/partyMakingRate";
import type { PartyMakingRateStoredRow } from "@/utils/partyMakingRate";

const optionalRate = (label: string) =>
  yup
    .string()
    .test("is-valid-number", `Invalid ${label.toLowerCase()}`, (value) => {
      if (!value) return true;
      return rateRegex.test(value);
    });

const formSchema = yup.object({
  partyId: yup.string().required("Party is required"),
  wtRate: optionalRate("WT rate"),
  ghat: optionalRate("Ghat"),
  polish: optionalRate("Polish"),
  rows: yup.array().of(
    yup.object({
      makingRateId: yup.string().defined(),
      modelId: yup.string().required(),
      modelName: yup.string().defined(),
      makingRate: optionalRate("Making rate"),
    }),
  ),
});

const emptyForm: PartyMakingRateFormData = {
  partyId: "",
  wtRate: "",
  ghat: "",
  polish: "",
  rows: [],
};

const hasMakingRate = (row: PartyMakingRateLineForm) =>
  Boolean(String(row.makingRate || "").trim());

const readListRows = <T,>(details: unknown): T[] => {
  if (Array.isArray(details)) return details as T[];
  if (details && typeof details === "object") {
    const record = details as { data?: unknown };
    if (Array.isArray(record.data)) return record.data as T[];
  }
  return [];
};

const readLastPage = (details: unknown) => {
  if (Array.isArray(details)) return 1;
  if (details && typeof details === "object") {
    const lastPage = Number((details as { last_page?: unknown }).last_page);
    if (lastPage > 0) return lastPage;
  }
  return 1;
};

export const usePartyMakingRate = () => {
  const dispatch = useDispatch();
  const runDebouncedSearch = useSearchDebounce();
  const savedRows = useSelector(
    (state: { partyMakingRate?: { partyMakingRateData?: PartyMakingRateTableData[] } }) =>
      state?.partyMakingRate?.partyMakingRateData || [],
  );
  const savedRowsRef = useRef(savedRows);
  savedRowsRef.current = savedRows;

  const [savePartyMakingRateLoading, setSavePartyMakingRateLoading] =
    useState(false);
  const [rowsLoading, setRowsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const { perPage, handlePerPageChange } = useListPerPage(() =>
    setCurrentPage(1),
  );
  const [tableInput, setTableInput] = useState("");
  const [partyFilterId, setPartyFilterId] = useState("");
  const [filterPartyOptions, setFilterPartyOptions] = useState<
    PartyMakingRatePartyOption[]
  >([]);
  const [filterPartyLoading, setFilterPartyLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<PartyMakingRateTableData | null>(
    null,
  );

  const [partyOptions, setPartyOptions] = useState<
    PartyMakingRatePartyOption[]
  >([]);
  const [partyInput, setPartyInput] = useState("");
  const [partyPage, setPartyPage] = useState(1);
  const [partyLastPage, setPartyLastPage] = useState(1);
  const [getPartyLoading, setGetPartyLoading] = useState(false);
  const [modelOptions, setModelOptions] = useState<
    PartyMakingRateModelOption[]
  >([]);
  const [getModelLoading, setGetModelLoading] = useState(false);
  const [modelVersion, setModelVersion] = useState(0);

  const rowsPartyRef = useRef("");
  const rowsRequestRef = useRef(0);
  const selectedPartyRef = useRef("");

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  const form = useForm<PartyMakingRateFormData>({
    resolver: yupResolver(formSchema) as Resolver<PartyMakingRateFormData>,
    defaultValues: emptyForm,
  });

  const partyId = form.watch("partyId");

  const refreshRates = (orgIdValue: number) => {
    setCurrentPage(1);
    setTableInput("");
    getPartyMakingRateApiCall(orgIdValue, 1, "");
  };

  const handleSubmit: SubmitHandler<PartyMakingRateFormData> = (values) => {
    if (!orgId) {
      toast.error("Somthing went wrong");
      return;
    }
    if (rowsLoading || getModelLoading) {
      toast.error("Item models are still loading");
      return;
    }

    const hasPartyRate = Boolean(
      String(values.wtRate || "").trim() ||
        String(values.ghat || "").trim() ||
        String(values.polish || "").trim(),
    );
    const persistable = (values.rows || []).filter(
      (row) => hasMakingRate(row) || row.makingRateId,
    );
    if (!hasPartyRate && !persistable.length) {
      toast.error("Enter a making rate or a party rate");
      return;
    }

    const payload: PartyMakingRateSaveBody = {
      org_id: orgId,
      party_id: values.partyId,
      wt_rate: toRateString(values.wtRate),
      ghat: toRateString(values.ghat),
      polish: toRateString(values.polish),
      rows: persistable.map((row) => ({
        making_rate_id: row.makingRateId ? Number(row.makingRateId) : 0,
        model_id: Number(row.modelId),
        making_rate: toRateString(row.makingRate),
      })),
    };

    savePartyMakingRateApiCall(payload);
  };

  const handleEditData = (data: PartyMakingRateTableData) => {
    setPartyOptions((prev) => {
      if (prev.some((p) => Number(p.Id) === Number(data.Party_Id))) return prev;
      return [{ Id: data.Party_Id, Party_Name: data.Party_Name }, ...prev];
    });
    setPartyInput(data.Party_Name || "");
    setEditData(data);
    setIsOpen(true);
  };

  const handleOpenAdd = () => {
    setEditData(null);
    setPartyInput("");
    setIsOpen(true);
  };

  const handleFilterTableData = (value: string) => {
    setTableInput(value);
    setCurrentPage(1);
    runDebouncedSearch(() => {
      if (orgId) getPartyMakingRateApiCall(orgId, 1, value);
    });
  };

  const handlePartyFilterChange = (partyIdValue: string) => {
    setPartyFilterId(partyIdValue);
    setCurrentPage(1);
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
        const rows: PartyMakingRatePartyOption[] = readListRows(details);
        setPartyOptions((prev) => {
          const next = page > 1 ? [...prev, ...rows] : rows;
          if (
            page === 1 &&
            editData &&
            !next.some((party) => Number(party.Id) === Number(editData.Party_Id))
          ) {
            return [
              { Id: editData.Party_Id, Party_Name: editData.Party_Name },
              ...next,
            ];
          }
          return next;
        });
        setPartyLastPage(readLastPage(details));
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

  const loadAllFilterParties = async (orgIdValue: number) => {
    setFilterPartyLoading(true);
    try {
      const collected: PartyMakingRatePartyOption[] = [];
      let page = 1;
      let last = 1;

      do {
        const res: ApiResponse = await getPartyAPI(orgIdValue, page, "", 100);
        if (res.status !== 200 && res.status !== 202) break;
        const details = res.data.details;
        const batch = readListRows<PartyMakingRatePartyOption>(details);
        collected.push(...batch);
        last = readLastPage(details);
        if (!batch.length) break;
        page += 1;
      } while (page <= last && page <= 50);

      const unique = new Map<number, PartyMakingRatePartyOption>();
      collected.forEach((party) => {
        if (party?.Id == null) return;
        unique.set(Number(party.Id), party);
      });
      setFilterPartyOptions(
        Array.from(unique.values()).sort((a, b) =>
          String(a.Party_Name || "").localeCompare(String(b.Party_Name || ""), undefined, {
            sensitivity: "base",
          }),
        ),
      );
    } catch {
      setFilterPartyOptions([]);
    } finally {
      setFilterPartyLoading(false);
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

  const saveRowsWithLegacyApi = async (payload: PartyMakingRateSaveBody) => {
    let last: ApiResponse = {
      status: 200,
      data: { message: "Party making rates saved", details: null },
    };

    if (!payload.rows.length) {
      return {
        status: 400,
        data: {
          message:
            "Enter a making rate for at least one item model. WT rate, ghat, and polish are saved with the party.",
          details: null,
        },
      };
    }

    for (const row of payload.rows) {
      const hasMaking = Boolean(row.making_rate);
      const hasPartyRate = Boolean(
        payload.wt_rate || payload.ghat || payload.polish,
      );
      if (!hasMaking && row.making_rate_id && !hasPartyRate) {
        last = await deletePartyMakingRateAPI({
          org_id: payload.org_id,
          making_rate_id: row.making_rate_id,
        });
      } else if (!hasMaking && !row.making_rate_id) {
        continue;
      } else {
        const body = {
          org_id: payload.org_id,
          party_id: payload.party_id,
          model_id: row.model_id,
          making_rate: row.making_rate,
          wt_rate: payload.wt_rate,
          ghat: payload.ghat,
          polish: payload.polish,
          ...(row.making_rate_id ? { making_rate_id: row.making_rate_id } : {}),
        };
        last = row.making_rate_id
          ? await updatePartyMakingRateAPI(body)
          : await addPartyMakingRateAPI(body);
      }
      if (last.status !== 200) return last;
    }

    return {
      status: 200,
      data: { message: "Party making rates saved", details: null },
    };
  };

  const savePartyMakingRateApiCall = async (payload: PartyMakingRateSaveBody) => {
    setSavePartyMakingRateLoading(true);

    try {
      let res: ApiResponse = await savePartyMakingRateAPI(payload);
      if (res.status === 404) {
        res = await saveRowsWithLegacyApi(payload);
      }

      if (res.status === 200) {
        form.reset(emptyForm);
        setPartyInput("");
        setIsOpen(false);
        refreshRates(payload.org_id);
        toast.success(res.data.message || "Party making rates saved");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSavePartyMakingRateLoading(false);
    }
  };

  const getPartyMakingRateApiCall = async (
    orgIdValue: number,
    _page: number,
    keyword: string,
  ) => {
    setLoading(true);

    try {
      const collected: PartyMakingRateTableData[] = [];
      let page = 1;
      let last = 1;

      do {
        const res: ApiResponse = await getPartyMakingRateAPI(
          orgIdValue,
          page,
          keyword,
          100,
        );

        if (res.status !== 200 && res.status !== 202) {
          if (page === 1) dispatch(getPartyMakingRateData([]));
          break;
        }

        const details = res.data.details;
        const batch = readListRows<PartyMakingRateTableData>(details);
        collected.push(...batch);
        last = readLastPage(details);
        if (!batch.length) break;
        page += 1;
      } while (page <= last && page <= 100);

      dispatch(getPartyMakingRateData(collected));
    } catch {
      toast.error("Something went wrong");
      dispatch(getPartyMakingRateData([]));
    } finally {
      setLoading(false);
    }
  };

  const listRowsForParty = (partyIdValue: string): PartyMakingRateStoredRow[] =>
    savedRowsRef.current
      .filter((row) => String(row.Party_Id) === String(partyIdValue))
      .map((row) => ({
        id: row.Id ? String(row.Id) : "",
        modelId: row.Model_Id ? String(row.Model_Id) : "",
        modelName: row.Model_Name || "",
        makingRate: toRateString(row.Making_Rate),
        wtRate: toRateString(row.Wt_Rate),
        ghat: toRateString(row.Ghat),
        polish: toRateString(row.Polish),
      }));

  const mergeStoredRows = (
    primary: PartyMakingRateStoredRow[],
    fallback: PartyMakingRateStoredRow[],
  ) => {
    const merged = new Map<string, PartyMakingRateStoredRow>();
    const keyOf = (row: PartyMakingRateStoredRow) =>
      String(Number(row.modelId) || row.modelId || row.id);

    fallback.forEach((row) => merged.set(keyOf(row), row));
    primary.forEach((row) => {
      const key = keyOf(row);
      const existing = merged.get(key);
      merged.set(key, {
        id: row.id || existing?.id || "",
        modelId: row.modelId || existing?.modelId || "",
        modelName: row.modelName || existing?.modelName || "",
        makingRate: row.makingRate || existing?.makingRate || "",
        wtRate: row.wtRate || existing?.wtRate || "",
        ghat: row.ghat || existing?.ghat || "",
        polish: row.polish || existing?.polish || "",
      });
    });
    return Array.from(merged.values());
  };

  const getModelDropdownApiCall = async (orgIdValue: number) => {
    setGetModelLoading(true);
    try {
      const collected: PartyMakingRateModelOption[] = [];
      let page = 1;
      let lastPageValue = 1;

      do {
        const res: ApiResponse = await getItemModelAPI(orgIdValue, page, 100);
        if (res.status !== 200 && res.status !== 202) break;
        const details = res.data.details;
        const rows: PartyMakingRateModelOption[] = readListRows(details);
        collected.push(...rows);
        lastPageValue = readLastPage(details);
        page += 1;
      } while (page <= lastPageValue && page <= 20);

      setModelOptions(collected);
      setModelVersion((version) => version + 1);
    } catch {
      setModelOptions([]);
      setModelVersion((version) => version + 1);
    } finally {
      setGetModelLoading(false);
    }
  };

  const loadRowsForParty = async (
    orgIdValue: number,
    selectedPartyId: string,
    models: PartyMakingRateModelOption[],
  ) => {
    const requestId = rowsRequestRef.current + 1;
    rowsRequestRef.current = requestId;
    setRowsLoading(true);

    try {
      const res: ApiResponse = await getPartyMakingRateByPartyAPI(
        orgIdValue,
        selectedPartyId,
      );
      if (requestId !== rowsRequestRef.current) return;
      const details = res.data?.details;
      const fromList = listRowsForParty(selectedPartyId);
      const fromApi =
        res.status === 200 || res.status === 202
          ? parsePartyMakingRateStoredRows(details)
          : [];
      const stored = mergeStoredRows(fromApi, fromList);
      const partyRates = parsePartyLevelRates(details);
      const listRates = fromList.find(
        (row) => row.wtRate || row.ghat || row.polish,
      );
      const current = form.getValues();
      form.setValue(
        "wtRate",
        partyRates.wtRate || listRates?.wtRate || current.wtRate || "",
        { shouldDirty: false },
      );
      form.setValue(
        "ghat",
        partyRates.ghat || listRates?.ghat || current.ghat || "",
        { shouldDirty: false },
      );
      form.setValue(
        "polish",
        partyRates.polish || listRates?.polish || current.polish || "",
        { shouldDirty: false },
      );
      form.setValue("rows", buildPartyMakingRateFormRows(models, stored), {
        shouldDirty: false,
      });
    } catch {
      if (requestId !== rowsRequestRef.current) return;
      form.setValue(
        "rows",
        buildPartyMakingRateFormRows(
          models,
          listRowsForParty(selectedPartyId),
        ),
        { shouldDirty: false },
      );
    } finally {
      if (requestId === rowsRequestRef.current) setRowsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    rowsPartyRef.current = "";
    form.reset({
      partyId: editData ? String(editData.Party_Id ?? "") : "",
      wtRate: editData ? toRateString(editData.Wt_Rate) : "",
      ghat: editData ? toRateString(editData.Ghat) : "",
      polish: editData ? toRateString(editData.Polish) : "",
      rows: [],
    });
    // Reset only when the dialog opens or the edited party changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editData]);

  useEffect(() => {
    if (editData && !isOpen) {
      setEditData(null);
    }
  }, [isOpen, editData]);

  useEffect(() => {
    if (isOpen && orgId) {
      setPartyPage(1);
      getPartyDropdownApiCall(orgId, 1, partyInput || "");
      getModelDropdownApiCall(orgId);
    }
  }, [isOpen, orgId]);

  useEffect(() => {
    if (!isOpen) {
      rowsPartyRef.current = "";
      selectedPartyRef.current = "";
      return;
    }
    if (!orgId || !partyId) {
      if (selectedPartyRef.current) {
        form.setValue("rows", []);
        form.setValue("wtRate", "");
        form.setValue("ghat", "");
        form.setValue("polish", "");
      }
      rowsPartyRef.current = "";
      selectedPartyRef.current = "";
      return;
    }
    selectedPartyRef.current = partyId;
    if (getModelLoading || modelVersion === 0) return;

    const key = `${partyId}:${modelVersion}`;
    if (rowsPartyRef.current === key) return;
    rowsPartyRef.current = key;
    loadRowsForParty(orgId, partyId, modelOptions);
  }, [isOpen, orgId, partyId, getModelLoading, modelVersion]);

  const groupedParties = useMemo(
    () => groupPartyMakingRateRows(savedRows),
    [savedRows],
  );
  const filteredParties = useMemo(
    () =>
      partyFilterId
        ? groupedParties.filter(
            (row) => String(row.Party_Id) === partyFilterId,
          )
        : groupedParties,
    [groupedParties, partyFilterId],
  );
  const lastPage = Math.max(1, Math.ceil(filteredParties.length / perPage) || 1);
  const safePage = Math.min(currentPage, lastPage);
  const visibleParties = filteredParties.slice(
    (safePage - 1) * perPage,
    safePage * perPage,
  );

  useEffect(() => {
    if (currentPage > lastPage) setCurrentPage(lastPage);
  }, [currentPage, lastPage]);

  useEffect(() => {
    if (orgId) loadAllFilterParties(orgId);
  }, [orgId]);

  useResetFormOnModalClose(isOpen, () => {
    form.reset(emptyForm);
    setPartyInput("");
    rowsPartyRef.current = "";
    selectedPartyRef.current = "";
  });

  return {
    getPartyMakingRateApiCall,
    savePartyMakingRateLoading,
    rowsLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    handleOpenAdd,
    currentPage: safePage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    totalCount: groupedParties.length,
    tableInput,
    handleFilterTableData,
    visibleParties,
    filterPartyOptions,
    filterPartyLoading,
    partyFilterId,
    onPartyFilterChange: handlePartyFilterChange,
    partyOptions,
    partyInput,
    setPartyInput,
    handleSearchParty,
    handleScrollParty,
    getPartyLoading,
    getModelLoading,
  };
};
