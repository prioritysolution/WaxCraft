"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";
import { Form } from "@/components/ui/form";
import {
  pageFormClassName,
  formGridClassName,
} from "@/lib/uiStyles";
import { SalesReportFormProps } from "@/types/inventoryReport/SalesReportTypes";
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

const SalesReportForm: FC<SalesReportFormProps> = ({
  getSalesReportLoading,
  form,
  handleSubmit,
  salesReportData,
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
          <Button
            type="submit"
            color="primary"
            size="lg"
            radius="sm"
            className="w-full sm:w-40"
            isLoading={getSalesReportLoading}
            isDisabled={getSalesReportLoading}
          >
            Process
          </Button>

          <Button
            color="primary"
            size="lg"
            radius="sm"
            className="w-full sm:w-40 bg-blue-500 text-white"
            onPress={() => setShowPrintDialog(true)}
            isDisabled={!(salesReportData.length > 0)}
          >
            Preview
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default SalesReportForm;
