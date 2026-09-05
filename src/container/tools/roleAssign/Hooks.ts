"use client";

import { useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@/lib/yupResolver";
import { useDispatch, useSelector } from "react-redux";
import { RoleAssignFormData, ModuleData } from "@/types/tools/RoleAssignTypes";
import { addRoleAssignAPI, getModuleDataAPI } from "./RoleAssignApis";
import { getModuleData } from "./RoleAssignReducer";
import { ApiResponse } from "@/types/ApiTypes";

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
