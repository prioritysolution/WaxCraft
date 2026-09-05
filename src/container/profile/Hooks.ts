import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ApiResponse } from "@/types/ApiTypes";
import { getUserProfileAPI, updateProfileAPI } from "./ProfileApis";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@/lib/yupResolver";
import { ProfileFormData } from "@/types/ProfileTypes";
import getCookieData from "@/utils/getCookieData";
import Cookies from "js-cookie";

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);
  const hasLoadedProfile = useRef(false);

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState("");
  const [userMobile, setUserMobile] = useState("");

  const formSchema = yup.object({
    name: yup.string().required("Employee Type is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    mobile: yup.string().required("Address is required"),
    role: yup.string().required("Role required"),
    roleId: yup.string().default(""),
    password: yup.string().default(""),
    confirmPassword: yup
      .string()
      .default("")
      .test("passwords-match", "Passwords must match", function (value) {
        const { password } = this.parent;
        if (password) {
          return value === password;
        }
        return true;
      }),
  });

  const form = useForm<ProfileFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      role: "",
      roleId: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { password } = form.watch();

  const getUserProfileApiCall = useCallback(
    async (force = false) => {
      setLoading(true);

      try {
        const res: ApiResponse = await getUserProfileAPI({ force });

        if (res.status === 200) {
          form.setValue("name", res.data.details[0]?.User_Name);
          form.setValue("email", res.data.details[0]?.User_Mail);
          form.setValue("mobile", res.data.details[0]?.User_Mob);
          form.setValue("role", res.data.details[0]?.Role_Name);
          form.setValue("roleId", res.data.details[0]?.Role_Id);

          setUserId(res.data.details[0]?.Id);
          setUserName(res.data.details[0]?.User_Name);
          setUserMobile(res.data.details[0]?.User_Mob);

          if (res.data.details[0]?.User_Name) {
            Cookies.set("waxCraftClientUserName", res.data.details[0].User_Name, {
              expires: 7,
              secure: process.env.NODE_ENV === "production",
              sameSite: "Strict",
              path: "/",
            });
          }
        } else {
          toast.error(res.data.message || "Unknown error");
        }
      } catch (err) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [form],
  );

  const handleSubmit: SubmitHandler<ProfileFormData> = (values) => {
    if (orgId) {
      updateProfileApiCall(userId, values, orgId);
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const updateProfileApiCall = async (
    userId: number,
    item: ProfileFormData,
    orgId: number,
  ) => {
    const data = {
      org_id: orgId,
      user_id: userId,
      user_name: item.name,
      user_mail: item.email,
      user_mob: item.mobile,
      user_pass: item.password || null,
      user_role: item.roleId,
    };

    setUpdateProfileLoading(true);
    try {
      const res = await updateProfileAPI(data);
      if (res.status === 200) {
        toast.success(res.data.message);
        getUserProfileApiCall(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdateProfileLoading(false);
    }
  };

  useEffect(() => {
    if (hasLoadedProfile.current) return;

    const token = getCookieData<string | null>("waxCraftClientToken");
    const cookieOrgId = getCookieData<number | null>("waxCraftClientOrgId");
    if (!token || !cookieOrgId) return;

    hasLoadedProfile.current = true;
    getUserProfileApiCall();
  }, [getUserProfileApiCall]);

  useEffect(() => {
    form.trigger("confirmPassword");
  }, [password]);

  return {
    loading,
    updateProfileLoading,
    form,
    handleSubmit,
    userName,
    userMobile,
  };
};
