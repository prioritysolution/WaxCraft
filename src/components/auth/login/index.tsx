"use client";

import { FC, useState } from "react";
import { Button, Link, Spinner } from "@heroui/react";
import { IoEye, IoEyeOff } from "react-icons/io5";

import InputField from "@/common/formFields/InputField";
import { Form } from "@/components/ui/form";
import { LoginProps } from "@/types/auth/LoginTypes";

const Login: FC<LoginProps> = ({
  loading,
  afterLoginLoading,
  form,
  handleSubmit,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  if (afterLoginLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-secondary">
        <Spinner size="lg" color="primary" />
      </div>
    );

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
            Welcome to WaxCraft
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Sign in to continue to your workspace
          </p>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur sm:p-7">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex w-full flex-col gap-4"
              autoComplete="off"
            >
              <InputField control={form.control} name="email" label="Email" />

              <InputField
                control={form.control}
                name="password"
                type={isVisible ? "text" : "password"}
                label="Password"
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <IoEyeOff className="pointer-events-none text-xl text-default-400" />
                    ) : (
                      <IoEye className="pointer-events-none text-xl text-default-400" />
                    )}
                  </button>
                }
              />

              <Link
                showAnchorIcon
                color="primary"
                href="/forgotPassword"
                className="self-end text-sm"
              >
                Forgot Password
              </Link>

              <Button
                type="submit"
                color="primary"
                radius="md"
                size="lg"
                className="mt-1 h-11 w-full bg-primary text-sm font-medium text-white"
                isLoading={loading}
                isDisabled={loading}
              >
                Login
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
export default Login;
