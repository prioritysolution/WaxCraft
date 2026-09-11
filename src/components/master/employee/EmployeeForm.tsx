"use client";

import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import TextareaField from "@/common/formFields/TextareaField";
import { Form } from "@/components/ui/form";
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import { EmployeeFormProps } from "@/types/master/EmployeeTypes";
import { FC } from "react";

const EmployeeForm: FC<EmployeeFormProps> = ({
  addEmployeeLoading,
  updateEmployeeLoading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
}) => {
  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = addEmployeeLoading || updateEmployeeLoading;

  const employeeTypeData = [
    {
      Id: 1,
      Value: "Permanent",
    },
    {
      Id: 2,
      Value: "Casual",
    },
    {
      Id: 3,
      Value: "Contactual",
    },
  ];

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
            title={isEdit ? "Edit Employee" : "Add New Employee"}
            description={
              isEdit
                ? "Update employee details and save your changes."
                : "Fill in the employee details to add them."
            }
            isEdit={isEdit}
            onClose={() => setIsOpen(false)}
            isBusy={isBusy}
          />
          <FormModalBody>
            <DropdownField
              label="Employee Type"
              name="employeeType"
              control={form.control}
              options={employeeTypeData || []}
            />

            <InputField
              control={form.control}
              name="employeeName"
              label="Employee Name"
            />

            <TextareaField
              control={form.control}
              name="address"
              label="Address"
            />

            <InputField
              control={form.control}
              name="mobileNo"
              label="Mobile"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              onInput={(e) => {
                const input = e.currentTarget;
                input.value = input.value.replace(/\D/g, "").slice(0, 10);
                form.setValue("mobileNo", input.value, { shouldValidate: true });
              }}
            />

            <InputField control={form.control} name="email" label="Email" />
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
export default EmployeeForm;
