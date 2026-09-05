import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { LoginFormData } from "@/types/auth/LoginTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { addLoginAPI } from "./LoginApis";
import { format } from "date-fns";

export const useLogin = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [afterLoginLoading, setAfterLoginLoading] = useState(false);

  // Form validation schema with yup
  const formSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<LoginFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<LoginFormData> = (data) => {
    addLoginApiCall(data);
  };

  // Function to call the login API
  const addLoginApiCall = async (item: LoginFormData) => {
    setLoading(true);

    const data = {
      ...item,
      date: format(new Date(), "yyyy-MM-dd"),
    };

    try {
      const res: ApiResponse = await addLoginAPI(data);

      if (res.status === 200) {
        // Reset form and navigate on success
        form.reset();
        setAfterLoginLoading(true);
        toast.success(res.data.message);

        // Save the token in a cookie with secure settings
        Cookies.set("waxCraftClientToken", res.data.token, {
          expires: 7, // 1 day expiration
          secure: process.env.NODE_ENV === "production", // Secure cookies in production
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });

        Cookies.set("waxCraftClientOrgId", res.data.org_id, {
          expires: 7, // 1 day expiration
          secure: process.env.NODE_ENV === "production", // Secure cookies in production
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("waxCraftClientOrgName", res.data.Org_Name, {
          expires: 7, // 1 day expiration
          secure: process.env.NODE_ENV === "production", // Secure cookies in production
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("waxCraftClientOrgAddress", res.data.Org_Add, {
          expires: 7, // 1 day expiration
          secure: process.env.NODE_ENV === "production", // Secure cookies in production
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("waxCraftClientOrgMobile", res.data.Org_Mob, {
          expires: 7, // 1 day expiration
          secure: process.env.NODE_ENV === "production", // Secure cookies in production
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("waxCraftClientOrgGst", res.data.Org_Gst, {
          expires: 7, // 1 day expiration
          secure: process.env.NODE_ENV === "production", // Secure cookies in production
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("waxCraftClientOrgPan", res.data.Org_Pan, {
          expires: 7, // 1 day expiration
          secure: process.env.NODE_ENV === "production", // Secure cookies in production
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("waxCraftClientFinStartDate", res.data.Fin_Start, {
          expires: 7, // 1 day expiration
          secure: process.env.NODE_ENV === "production", // Secure cookies in production
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("waxCraftClientFinEndDate", res.data.Fin_End, {
          expires: 7, // 1 day expiration
          secure: process.env.NODE_ENV === "production", // Secure cookies in production
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("waxCraftClientFinId", res.data.Fin_Id, {
          expires: 7, // 1 day expiration
          secure: process.env.NODE_ENV === "production", // Secure cookies in production
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });

        const userName =
          res.data.User_Name || res.data.user_name || res.data.name || "";
        if (userName) {
          Cookies.set("waxCraftClientUserName", userName, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            path: "/",
          });
        }

        router.push("/dashboard");
      } else {
        // Handle the case when login fails
        toast.error(res.data.message || "Unknown error");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    afterLoginLoading,
    handleSubmit,
  };
};
