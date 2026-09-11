"use client";

import DropdownField from "@/common/formFields/DropdownField";
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
import { ItemModelTableData } from "@/types/master/ItemModelTypes";
import { ItemSizeFormProps } from "@/types/master/ItemSizeTypes";
import { FC } from "react";
import { useSelector } from "react-redux";

interface ItemCategoryState {
  itemCategoryData: ItemCategoryTableData[];
}

interface ItemModelState {
  itemModelData: ItemModelTableData[];
}

interface RootState {
  itemCategory: ItemCategoryState;
  itemModel: ItemModelState;
}

const ItemSizeForm: FC<ItemSizeFormProps> = ({
  addItemSizeLoading,
  updateItemSizeLoading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  categoryId,
  handleSearchCategory,
  handleScrollCategory,
  categoryInput,
  setCategoryInput,
  getItemCategoryLoading,
  getItemModelLoading,
}) => {
  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = addItemSizeLoading || updateItemSizeLoading;

  const itemCategoryData: ItemCategoryTableData[] = useSelector(
    (state: RootState) => state?.itemCategory?.itemCategoryData
  );

  const itemModelData: ItemModelTableData[] = useSelector(
    (state: RootState) => state?.itemModel?.itemModelData
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
            title={isEdit ? "Edit Item Size" : "Add New Item Size"}
            description={
              isEdit
                ? "Update category, model, and size, then save."
                : "Choose a category and model, then enter the size."
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
              input={categoryInput}
              setInput={setCategoryInput}
              loading={getItemCategoryLoading}
            />

            <DropdownField
              label="Model"
              name="modelId"
              control={form.control}
              options={categoryId && itemModelData ? itemModelData : []}
              optionLabelKey="Model_Name"
              loading={getItemModelLoading}
            />

            <InputField control={form.control} name="size" label="Size" />
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
export default ItemSizeForm;
