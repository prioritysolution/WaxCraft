"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import InputField from "@/common/formFields/InputField";
import RadioField from "@/common/formFields/RadioFields";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";
import TextareaField from "@/common/formFields/TextareaField";
import { Form } from "@/components/ui/form";
import { FormSubmitButton } from "@/components/ui/form-actions";
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
import { cn } from "@/lib/utils";
import {
  formatTwoDecimals,
  formatUpToDecimals,
} from "@/utils/formatDecimal";
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
import { ChevronRight } from "lucide-react";
import { FC, FormEvent, useEffect, useState } from "react";
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

const nestedHeadClassName =
  "px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground";
const nestedCellClassName =
  "px-3 py-2.5 text-center text-sm text-foreground";

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
  itemListData,
  handleDeleteDesignTableData,
}) => {
  const [expandedDesignId, setExpandedDesignId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (
      expandedDesignId &&
      !designTableData.some((data) => String(data.designId) === expandedDesignId)
    ) {
      setExpandedDesignId(null);
    }
  }, [designTableData, expandedDesignId]);

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
              <TableColumn align="center" className="w-[56px]">
                {" "}
              </TableColumn>
              <TableColumn>Serial No.</TableColumn>
              <TableColumn align="center">Design Image</TableColumn>
              <TableColumn align="center">Design Name</TableColumn>
              <TableColumn align="center">Design No</TableColumn>
              <TableColumn align="center">WT</TableColumn>
              <TableColumn align="center">WT Rate</TableColumn>
              <TableColumn align="center">Polish</TableColumn>
              <TableColumn align="center">Ghat</TableColumn>
              <TableColumn align="center">Total Rate</TableColumn>
              <TableColumn align="center">Action</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No data found."}>
              {designTableData.flatMap((data, index) => {
                const rowKey = String(data.designId);
                const isExpanded = expandedDesignId === rowKey;
                const lineItems = (itemListData ?? []).filter(
                  (item) => String(item.designId) === rowKey,
                );

                const rows = [
                <TableRow key={`${data.designId}-${index}`}>
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
                        setExpandedDesignId((current) =>
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
                  <TableCell>{formatTwoDecimals(data.wt)}</TableCell>
                  <TableCell>{formatTwoDecimals(data.wtRate)}</TableCell>
                  <TableCell>{formatTwoDecimals(data.polish)}</TableCell>
                  <TableCell>
                    {String(data.ghat ?? "").trim()
                      ? formatTwoDecimals(data.ghat)
                      : "—"}
                  </TableCell>
                  <TableCell>{formatTwoDecimals(data.totalRate)}</TableCell>
                  <TableCell>
                    <TableDeleteButton
                      onPress={() =>
                        handleDeleteDesignTableData(String(data.designId))
                      }
                    />
                  </TableCell>
                </TableRow>,
                ];

                if (isExpanded) {
                  rows.push(
                    <TableRow key={`${data.designId}-${index}-items`}>
                      <TableCell
                        colSpan={11}
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
                                        {formatUpToDecimals(item.itemRate)}
                                      </td>
                                      <td className={nestedCellClassName}>
                                        {formatUpToDecimals(item.makingRate)}
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

        <div className="flex w-full justify-end">
          <FormSubmitButton
            className="w-auto min-w-[148px]"
            isLoading={addSamplePrintLoading}
            isDisabled={addSamplePrintLoading}
          >
            Add
          </FormSubmitButton>
        </div>
      </form>
    </Form>
  );
};
export default SamplePrintForm;
