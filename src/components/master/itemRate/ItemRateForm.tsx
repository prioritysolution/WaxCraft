"use client";

import InputField from "@/common/formFields/InputField";
import { Form } from "@/components/ui/form";
import {
  formActionsClassName,
  formGridClassName,
  formSubmitButtonClassName,
  pageFormClassName,
} from "@/lib/uiStyles";
import { ItemRateFormProps } from "@/types/master/ItemRateTypes";
import { Button } from "@heroui/react";
import { FC } from "react";
import { useSelector } from "react-redux";
import { ItemTableData } from "@/types/master/ItemTypes";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";

interface ItemState {
  itemData: ItemTableData[];
}

interface RootState {
  item: ItemState;
}

const ItemRateForm: FC<ItemRateFormProps> = ({
  addItemRateLoading,
  form,
  handleSubmit,
  handleSearchItem,
  handleScrollItem,
  itemInput,
  setItemInput,
  getItemLoading,
}) => {
  const itemData: ItemTableData[] = useSelector(
    (state: RootState) => state?.item?.itemData
  );

  return (
    <Form {...form}>
      <form
        className={pageFormClassName}
        autoComplete="off"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className={formGridClassName}>
          <SearchDropdownField
            label="Item"
            name="itemId"
            control={form.control}
            options={itemData || []}
            optionLabelKey="Item_Name"
            handleSearch={handleSearchItem}
            loadMore={handleScrollItem}
            input={itemInput}
            setInput={setItemInput}
            loading={getItemLoading}
          />

          <InputField
            control={form.control}
            name="previousRate"
            label="Previous Rate"
            disabled
          />

          <InputField
            control={form.control}
            name="currentRate"
            label="Current Rate"
            type="number"
          />
        </div>

        <div className={formActionsClassName}>
          <Button
            type="submit"
            color="primary"
            size="md"
            radius="md"
            className={formSubmitButtonClassName}
            isLoading={addItemRateLoading}
            isDisabled={addItemRateLoading}
          >
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default ItemRateForm;
