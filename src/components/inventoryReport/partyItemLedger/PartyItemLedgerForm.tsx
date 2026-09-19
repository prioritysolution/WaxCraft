"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";
import { Form } from "@/components/ui/form";
import { FormSubmitButton } from "@/components/ui/form-actions";
import {
  pageFormClassName,
  formGridClassName,
  reportActionButtonClassName,
} from "@/lib/uiStyles";
import { PartyItemLedgerFormProps } from "@/types/inventoryReport/PartyItemLedgerTypes";
import { FC } from "react";
import { useSelector } from "react-redux";

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

const PartyItemLedgerForm: FC<PartyItemLedgerFormProps> = ({
  getPartyItemLedgerLoading,
  form,
  handleSubmit,
  partyItemLedgerData,
  setShowPrintDialog,
  handleSearchOrderParty,
  handleScrollOrderParty,
  orderPartyInput,
  setOrderPartyInput,
  getOrderPartyLoading,
}) => {
  const orderPartyData: OrderPartyData[] = useSelector(
    (state: RootState) => state?.orderBooking?.orderPartyData
  );

  return (
    <Form {...form}>
      <form
        className={pageFormClassName}
        autoComplete="off"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className={formGridClassName}>
          <DatePickerField
            control={form.control}
            name="fromDate"
            label="From date"
            startYear={2000}
            endYear={2050}
          />

          <DatePickerField
            control={form.control}
            name="toDate"
            label="To date"
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
            loading={getOrderPartyLoading}
          />
        </div>

        <div className="flex w-full items-center justify-end gap-2">
          <FormSubmitButton
            className={reportActionButtonClassName}
            isLoading={getPartyItemLedgerLoading}
            isDisabled={getPartyItemLedgerLoading}
          >
            Process
          </FormSubmitButton>

          <FormSubmitButton
            type="button"
            className={`${reportActionButtonClassName} !bg-blue-500 text-white data-[hover=true]:!bg-blue-600`}
            onPress={() => setShowPrintDialog(true)}
            isDisabled={!(partyItemLedgerData.length > 0)}
          >
            Preview
          </FormSubmitButton>
        </div>
      </form>
    </Form>
  );
};
export default PartyItemLedgerForm;
