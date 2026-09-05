"use client";

import InputField from "@/common/formFields/InputField";
import { Form } from "@/components/ui/form";
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import { ItemColourFormProps } from "@/types/master/ItemColourTypes";
import { FC } from "react";

const ItemColourForm: FC<ItemColourFormProps> = ({
  addItemColourLoading,
  updateItemColourLoading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
}) => {
  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = addItemColourLoading || updateItemColourLoading;

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
            title={isEdit ? "Edit Item Colour" : "Add New Item Colour"}
            description={
              isEdit
                ? "Update the colour name and save your changes."
                : "Enter a colour name to add it to the list."
            }
            isEdit={isEdit}
            onClose={() => setIsOpen(false)}
            isBusy={isBusy}
          />
          <FormModalBody>
            <InputField
              control={form.control}
              name="colourName"
              label="Colour Name"
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

export default ItemColourForm;
