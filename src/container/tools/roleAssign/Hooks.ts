"use client";

import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@/lib/yupResolver";
import { useDispatch, useSelector } from "react-redux";
import { RoleAssignFormData, ModuleData } from "@/types/tools/RoleAssignTypes";
import {
  addRoleAssignAPI,
  getModuleDataAPI,
  getUserRoleMenuAPI,
} from "./RoleAssignApis";
import { getModuleData } from "./RoleAssignReducer";
import { ApiResponse } from "@/types/ApiTypes";
import getCookieData from "@/utils/getCookieData";

type AssignedMenuRow = {
  module_id?: string | number;
  Module_Id?: string | number;
  menue_id?: string | number | null;
  Menue_Id?: string | number | null;
  menu_id?: string | number | null;
  ChildRow?: Array<Record<string, unknown>>;
  childrow?: Array<Record<string, unknown>>;
};

const normalizeAssignedMenus = (details: unknown): AssignedMenuRow[] => {
  const record =
    details && typeof details === "object"
      ? (details as Record<string, unknown>)
      : null;
  const list = Array.isArray(details)
    ? details
    : Array.isArray(record?.Module_Array)
      ? record.Module_Array
      : Array.isArray(record?.data)
        ? record.data
        : [];

  const rows: AssignedMenuRow[] = [];
  list.forEach((item) => {
    if (!item || typeof item !== "object") return;
    const row = item as AssignedMenuRow;
    const children = row.ChildRow || row.childrow;
    if (Array.isArray(children) && children.length) {
      children.forEach((child) => {
        rows.push({
          module_id: row.Module_Id ?? row.module_id,
          menue_id: (child.Menue_Id ?? child.menue_id) as
            | string
            | number
            | null,
        });
      });
      return;
    }
    rows.push(row);
  });
  return rows;
};

