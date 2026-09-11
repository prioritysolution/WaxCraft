"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";
import { Form } from "@/components/ui/form";
import {
  pageFormClassName,
  formGridClassName,
} from "@/lib/uiStyles";
import { PartyLedgerFormProps } from "@/types/inventoryReport/PartyLedgerTypes";
import { Button } from "@heroui/react";
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

const PartyLedgerForm: FC<PartyLedgerFormProps> = ({
  getPartyLedgerLoading,
  form,
  handleSubmit,
  partyLedgerData,
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

  const ledgerTypeData = [
    {
      Id: 0,
      Label: "All",
    },
    {
      Id: 1,
      Label: "Only Cash",
    },
    {
      Id: 2,
      Label: "Only Bank",
    },
  ];

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

          <DropdownField
            control={form.control}
            name="ledgerType"
            label="Ledger Type"
            options={ledgerTypeData || []}
            optionLabelKey="Label"
          />
        </div>

        <div className="flex w-full items-center justify-end gap-2">
          <Button
            type="submit"
            color="primary"
            size="lg"
            radius="sm"
            className="w-full sm:w-40"
            isLoading={getPartyLedgerLoading}
            isDisabled={getPartyLedgerLoading}
          >
            Process
          </Button>

          <Button
            color="primary"
            size="lg"
            radius="sm"
            className="w-full sm:w-40 bg-blue-500 text-white"
            onPress={() => setShowPrintDialog(true)}
            isDisabled={!(partyLedgerData.length > 0)}
          >
            Preview
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default PartyLedgerForm;
