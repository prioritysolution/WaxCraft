"use client";

import { FC, useState } from "react";
import { Button, Link } from "@heroui/react";
import { IoEye, IoEyeOff } from "react-icons/io5";

import InputField from "@/common/formFields/InputField";
import { Form } from "@/components/ui/form";
import { ForgotPasswordProps } from "@/types/auth/ForgotPasswordTypes";
import { FaCheckCircle } from "react-icons/fa";

const ForgotPassword: FC<ForgotPasswordProps> = ({
  loading,
  form,
  handleSubmit,
  handleVerifyOtp,
  currentStep,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center px-4 py-8"
      style={{
        backgroundImage: `url('/waxcraft.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-[#2A2118]/70 backdrop-blur-[3px]" />

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="mb-6 flex flex-col items-center text-center text-white">
          <div className="mb-4 overflow-hidden rounded-2xl border border-white/15 bg-black shadow-lg">
            <img
              src="/wax_craft_logo.jpeg"
              alt="WaxCraft"
              className="h-[108px] w-[108px] object-contain sm:h-[120px] sm:w-[120px]"
            />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {currentStep === 1 ? "Reset your password" : "Set a new password"}
          </h1>
          <p className="mt-1 text-sm text-white/70">
            {currentStep === 1
              ? "Enter the email linked to your WaxCraft account"
              : "Verify the OTP and choose a new password"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur sm:p-7">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex w-full flex-col gap-4"
              autoComplete="off"
            >
              {currentStep === 1 ? (
                <InputField control={form.control} name="email" label="Email" />
              ) : (
                <>
                  <div className="flex w-full items-end gap-3">
                    <InputField
                      control={form.control}
                      name="otp"
                      label="OTP"
                      disabled={currentStep === 3}
                      className="w-full"
                    />
                    <Button
                      color="success"
                      radius="md"
                      size="lg"
                      variant="flat"
                      className="h-11 w-11 min-w-11 self-end text-xl"
                      isDisabled={currentStep === 3}
                      onPress={handleVerifyOtp}
                      isIconOnly
                      aria-label="Verify OTP"
                    >
                      <FaCheckCircle />
                    </Button>
                  </div>

                  <InputField
                    control={form.control}
                    name="password"
                    type={isPasswordVisible ? "text" : "password"}
                    label="Password"
                    endContent={
                      <button
                        aria-label="toggle password visibility"
                        className="focus:outline-none"
                        type="button"
                        onClick={togglePasswordVisibility}
                      >
                        {isPasswordVisible ? (
                          <IoEyeOff className="pointer-events-none text-xl text-default-400" />
                        ) : (
                          <IoEye className="pointer-events-none text-xl text-default-400" />
                        )}
                      </button>
                    }
                  />

                  <InputField
                    control={form.control}
                    name="confirmPassword"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    label="Confirm Password"
                    endContent={
                      <button
                        aria-label="toggle password visibility"
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {isConfirmPasswordVisible ? (
                          <IoEyeOff className="pointer-events-none text-xl text-default-400" />
                        ) : (
                          <IoEye className="pointer-events-none text-xl text-default-400" />
                        )}
                      </button>
                    }
                  />
                </>
              )}

              <Link
                showAnchorIcon
                color="primary"
                href="/login"
                className="self-end text-sm"
              >
                Back to Login
              </Link>

              <Button
                type="submit"
                color="primary"
                radius="md"
                size="lg"
                className="mt-1 h-11 w-full bg-primary text-sm font-medium text-white"
                isLoading={loading}
                isDisabled={loading || currentStep === 2}
              >
                {currentStep === 1 ? "Next" : "Submit"}
              </Button>
            </form>
          </Form>
        </div>

        <p className="mt-6 text-center text-xs text-white/70">
          Designed and Developed by{" "}
          <Link
            href="https://prioritysolutions.in/"
            target="_blank"
            className="text-xs text-primary"
          >
            Priority Solutions
          </Link>
        </p>
      </div>
    </div>
  );
};
export default ForgotPassword;