export const useRoleAssign = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [openModuleId, setOpenModuleId] = useState<number[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const roleAssignList: ModuleData[] = useSelector((state: any) =>
    state?.roleAssign?.moduleData?.filter(
      (module: ModuleData) => module?.ChildRow?.length > 0
    )
  );

  const roleAssignSingleList: ModuleData[] = useSelector((state: any) =>
    state?.roleAssign?.moduleData?.filter(
      (module: ModuleData) =>
        !(module?.ChildRow?.length > 0) &&
        module?.Module_Id !== 1 &&
        module?.Module_Id !== 8
    )
  );

  const formSchema = yup.object({
    userId: yup.string().default("").required("User is required"),
    ...(roleAssignList && roleAssignList.length > 0
      ? roleAssignList.reduce((schema, module) => {
          // @ts-ignore
          schema[`moduleData_${module.Module_Id}`] = yup
            .array()
            .of(yup.number().nullable()) // Allow null or undefined values
            .default([]); // Set default to empty array
          return schema;
        }, {} as Record<string, yup.ArraySchema<any, any>>) // Use `any` for array elements
      : {}),
  });

  // useForm setup with explicit type for defaultValues
  const form = useForm<RoleAssignFormData>({
    resolver: yupResolver(formSchema),
    defaultValues:
      roleAssignList && roleAssignList.length > 0
        ? roleAssignList.reduce(
            (acc, module) => {
              acc[`moduleData_${module.Module_Id}`] = [];
              return acc;
            },
            { userId: "" } as RoleAssignFormData // Explicitly cast to RoleAssignFormData
          )
        : { userId: "" },
  });

  const handleSubmit: SubmitHandler<RoleAssignFormData> = async (values) => {
    addRoleAssignDataApiCall(values);
  };

  const addRoleAssignDataApiCall = async (item: RoleAssignFormData) => {
    setLoading(true);

    const moduleList = Object.keys(item)
      .filter((key) => key.startsWith("moduleData_")) // Filter only the moduleData keys
      .reduce<{ module_id: string | number; menue_id: string | number }[]>(
        (acc, key) => {
          const moduleId = key.split("_")[1]; // Extract the module id from the key
          const menueIds = item[key];

          // For each menue_id in the array, create a new object
          const moduleData = menueIds.map((menueId: number) => ({
            module_id: parseInt(moduleId), // Module ID as a number
            menue_id: menueId, // Menue ID from the array
          }));

          // Append the generated moduleData to the accumulator
          return [...acc, ...moduleData];
        },
        []
      );

    const singleModuleList = selected.map((data) => ({
      module_id: data,
      menue_id: null,
    }));

    let data = {
      user_id: item.userId,
      Module_Array: [...singleModuleList, ...moduleList],
    };

    try {
      const res: ApiResponse = await addRoleAssignAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        form.reset({
          userId: "", // Reset userId explicitly
          ...roleAssignList.reduce((acc, module) => {
            acc[`moduleData_${module.Module_Id}`] = []; // Reset all moduleData fields
            return acc;
          }, {} as Record<string, number[]>), // Use a dynamic type here
        });
        setOpenModuleId([]);
        setSelected([]);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getModuleDataApiCall = async (orgId: number) => {
    try {
      const res = await getModuleDataAPI(orgId);

      if (res.status === 200) {
        dispatch(getModuleData(res.data.details));
      } else {
        dispatch(getModuleData([]));
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      dispatch(getModuleData([]));
    }
  };

  const userId = form.watch("userId");
  const roleAssignListRef = useRef(roleAssignList);
  const roleAssignSingleListRef = useRef(roleAssignSingleList);
  roleAssignListRef.current = roleAssignList;
  roleAssignSingleListRef.current = roleAssignSingleList;

  const moduleKey = [
    ...(roleAssignList || []).map((module) => module.Module_Id),
    ...(roleAssignSingleList || []).map((module) => module.Module_Id),
  ].join(",");

  const [assignedMenus, setAssignedMenus] = useState<AssignedMenuRow[]>([]);
  const assignedForUserRef = useRef("");

  const clearPermissions = () => {
    (roleAssignListRef.current || []).forEach((module) => {
      form.setValue(`moduleData_${module.Module_Id}`, [], {
        shouldDirty: false,
      });
    });
    setSelected([]);
    setOpenModuleId([]);
  };

  const applyAssignedMenus = (rows: AssignedMenuRow[]) => {
    const modules = roleAssignListRef.current || [];
    const singles = roleAssignSingleListRef.current || [];
    const singleIds = new Set(singles.map((module) => String(module.Module_Id)));
    const byModule: Record<string, number[]> = {};

    modules.forEach((module) => {
      byModule[String(module.Module_Id)] = [];
    });

    const selectedSingles: string[] = [];

    rows.forEach((row) => {
      const moduleId = String(row.Module_Id ?? row.module_id ?? "");
      const menuRaw = row.Menue_Id ?? row.menue_id ?? row.menu_id;
      const menuId =
        menuRaw == null || String(menuRaw).trim() === ""
          ? null
          : Number(menuRaw);

      if (!moduleId) return;

      if (menuId == null || !Number.isFinite(menuId) || menuId === 0) {
        if (singleIds.has(moduleId)) selectedSingles.push(moduleId);
        return;
      }

      if (!byModule[moduleId]) byModule[moduleId] = [];
      if (!byModule[moduleId].includes(menuId)) byModule[moduleId].push(menuId);
    });

    const openIds: number[] = [];
    modules.forEach((module) => {
      const ids = byModule[String(module.Module_Id)] ?? [];
      form.setValue(`moduleData_${module.Module_Id}`, ids, {
        shouldDirty: false,
      });
      if (ids.length) openIds.push(module.Module_Id);
    });

    setSelected(selectedSingles);
    setOpenModuleId(openIds);
  };

  useEffect(() => {
    if (!userId) {
      setAssignedMenus([]);
      clearPermissions();
      return;
    }

    const orgId = getCookieData<number | null>("waxCraftClientOrgId");
    if (!orgId) return;

    let cancelled = false;
    assignedForUserRef.current = "";
    clearPermissions();

    (async () => {
      try {
        const res: ApiResponse = await getUserRoleMenuAPI(orgId, userId);
        if (cancelled) return;
        assignedForUserRef.current = String(userId);
        if (res.status === 200 || res.status === 202) {
          setAssignedMenus(normalizeAssignedMenus(res.data?.details));
        } else {
          setAssignedMenus([]);
        }
      } catch {
        if (!cancelled) {
          assignedForUserRef.current = String(userId);
          setAssignedMenus([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || assignedForUserRef.current !== String(userId)) return;
    applyAssignedMenus(assignedMenus);
  }, [userId, assignedMenus, moduleKey]);

  return {
    getModuleDataApiCall,
    form,
    loading,
    handleSubmit,
    roleAssignList,
    roleAssignSingleList,
    openModuleId,
    setOpenModuleId,
    selected,
    setSelected,
  };
};
