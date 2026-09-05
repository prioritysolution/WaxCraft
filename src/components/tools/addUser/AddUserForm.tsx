"use client";

import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import { Form } from "@/components/ui/form";
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import { AddUserFormProps } from "@/types/tools/AddUserTypes";
import { FC, useEffect, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useSelector } from "react-redux";

interface UserRoleData {
  Id: number;
  Role_Name: string;
}

interface AddUserState {
  userRolesData: UserRoleData[];
}

interface RootState {
  addUser: AddUserState;
}

const AddUserForm: FC<AddUserFormProps> = ({
  isOpen,
  setIsOpen,
  editData,
  addUserLoading,
  updateUserLoading,
  form,
  handleSubmit,
  getRolesLoading,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    if (!isOpen) setIsVisible(false);
  }, [isOpen]);

  const userRolesData: UserRoleData[] = useSelector(
    (state: RootState) => state?.addUser?.userRolesData
  );

  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = addUserLoading || updateUserLoading;

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      size="md"
      isBusy={isBusy}
    >
      <Form {...form}>
        <form
          className="flex w-full flex-col"
          autoComplete="off"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormModalHeader
            title={isEdit ? "Edit User" : "Add New User"}
            description={
              isEdit
                ? "Update user details and save your changes."
                : "Enter user details and choose a role."
            }
            isEdit={isEdit}
            onClose={() => setIsOpen(false)}
            isBusy={isBusy}
          />
          <FormModalBody>
              <InputField control={form.control} name="name" label="Name" />

              <InputField
                control={form.control}
                name="email"
                label="Email"
                type="email"
                inputMode="email"
                placeholder="name@example.com"
              />

              <InputField
                control={form.control}
                name="mobile"
                label="Mobile"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                placeholder="10-digit mobile number"
                onInput={(e) => {
                  const input = e.currentTarget;
                  input.value = input.value.replace(/\D/g, "").slice(0, 10);
                  form.setValue("mobile", input.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              />

              <DropdownField
                label="Role"
                name="role"
                control={form.control}
                options={userRolesData || []}
                optionLabelKey="Role_Name"
                loading={getRolesLoading}
              />

              <InputField
                control={form.control}
                name="password"
                type={isVisible ? "text" : "password"}
                label="Password"
                required={!isEdit}
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <IoEyeOff className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <IoEye className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
          </FormModalBody>
          <FormModalFooter
            isBusy={isBusy}
            onCancel={() => setIsOpen(false)}
            submitLabel={isEdit ? "Save" : "Add"}
          />
        </form>
      </Form>
    </FormModal>
  );
};
export default AddUserForm;
