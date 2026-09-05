import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ForgotPasswordFormData } from "@/types/auth/ForgotPasswordTypes";
import { ApiResponse } from "@/types/ApiTypes";
import {
  getForgotPasswordOtpAPI,
  getForgotPasswordVerifyOtpAPI,
  updateForgotPasswordAPI,
} from "./ForgotPasswordApis";

export const useForgotPassword = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);

  // Form validation schema with yup
  const formSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    otp: yup.string().default(""),
    password: yup
      .string()
      .default("")
      .test("password-required", "Password is required", function (value) {
        return currentStep > 1 ? !!value : true; // Required only if globalVar > 1
      }),
    confirmPassword: yup
      .string()
      .default("")
      .test(
        "confirmPassword-required",
        "Confirm password is required",
        function (value) {
          return currentStep > 1 ? !!value : true; // Required only if globalVar > 1
        }
      )
      .oneOf([yup.ref("password"), ""], "Passwords must match"),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<ForgotPasswordFormData> = (values) => {
    if (currentStep === 1) getForgotPasswordOtpApiCall(values);
    else updateForgotPasswordApiCall(values);
  };

  // Function to call the forgotpassword API
  const getForgotPasswordOtpApiCall = async (item: ForgotPasswordFormData) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getForgotPasswordOtpAPI(item.email);

      if (res.status === 200) {
        toast.success(res.data.message);
        setCurrentStep(2);
      } else {
        // Handle the case when forgotpassword fails
        toast.error(res.data.message || "Unknown error");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    if (currentStep === 2) {
      if (form.getValues("otp"))
        getForgotPasswordVerifyOtpApiCall(
          form.getValues("email"),
          form.getValues("otp")
        );
      else toast.error("Please enter otp");
    }
  };

  // Function to call the forgotpassword API
  const getForgotPasswordVerifyOtpApiCall = async (
    email: string,
    otp: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getForgotPasswordVerifyOtpAPI(email, otp);

      if (res.status === 200) {
        toast.success(res.data.message);
        setCurrentStep(3);
      } else {
        // Handle the case when forgotpassword fails
        toast.error(res.data.message || "Unknown error");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Function to call the forgotpassword API
  const updateForgotPasswordApiCall = async (item: ForgotPasswordFormData) => {
    setLoading(true);

    const data = {
      user_mail: item.email,
      user_pass: item.password,
    };

    try {
      const res: ApiResponse = await updateForgotPasswordAPI(data);

      if (res.status === 200) {
        // Reset form and navigate on success
        form.reset();
        toast.success(res.data.message);
        setCurrentStep(1);
        router.push("/login");
      } else {
        // Handle the case when forgotpassword fails
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
    handleSubmit,
    handleVerifyOtp,
    currentStep,
  };
};
