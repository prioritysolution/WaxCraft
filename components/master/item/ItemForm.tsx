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
import { ItemSizeTableData } from "@/types/master/ItemSizeTypes";
import { ItemFormProps } from "@/types/master/ItemTypes";
import { ItemUnitTableData } from "@/types/master/ItemUnitTypes";
import { ItemColourTableData } from "@/types/master/ItemColourTypes";
import { FC, useEffect } from "react";
import { useSelector } from "react-redux";

interface LedgerData {
  Id: number;
  Ledger_Name: string;
}

interface ItemCategoryState {
  itemCategoryData: ItemCategoryTableData[];
}

interface ItemUnitState {
  itemUnitData: ItemUnitTableData[];
}

interface ItemModelState {
  itemModelData: ItemModelTableData[];
}

interface ItemSizeState {
  itemSizeData: ItemSizeTableData[];
}

interface ItemColourState {
  itemColourData: ItemColourTableData[];
}

interface ItemState {
  purchaseLedgerData: LedgerData[];
  salesLedgerData: LedgerData[];
}

interface RootState {
  itemCategory: ItemCategoryState;
  itemUnit: ItemUnitState;
  itemModel: ItemModelState;
  itemSize: ItemSizeState;
  itemColour: ItemColourState;
  item: ItemState;
}

const ItemForm: FC<ItemFormProps> = ({
  addItemLoading,
  updateItemLoading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  categoryId,
  modelId,
  sizeId,
  colourId,
  handleSearchCategory,
  handleScrollCategory,
  handleSearchPurchaseLedger,
  handleScrollPurchaseLedger,
  handleSearchSalesLedger,
  handleScrollSalesLedger,
  categoryInput,
  setCategoryInput,
  purchaseLedgerInput,
  setPurchaseLedgerInput,
  salesLedgerInput,
  setSalesLedgerInput,
  getPurchaseLedgerLoading,
  getSalesLedgerLoading,
  getCategoryLoading,
  getModelLoading,
  getSizeLoading,
  getColourLoading,
  getUnitLoading,
}) => {
  const itemCategoryData: ItemCategoryTableData[] = useSelector(
    (state: RootState) => state?.itemCategory?.itemCategoryData
  );

  const itemUnitData: ItemUnitTableData[] = useSelector(
    (state: RootState) => state?.itemUnit?.itemUnitData
  );

  const itemModelData: ItemModelTableData[] = useSelector(
    (state: RootState) => state?.itemModel?.itemModelData
  );

  const itemSizeData: ItemSizeTableData[] = useSelector(
    (state: RootState) => state?.itemSize?.itemSizeData
  );

  const itemColourData: ItemColourTableData[] = useSelector(
    (state: RootState) => state?.itemColour?.itemColourData
  );

  const purchaseLedgerData: LedgerData[] = useSelector(
    (state: RootState) => state?.item?.purchaseLedgerData
  );

  const salesLedgerData: LedgerData[] = useSelector(
    (state: RootState) => state?.item?.salesLedgerData
  );

  useEffect(() => {
    if (!isOpen) return;

    const categoryName = itemCategoryData.find(
      (category) => category.Id.toString() === categoryId
    )?.Cat_Name;

    if (!categoryName) return;

    const colourName =
      itemColourData.find((colour) => colour.Id.toString() === colourId)
        ?.Color_Name ||
      itemColourData.find((colour) => colour.Id.toString() === colourId)
        ?.Colour_Name;

    const newName =
      categoryName +
      (itemModelData.find((model) => model.Id.toString() === modelId)
        ?.Model_Sh_Name
        ? " - " +
          itemModelData.find((model) => model.Id.toString() === modelId)
            ?.Model_Sh_Name
        : "") +
      (itemSizeData.find((size) => size.Id.toString() === sizeId)?.Size_Name
        ? " - " +
          itemSizeData.find((size) => size.Id.toString() === sizeId)?.Size_Name
        : "") +
      (colourName ? " - " + colourName : "");

    form.setValue("itemName", newName);
    form.setValue("itemShortName", newName);
  }, [isOpen, categoryId, modelId, sizeId, colourId, itemColourData]);

  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = addItemLoading || updateItemLoading;

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      size="3xl"
      isBusy={isBusy}
    >
      <Form {...form}>
        <form
          className="flex w-full flex-col"
          autoComplete="off"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormModalHeader
            title={isEdit ? "Edit Item" : "Add New Item"}
            description={
              isEdit
                ? "Update item details and save your changes."
                : "Select category details and enter item information."
            }
            isEdit={isEdit}
            onClose={() => setIsOpen(false)}
            isBusy={isBusy}
          />
          <FormModalBody>
              <div className="grid sm:grid-cols-2 gap-x-5 gap-y-3">
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
                  loading={getCategoryLoading}
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
                  options={itemColourData || []}
                  optionLabelKey="Color_Name"
                  loading={getColourLoading}
                />

                <InputField
                  control={form.control}
                  name="itemName"
                  label="Item Name"
                  disabled={!!modelId}
                />

                <InputField
                  control={form.control}
                  name="itemShortName"
                  label="Item Short Name"
                  disabled={!!modelId}
                />

                <DropdownField
                  label="Unit"
                  name="unitId"
                  control={form.control}
                  options={itemUnitData || []}
                  optionLabelKey="Unit_Name"
                  loading={getUnitLoading}
                />

                <SearchDropdownField
                  label="Purchase Ledger"
                  name="purchaseLedgerId"
                  control={form.control}
                  options={purchaseLedgerData || []}
                  optionLabelKey="Ledger_Name"
                  handleSearch={handleSearchPurchaseLedger}
                  loadMore={handleScrollPurchaseLedger}
                  input={purchaseLedgerInput}
                  setInput={setPurchaseLedgerInput}
                  loading={getPurchaseLedgerLoading}
                />

                <SearchDropdownField
                  label="Sales Ledger"
                  name="salesLedgerId"
                  control={form.control}
                  options={salesLedgerData || []}
                  optionLabelKey="Ledger_Name"
                  handleSearch={handleSearchSalesLedger}
                  loadMore={handleScrollSalesLedger}
                  input={salesLedgerInput}
                  setInput={setSalesLedgerInput}
                  loading={getSalesLedgerLoading}
                />

                <InputField
                  control={form.control}
                  name="cgst"
                  label="CGST"
                  type="number"
                />

                <InputField
                  control={form.control}
                  name="sgst"
                  label="SGST"
                  type="number"
                />

                <InputField
                  control={form.control}
                  name="igst"
                  label="IGST"
                  type="number"
                />

                <InputField
                  control={form.control}
                  name="purchaseRate"
                  label="Purchase Rate"
                  type="number"
                />

                <InputField
                  control={form.control}
                  name="salesRate"
                  label="Sales Rate"
                  type="number"
                />

                <InputField
                  control={form.control}
                  name="openingQuantity"
                  label="Opening Quantity"
                  type="number"
                />

                <InputField
                  control={form.control}
                  name="openingRate"
                  label="Opening Rate"
                  type="number"
                />

                <InputField
                  control={form.control}
                  name="total"
                  label="Total"
                  disabled
                />
              </div>
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
export default ItemForm;
