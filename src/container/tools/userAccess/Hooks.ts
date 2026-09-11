import * as yup from "yup";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch, useSelector } from "react-redux";
import { ApiResponse } from "@/types/ApiTypes";
import { getUserAccessAPI, updateUserAccessAPI } from "./UserAccessApis";
import { getUserAccessData } from "./UserAccessReducer";
import {
  UserAccessFormData,
  UserAccessTableData,
} from "@/types/tools/UserAccessTypes";
import { yupResolver } from "@/lib/yupResolver";
import { useForm } from "react-hook-form";

interface UserAccessState {
  userAccessData: UserAccessTableData[];
}

interface RootState {
  userAccess: UserAccessState;
}

export const useUserAccess = () => {
  const dispatch = useDispatch();

  const [getUserAccessLoading, setGetUserAccessLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);

  const userAccessData: UserAccessTableData[] = useSelector(
    (state: RootState) => state?.userAccess?.userAccessData
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  // Define Yup Schema (ensure strict boolean values)
  const formSchema = yup.object({
    access: yup.lazy((obj) =>
      yup.object(
        Object.fromEntries(
          Object.keys(obj || {}).map((key) => [
            key,
            yup.boolean().default(false),
          ])
        )
      )
    ),
  });

  // Initialize the form with react-hook-form
  const form = useForm<UserAccessFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      access: Object.fromEntries(
        userAccessData.map((item) => [item.Id, item.Status === 1])
      ),
    },
  });

  // Handle form submission
  const handleToggleAccess = (id: number) => {
    updateUserAccessApiCall(id, form.getValues("access")[id]);
  };

  const updateUserAccessApiCall = async (userId: number, value: boolean) => {
    setGetUserAccessLoading(true);

    const data = {
      user_id: userId,
      status: value ? 1 : 0,
    };

    try {
      const res: ApiResponse = await updateUserAccessAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        if (orgId) getUserAccessApiCall(orgId);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setGetUserAccessLoading(false);
    }
  };

  const getUserAccessApiCall = async (orgId: number) => {
    setGetUserAccessLoading(true);

    try {
      const res: ApiResponse = await getUserAccessAPI(orgId);

      if (res.status === 200) {
        dispatch(getUserAccessData(res.data.details));
      } else {
        dispatch(getUserAccessData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getUserAccessData([]));
    } finally {
      setGetUserAccessLoading(false);
    }
  };

  return {
    getUserAccessLoading,
    form,
    handleToggleAccess,
    getUserAccessApiCall,
  };
};
