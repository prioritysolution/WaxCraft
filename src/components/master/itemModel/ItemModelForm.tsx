"use client";

import InputField from "@/common/formFields/InputField";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";
import { Form } from "@/components/ui/form";
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import { ItemCategoryTableData } from "@/types/master/ItemCategoryTypes";
import { ItemModelFormProps } from "@/types/master/ItemModelTypes";
import { FC } from "react";
import { useSelector } from "react-redux";

interface ItemCategoryState {
  itemCategoryData: ItemCategoryTableData[];
}

interface RootState {
  itemCategory: ItemCategoryState;
}

const ItemModelForm: FC<ItemModelFormProps> = ({
  addItemModelLoading,
  updateItemModelLoading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  handleSearchCategory,
  handleScrollCategory,
  getCategoryLoading,
  categoryInput,
  setCategoryInput,
}) => {
  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = addItemModelLoading || updateItemModelLoading;

  const itemCategoryData: ItemCategoryTableData[] = useSelector(
    (state: RootState) => state?.itemCategory?.itemCategoryData
  );

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
            title={isEdit ? "Edit Item Model" : "Add New Item Model"}
            description={
              isEdit
                ? "Update the model details and save your changes."
                : "Select a category and enter the model name."
            }
            isEdit={isEdit}
            onClose={() => setIsOpen(false)}
            isBusy={isBusy}
          />
          <FormModalBody>
            <SearchDropdownField
              label="Category"
              name="categoryId"
              control={form.control}
              options={itemCategoryData || []}
              optionLabelKey="Cat_Name"
              handleSearch={handleSearchCategory}
              loadMore={handleScrollCategory}
              loading={getCategoryLoading}
              input={categoryInput}
              setInput={setCategoryInput}
            />

            <InputField
              control={form.control}
              name="modelName"
              label="Model Name"
            />

            <InputField
              control={form.control}
              name="modelShortName"
              label="Model Short Name"
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
export default ItemModelForm;
