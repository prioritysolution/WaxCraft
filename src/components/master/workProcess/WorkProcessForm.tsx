"use client";

import InputField from "@/common/formFields/InputField";
import { Form } from "@/components/ui/form";
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import { WorkProcessFormProps } from "@/types/master/WorkProcessTypes";
import { FC } from "react";

const WorkProcessForm: FC<WorkProcessFormProps> = ({
  addWorkProcessLoading,
  updateWorkProcessLoading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
}) => {
  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = addWorkProcessLoading || updateWorkProcessLoading;

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      size="sm"
      isBusy={isBusy}
    >
      <Form {...form}>
        <form
          className="flex w-full flex-col"
          autoComplete="off"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormModalHeader
            title={isEdit ? "Edit Work Process" : "Add New Work Process"}
            description={
              isEdit
                ? "Update the process name and step, then save your changes."
                : "Enter a process name and step to add it to the list."
            }
            isEdit={isEdit}
            onClose={() => setIsOpen(false)}
            isBusy={isBusy}
          />
          <FormModalBody>
            <InputField
              control={form.control}
              name="processName"
              label="Process Name"
              required
            />
            <InputField
              control={form.control}
              name="processStep"
              label="Process Step"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              onInput={(e) => {
                const input = e.currentTarget;
                input.value = input.value.replace(/\D/g, "");
                form.setValue("processStep", input.value, {
                  shouldValidate: true,
                });
              }}
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
export default WorkProcessForm;
