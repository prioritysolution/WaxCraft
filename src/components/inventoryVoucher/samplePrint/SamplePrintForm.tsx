"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import InputField from "@/common/formFields/InputField";
import RadioField from "@/common/formFields/RadioFields";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";
import TextareaField from "@/common/formFields/TextareaField";
import { Form } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  TableDeleteButton,
  TableNameCell,
} from "@/components/ui/table-edit-button";
import {
  pageFormClassName,
  formGridClassName,
  tableClassNames,
} from "@/lib/uiStyles";
import { SamplePrintFormProps } from "@/types/inventoryVoucher/SamplePrintTypes";
import { formatTwoDecimals } from "@/utils/formatDecimal";
import {
  Button,
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
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
  designTableData,
  handleDeleteDesignTableData,
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
        onSubmit={(e) => {
          e.preventDefault();
          form.setValue("item", []);
          form.clearErrors("item");
          void form.handleSubmit(handleSubmit)(e);
        }}
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
            isDisabled={designTableData.length > 0}
          />

          <SearchDropdownField
            label="Design"
            name="designId"
            control={form.control}
            options={
              orderDesignData.filter(
                (design) =>
                  !designTableData.some(
                    (row) => String(row.designId) === String(design.Id)
                  )
              ) || []
            }
            optionLabelKey="Design_Name"
            handleSearch={handleSearchOrderDesign}
            loadMore={handleScrollOrderDesign}
            input={orderDesignInput}
            setInput={setOrderDesignInput}
          />
        </div>

        <ScrollArea className="mt-5 w-full">
          <Table
            removeWrapper
            aria-label="Selected designs table"
            classNames={tableClassNames}
          >
            <TableHeader>
              <TableColumn>Serial No.</TableColumn>
              <TableColumn align="center">Design Image</TableColumn>
              <TableColumn align="center">Design Name</TableColumn>
              <TableColumn align="center">Design No</TableColumn>
              <TableColumn align="center">WT</TableColumn>
              <TableColumn align="center">WT Rate</TableColumn>
              <TableColumn align="center">Polish</TableColumn>
              <TableColumn align="center">Total Rate</TableColumn>
              <TableColumn align="center">Action</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No data found."}>
              {designTableData.map((data, index) => (
                <TableRow key={`${data.designId}-${index}`}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      {data.image ? (
                        <Image
                          src={data.image}
                          alt={data.designName || "Design"}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <TableNameCell name={data.designName || "—"} />
                    </div>
                  </TableCell>
                  <TableCell>{data.designNo || "—"}</TableCell>
                  <TableCell>{formatTwoDecimals(data.wt)}</TableCell>
                  <TableCell>{formatTwoDecimals(data.wtRate)}</TableCell>
                  <TableCell>{formatTwoDecimals(data.polish)}</TableCell>
                  <TableCell>{formatTwoDecimals(data.totalRate)}</TableCell>
                  <TableCell>
                    <TableDeleteButton
                      onPress={() =>
                        handleDeleteDesignTableData(String(data.designId))
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

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
