"use client";

import InputField from "@/common/formFields/InputField";
import { Form } from "@/components/ui/form";
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import { ItemUnitFormProps } from "@/types/master/ItemUnitTypes";
import { FC } from "react";

const ItemUnitForm: FC<ItemUnitFormProps> = ({
  addItemUnitLoading,
  updateItemUnitLoading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
}) => {
  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = addItemUnitLoading || updateItemUnitLoading;

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
            title={isEdit ? "Edit Item Unit" : "Add New Item Unit"}
            description={
              isEdit
                ? "Update the unit name and save your changes."
                : "Enter a unit name to add it to the list."
            }
            isEdit={isEdit}
            onClose={() => setIsOpen(false)}
            isBusy={isBusy}
          />
          <FormModalBody>
            <InputField
              control={form.control}
              name="unitName"
              label="Unit Name"
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
export default ItemUnitForm;
