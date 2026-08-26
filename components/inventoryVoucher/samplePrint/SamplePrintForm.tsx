"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import InputField from "@/common/formFields/InputField";
import RadioField from "@/common/formFields/RadioFields";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";
import TextareaField from "@/common/formFields/TextareaField";
import { Form } from "@/components/ui/form";
import {
  pageFormClassName,
  formGridClassName,
} from "@/lib/uiStyles";
import { SamplePrintFormProps } from "@/types/inventoryVoucher/SamplePrintTypes";
import { Button } from "@heroui/react";
import { FC, FormEvent } from "react";
import { useSelector } from "react-redux";

interface OrderPartyData {
  Id: number;
  Party_Name: string;
}

interface OrderDesignData {
  Id: number;
  Design_Name: string;
}

interface OrderBookingState {
  orderPartyData: OrderPartyData[];
  orderDesignData: OrderDesignData[];
}

interface RootState {
  orderBooking: OrderBookingState;
}

const SamplePrintForm: FC<SamplePrintFormProps> = ({
  form,
  handleSubmit,
  addSamplePrintLoading,
  handleSearchOrderParty,
  handleScrollOrderParty,
  handleSearchOrderDesign,
  handleScrollOrderDesign,
  orderPartyInput,
  setOrderPartyInput,
  orderDesignInput,
  setOrderDesignInput,
}) => {
  const orderPartyData: OrderPartyData[] = useSelector(
    (state: RootState) => state?.orderBooking?.orderPartyData
  );

  const orderDesignData: OrderDesignData[] = useSelector(
    (state: RootState) => state?.orderBooking?.orderDesignData
  );

  const handleStopPropagation = (e: FormEvent) => {
    e.stopPropagation();
  };

  return (
    <Form {...form}>
      <form
        className={pageFormClassName}
        autoComplete="off"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className={formGridClassName}>
          <div onFocus={handleStopPropagation}>
            <DatePickerField
              control={form.control}
              name="printDate"
              label="Print date"
              startYear={2000}
              endYear={2050}
            />
          </div>

          <SearchDropdownField
            label="Party"
            name="partyId"
            control={form.control}
            options={orderPartyData || []}
            optionLabelKey="Party_Name"
            handleSearch={handleSearchOrderParty}
            loadMore={handleScrollOrderParty}
            input={orderPartyInput}
            setInput={setOrderPartyInput}
          />

          <TextareaField
            control={form.control}
            name="address"
            label="Address"
            disabled
          />

          <InputField
            control={form.control}
            name="mobileNo"
            label="Mobile"
            disabled
          />

          <InputField
            control={form.control}
            name="gstin"
            label="GSTIN"
            disabled
          />

          <RadioField
            control={form.control}
            name="itemType"
            options={[
              {
                value: "1",
                label: "Is Own Item",
              },
              {
                value: "0",
                label: "Is Party Item",
              },
            ]}
            className="border-0 bg-transparent px-0 py-0 rounded-none"
            label="Item Type"
            orientation="horizontal"
          />

          <SearchDropdownField
            label="Design"
            name="designId"
            control={form.control}
            options={orderDesignData || []}
            optionLabelKey="Design_Name"
            handleSearch={handleSearchOrderDesign}
            loadMore={handleScrollOrderDesign}
            input={orderDesignInput}
            setInput={setOrderDesignInput}
          />
        </div>
        <div className="flex w-full justify-end">
          <Button
            type="submit"
            color="primary"
            size="lg"
            radius="sm"
            className="w-auto min-w-[148px]"
            isLoading={addSamplePrintLoading}
            isDisabled={addSamplePrintLoading}
          >
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default SamplePrintForm;
