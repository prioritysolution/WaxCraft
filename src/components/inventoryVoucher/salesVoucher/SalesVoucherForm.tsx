"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import { Form } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  formActionsClassName,
  formGridClassName,
  formSubmitButtonClassName,
  formTitleClassName,
  pageFormClassName,
} from "@/lib/uiStyles";
import { SalesVoucherFormProps } from "@/types/inventoryVoucher/SalesVoucherTypes";
import { Button, Divider } from "@heroui/react";
import { FC } from "react";
import SalesVoucherTable from "./SalesVoucherTable";
import RadioField from "@/common/formFields/RadioFields";
import InputField from "@/common/formFields/InputField";
import { useSelector } from "react-redux";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";

interface OrderPartyData {
  Id: number;
  Party_Name: string;
}

interface OrderBookingState {
  orderPartyData: OrderPartyData[];
}

interface RootState {
  orderBooking: OrderBookingState;
}

const SalesVoucherForm: FC<SalesVoucherFormProps> = ({
  form,
  parentSelected,
  setParentSelected,
  selected,
  handleIsSelected,
  partyId,
  handleSalesVoucherProcess,
  handleSearchOrderParty,
  handleScrollOrderParty,
  orderPartyInput,
  setOrderPartyInput,
}) => {
  const orderPartyData: OrderPartyData[] = useSelector(
    (state: RootState) => state?.orderBooking?.orderPartyData
  );

  return (
    <Form {...form}>
      <form
        className={pageFormClassName}
        autoComplete="off"
      >
        <h3 className={formTitleClassName}>Invoice</h3>
        <Divider />
        <div className={formGridClassName}>
          <DatePickerField
            control={form.control}
            name="invoiceDate"
            label="Invoice date"
            startYear={2000}
            endYear={2050}
          />

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
        </div>

        {partyId && (
          <ScrollArea className="w-full">
            <SalesVoucherTable
              parentSelected={parentSelected}
              setParentSelected={setParentSelected}
              selected={selected}
              handleIsSelected={handleIsSelected}
            />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}

        <div className={formGridClassName}>
          <RadioField
            control={form.control}
            name="gstChoice"
            options={[
              {
                value: "N",
                label: "Without Gst",
              },
              {
                value: "Y",
                label: "With Gst",
              },
            ]}
            orientation="horizontal"
            className="border-0 bg-transparent px-0 py-0 rounded-none"
          />

          {form.getValues("gstChoice") === "Y" && (
            <InputField
              control={form.control}
              name="gstAmount"
              label="GST Amount"
              type="number"
            />
          )}
        </div>

        <div className={formActionsClassName}>
          <Button
            color="primary"
            size="lg"
            radius="sm"
            className={formSubmitButtonClassName}
            onPress={handleSalesVoucherProcess}
          >
            Process Invoice
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default SalesVoucherForm;
