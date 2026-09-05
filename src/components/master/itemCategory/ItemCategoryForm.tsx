"use client";

import InputField from "@/common/formFields/InputField";
import { Form } from "@/components/ui/form";
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import { ItemCategoryFormProps } from "@/types/master/ItemCategoryTypes";
import { FC } from "react";

const ItemCategoryForm: FC<ItemCategoryFormProps> = ({
  addItemCategoryLoading,
  updateItemCategoryLoading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
}) => {
  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = addItemCategoryLoading || updateItemCategoryLoading;

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
            title={isEdit ? "Edit Category" : "Add Category"}
            description={
              isEdit
                ? "Update the category name and save your changes."
                : "Enter a name to create a new item category."
            }
            isEdit={isEdit}
            onClose={() => setIsOpen(false)}
            isBusy={isBusy}
          />

          <FormModalBody>
            <InputField
              control={form.control}
              name="categoryName"
              label="Category Name"
              placeholder="Enter category name"
              disabled={isBusy}
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

export default ItemCategoryForm;
