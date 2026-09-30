"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import InputField from "@/common/formFields/InputField";
import RadioField from "@/common/formFields/RadioFields";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";
import { Form } from "@/components/ui/form";
import { FormSubmitButton } from "@/components/ui/form-actions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  formActionsClassName,
  formGridClassName,
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
import { cn } from "@/lib/utils";
import { formatTwoDecimals } from "@/utils/formatDecimal";
import { ChevronRight } from "lucide-react";
import { FC, FormEvent, useEffect, useState } from "react";
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

const nestedHeadClassName =
  "px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground";
const nestedCellClassName =
  "px-3 py-2.5 text-center text-sm text-foreground";

const OrderBookingForm: FC<OrderBookingFormProps> = ({
  addOrderBookingLoading,
  form,
  handleSubmit,
  handleShowPartyForm,
  isOpen,
  orderTableData,
  itemListData,
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

  const [expandedLineKey, setExpandedLineKey] = useState<string | null>(null);

  useEffect(() => {
    if (
      expandedLineKey &&
      !orderTableData.some((data) => data.lineKey === expandedLineKey)
    ) {
      setExpandedLineKey(null);
    }
  }, [orderTableData, expandedLineKey]);

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

          <InputField
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
            options={orderDesignData || []}
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
              <TableColumn align="center" className="w-[56px]">
                {" "}
              </TableColumn>
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
              {orderTableData.flatMap((data, index) => {
                const rowKey = data.lineKey || `${data.designId}-${index}`;
                const isExpanded = expandedLineKey === rowKey;
                const lineItems = itemListData.filter((item) =>
                  item.lineKey
                    ? item.lineKey === data.lineKey
                    : String(item.designId) === String(data.designId),
                );

                const rows = [
                <TableRow key={rowKey}>
                  <TableCell className="w-[56px]">
                    <Button
                      type="button"
                      isIconOnly
                      size="sm"
                      radius="md"
                      variant="light"
                      aria-expanded={isExpanded}
                      aria-label={
                        isExpanded ? "Hide design items" : "Show design items"
                      }
                      className="h-8 w-8 min-w-8 text-muted-foreground"
                      onPress={() =>
                        setExpandedLineKey((current) =>
                          current === rowKey ? null : rowKey,
                        )
                      }
                    >
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          isExpanded && "rotate-90",
                        )}
                      />
                    </Button>
                  </TableCell>
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
                      onPress={() => handleDeleteOrderTableData(data.lineKey)}
                    />
                  </TableCell>
                </TableRow>,
                ];

                if (isExpanded) {
                  rows.push(
                    <TableRow key={`${rowKey}-items`}>
                      <TableCell
                        colSpan={9}
                        className="bg-[#F7F5F3]/70 px-5 py-3"
                      >
                        <div className="w-full overflow-hidden rounded-xl border border-black/[0.06] bg-white">
                          <div className="bg-[#F7F5F3] px-4 py-2 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                            Item details
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px] border-collapse text-center">
                              <thead>
                                <tr className="bg-[#F7F5F3]/50">
                                  <th
                                    className={cn(
                                      nestedHeadClassName,
                                      "w-[30%] text-left",
                                    )}
                                  >
                                    Item Name
                                  </th>
                                  <th
                                    className={cn(
                                      nestedHeadClassName,
                                      "w-[25%] text-left",
                                    )}
                                  >
                                    Item Short Name
                                  </th>
                                  <th className={nestedHeadClassName}>
                                    Quantity
                                  </th>
                                  <th className={nestedHeadClassName}>Rate</th>
                                  <th className={nestedHeadClassName}>
                                    Making Rate
                                  </th>
                                  <th className={nestedHeadClassName}>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {lineItems.length ? (
                                  lineItems.map((item, itemIndex) => (
                                    <tr
                                      key={`${rowKey}-${item.itemId}-${itemIndex}`}
                                      className="border-b border-black/[0.05] last:border-b-0"
                                    >
                                      <td
                                        className={cn(
                                          nestedCellClassName,
                                          "text-left",
                                        )}
                                      >
                                        {item.itemName || "—"}
                                      </td>
                                      <td
                                        className={cn(
                                          nestedCellClassName,
                                          "text-left",
                                        )}
                                      >
                                        {item.itemShName || "—"}
                                      </td>
                                      <td className={nestedCellClassName}>
                                        {item.itemQuantity || "—"}
                                      </td>
                                      <td className={nestedCellClassName}>
                                        {formatTwoDecimals(item.itemRate)}
                                      </td>
                                      <td className={nestedCellClassName}>
                                        {formatTwoDecimals(item.makingRate)}
                                      </td>
                                      <td className={nestedCellClassName}>
                                        {formatTwoDecimals(item.itemTotal)}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      colSpan={6}
                                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                                    >
                                      No items found.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>,
                  );
                }

                return rows;
              })}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className={formActionsClassName}>
          <FormSubmitButton
            isLoading={addOrderBookingLoading}
            isDisabled={addOrderBookingLoading}
          >
            Add Order
          </FormSubmitButton>
        </div>
      </form>
    </Form>
  );
};
export default OrderBookingForm;
