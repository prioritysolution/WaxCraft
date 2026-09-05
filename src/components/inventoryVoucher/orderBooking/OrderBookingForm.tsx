"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import InputField from "@/common/formFields/InputField";
import RadioField from "@/common/formFields/RadioFields";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";
import TextareaField from "@/common/formFields/TextareaField";
import { Form } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  formActionsClassName,
  formGridClassName,
  formSubmitButtonClassName,
  formTitleClassName,
  pageFormClassName,
  tableClassNames,
} from "@/lib/uiStyles";
import { OrderBookingFormProps } from "@/types/inventoryVoucher/OrderBookingTypes";
import {
  Button,
  Divider,
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { TableDeleteButton, TableNameCell } from "@/components/ui/table-edit-button";
import { FC, FormEvent } from "react";
import toast from "react-hot-toast";
import { FieldErrors } from "react-hook-form";
import { useSelector } from "react-redux";
import { OrderBookingFormData } from "@/types/inventoryVoucher/OrderBookingTypes";

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

const OrderBookingForm: FC<OrderBookingFormProps> = ({
  addOrderBookingLoading,
  form,
  handleSubmit,
  handleShowPartyForm,
  isOpen,
  orderTableData,
  handleDeleteOrderTableData,
  handleSearchOrderParty,
  handleScrollOrderParty,
  handleSearchOrderDesign,
  handleScrollOrderDesign,
  orderPartyInput,
  setOrderPartyInput,
  orderDesignInput,
  setOrderDesignInput,
  getOrderPartyLoading,
  getOrderDesignLoading,
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

  const handleInvalidSubmit = (errors: FieldErrors<OrderBookingFormData>) => {
    const firstError = Object.values(errors).find(
      (error) => typeof error?.message === "string" && error.message,
    );
    toast.error(
      (firstError?.message as string) || "Please fill the required fields.",
    );
  };

  return (
    <Form {...form}>
      <form
        className={pageFormClassName}
        autoComplete="off"
        onSubmit={form.handleSubmit(handleSubmit, handleInvalidSubmit)}
      >
        <h3 className={formTitleClassName}>Add New Order Booking</h3>
        <Divider />
        <div className={formGridClassName}>
          <div onFocus={handleStopPropagation}>
            <DatePickerField
              control={form.control}
              name="orderDate"
              label="Order date"
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
            loading={getOrderPartyLoading}
            emptyContent={
              <Button
                // color="success"
                variant="light"
                onPress={handleShowPartyForm}
                size="md"
                radius="sm"
                className="w-full text-blue-500 font-medium"
              >
                Create New Party
              </Button>
            }
            hideContent={isOpen}
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
            label="Item Type"
            orientation="horizontal"
            className="border-0 bg-transparent px-0 py-0 rounded-none"
            isDisabled={orderTableData.length > 0}
          />

          <SearchDropdownField
            label="Design"
            name="designId"
            control={form.control}
            options={
              orderDesignData.filter((design) => {
                return !orderTableData.some(
                  (tableData) => tableData.designId === design.Id
                );
              }) || []
            }
            optionLabelKey="Design_Name"
            handleSearch={handleSearchOrderDesign}
            loadMore={handleScrollOrderDesign}
            input={orderDesignInput}
            setInput={setOrderDesignInput}
            loading={getOrderDesignLoading}
          />
        </div>

        <ScrollArea className="w-full mt-5">
          <Table
            removeWrapper
            aria-label="Example static collection table"
            classNames={tableClassNames}
          >
            <TableHeader>
              <TableColumn>Serial No.</TableColumn>
              <TableColumn align="center">Design Image</TableColumn>
              <TableColumn align="center">Design Name</TableColumn>
              <TableColumn align="center">Design No</TableColumn>
              <TableColumn align="center">Order Quantity</TableColumn>
              <TableColumn align="center">Design Rate</TableColumn>
              <TableColumn align="center">Total Rate</TableColumn>
              <TableColumn align="center">Action</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No data found."}>
              {orderTableData.map((data, index) => (
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
                  <TableCell>{data.orderQuantity}</TableCell>
                  <TableCell>{data.designRate}</TableCell>
                  <TableCell>{data.totalRate}</TableCell>
                  <TableCell>
                    <TableDeleteButton
                      onPress={() => handleDeleteOrderTableData(data.designId)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className={formActionsClassName}>
          <Button
            type="submit"
            color="primary"
            size="lg"
            radius="sm"
            className={formSubmitButtonClassName}
            isLoading={addOrderBookingLoading}
            isDisabled={addOrderBookingLoading}
          >
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default OrderBookingForm;
