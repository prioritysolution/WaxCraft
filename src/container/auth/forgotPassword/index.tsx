"use client";

import { FC } from "react";

import { useForgotPassword } from "./Hooks";
import ForgotPassword from "@/components/auth/forgotPassword"; // Adjust this import as necessary

const ForgotPasswordContainer: FC = () => {
  const { form, loading, handleSubmit, handleVerifyOtp, currentStep } =
    useForgotPassword();

  return (
    <ForgotPassword
      form={form}
      loading={loading}
      handleSubmit={handleSubmit}
      handleVerifyOtp={handleVerifyOtp}
      currentStep={currentStep}
    />
  );
};

export default ForgotPasswordContainer;
