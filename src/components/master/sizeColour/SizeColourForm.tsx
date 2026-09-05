"use client";

import DropdownField from "@/common/formFields/DropdownField";
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
import { ItemSizeTableData } from "@/types/master/ItemSizeTypes";
import { SizeColourFormProps } from "@/types/master/SizeColourTypes";
import { FC } from "react";
import { useSelector } from "react-redux";

interface ItemCategoryState {
  itemCategoryData: ItemCategoryTableData[];
}

interface ItemModelState {
  itemModelData: ItemModelTableData[];
}

interface ItemSizeState {
  itemSizeData: ItemSizeTableData[];
}

interface RootState {
  itemCategory: ItemCategoryState;
  itemModel: ItemModelState;
  itemSize: ItemSizeState;
}

const SizeColourForm: FC<SizeColourFormProps> = ({
  addSizeColourLoading,
  updateSizeColourLoading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  categoryId,
  modelId,
  handleSearchCategory,
  handleScrollCategory,
  getCategoryLoading,
  getModelLoading,
  getSizeLoading,
  categoryInput,
  setCategoryInput,
  colourOptions,
  getColourLoading,
}) => {
  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = addSizeColourLoading || updateSizeColourLoading;

  const itemCategoryData: ItemCategoryTableData[] = useSelector(
    (state: RootState) => state?.itemCategory?.itemCategoryData
  );

  const itemModelData: ItemModelTableData[] = useSelector(
    (state: RootState) => state?.itemModel?.itemModelData
  );

  const itemSizeData: ItemSizeTableData[] = useSelector(
    (state: RootState) => state?.itemSize?.itemSizeData
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
            title={isEdit ? "Edit Size Colour" : "Add New Size Colour"}
            description={
              isEdit
                ? "Update colour details and save your changes."
                : "Select category, model, size, and colour."
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

            <DropdownField
              label="Model"
              name="modelId"
              control={form.control}
              options={categoryId && itemModelData ? itemModelData : []}
              optionLabelKey="Model_Name"
              loading={getModelLoading}
            />

            <DropdownField
              label="Size"
              name="sizeId"
              control={form.control}
              options={modelId && itemSizeData ? itemSizeData : []}
              optionLabelKey="Size_Name"
              loading={getSizeLoading}
            />

            <DropdownField
              label="Colour"
              name="colourId"
              control={form.control}
              options={colourOptions || []}
              optionLabelKey="Color_Name"
              loading={getColourLoading}
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
export default SizeColourForm;
