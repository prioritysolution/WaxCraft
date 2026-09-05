"use client";

import InputField from "@/common/formFields/InputField";
import { Form } from "@/components/ui/form";
import { formActionsClassName, primaryButtonClassName } from "@/lib/uiStyles";
import { cn } from "@/lib/utils";
import { ProfileFormProps } from "@/types/ProfileTypes";
import { Button, Spinner } from "@heroui/react";
import { LockKeyhole, Mail, Phone, Shield, UserRound } from "lucide-react";
import { FC, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

const ProfileForm: FC<ProfileFormProps> = ({
  updateProfileLoading,
  form,
  handleSubmit,
  userName,
  userMobile,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const watchedName = form.watch("name");
  const watchedMobile = form.watch("mobile");
  const watchedPassword = form.watch("password");

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  return (
    <Form {...form}>
      <form
        className="flex h-full w-full flex-col gap-6 pb-2"
        autoComplete="off"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="space-y-3">
          <div>
            <h2 className="text-[15px] font-semibold text-foreground">
              Account details
            </h2>
            <p className="text-sm text-muted-foreground">
              Name and mobile can be updated. Email and role stay the same.
            </p>
          </div>
          <div className="grid w-full items-start gap-x-5 gap-y-3 xs:grid-cols-2 lg:grid-cols-3">
            <InputField
              control={form.control}
              name="name"
              label="Name"
              startContent={
                <UserRound className="h-4 w-4 text-muted-foreground" />
              }
            />

            <InputField
              control={form.control}
              name="email"
              label="Email"
              disabled
              startContent={
                <Mail className="h-4 w-4 text-muted-foreground" />
              }
            />

            <InputField
              control={form.control}
              name="mobile"
              label="Mobile"
              startContent={
                <Phone className="h-4 w-4 text-muted-foreground" />
              }
            />

            <InputField
              control={form.control}
              name="role"
              label="Role"
              disabled
              startContent={
                <Shield className="h-4 w-4 text-muted-foreground" />
              }
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="text-[15px] font-semibold text-foreground">
              Password
            </h2>
            <p className="text-sm text-muted-foreground">
              Leave blank to keep your current password.
            </p>
          </div>
          <div className="grid w-full items-start gap-x-5 gap-y-3 xs:grid-cols-2 lg:grid-cols-3">
            <InputField
              control={form.control}
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              label="Password"
              startContent={
                <LockKeyhole className="h-4 w-4 text-muted-foreground" />
              }
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? (
                    <IoEyeOff className="pointer-events-none text-2xl text-default-400" />
                  ) : (
                    <IoEye className="pointer-events-none text-2xl text-default-400" />
                  )}
                </button>
              }
            />

            <InputField
              control={form.control}
              name="confirmPassword"
              type={isConfirmPasswordVisible ? "text" : "password"}
              label="Confirm Password"
              startContent={
                <LockKeyhole className="h-4 w-4 text-muted-foreground" />
              }
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {isConfirmPasswordVisible ? (
                    <IoEyeOff className="pointer-events-none text-2xl text-default-400" />
                  ) : (
                    <IoEye className="pointer-events-none text-2xl text-default-400" />
                  )}
                </button>
              }
            />
          </div>
        </div>
        <div className={formActionsClassName}>
          <Button
            type="submit"
            color="primary"
            size="md"
            radius="md"
            className={cn(primaryButtonClassName, "w-auto")}
            isDisabled={
              updateProfileLoading ||
              (userName === watchedName &&
                userMobile === watchedMobile &&
                !watchedPassword)
            }
            isLoading={updateProfileLoading}
            spinner={<Spinner size="sm" color="current" />}
          >
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default ProfileForm;
