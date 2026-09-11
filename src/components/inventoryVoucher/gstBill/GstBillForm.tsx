"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
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
import { GstBillFormProps } from "@/types/inventoryVoucher/GstBillTypes";
import { ItemUnitTableData } from "@/types/master/ItemUnitTypes";
import {
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { TableDeleteButton } from "@/components/ui/table-edit-button";
import { FC, FormEvent, Fragment } from "react";
import { useSelector } from "react-redux";

interface OrderPartyData {
  Id: number;
  Party_Name: string;
}

interface OrderBookingState {
  orderPartyData: OrderPartyData[];
}

interface ItemUnitState {
  itemUnitData: ItemUnitTableData[];
}

interface RootState {
  orderBooking: OrderBookingState;
  itemUnit: ItemUnitState;
}

const GstBillForm: FC<GstBillFormProps> = ({
  addGstBillLoading,
  form,
  handleSubmit,
  itemTableData,
  handleDeleteItemTableData,
  handleSearchOrderParty,
  handleScrollOrderParty,
  orderPartyInput,
  setOrderPartyInput,
  itemGrandTotal,
  itemGst,
  itemRoundOff,
  handleAddGstBill,
  getOrderPartyLoading,
  getUnitLoading,
}) => {
  const orderPartyData: OrderPartyData[] = useSelector(
    (state: RootState) => state?.orderBooking?.orderPartyData
  );

  const itemUnitData: ItemUnitTableData[] = useSelector(
    (state: RootState) => state?.itemUnit?.itemUnitData
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
        <h3 className={formTitleClassName}>Add GST Bill</h3>
        <Divider />
        <div className={formGridClassName}>
          <div onFocus={handleStopPropagation}>
            <DatePickerField
              control={form.control}
              name="date"
              label="Date"
              startYear={2000}
              endYear={2050}
              disabled={itemTableData.length > 0}
            />
          </div>

          <InputField
            control={form.control}
            name="billNo"
            label="Bill No."
            type="number"
            disabled={itemTableData.length > 0}
          />

          <InputField
            control={form.control}
            name="gstRate"
            label="GST Rate"
            type="number"
            disabled={itemTableData.length > 0}
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
            disabled={itemTableData.length > 0}
            loading={getOrderPartyLoading}
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
        </div>

        <div className={formGridClassName}>
          <InputField
            control={form.control}
            name="itemName"
            label="Item Name"
          />

          <DropdownField
            control={form.control}
            name="itemUnit"
            label="Item Unit"
            options={itemUnitData || []}
            optionLabelKey="Unit_Name"
            loading={getUnitLoading}
          />

          <InputField
            control={form.control}
            name="itemQuantity"
            label="Item Quantity"
            type="number"
          />

          <InputField
            control={form.control}
            name="itemRate"
            label="Item Rate"
            type="number"
          />

          <InputField
            control={form.control}
            name="itemHsn"
            label="Item HSN"
            type="number"
          />

          <Button
            type="submit"
            color="primary"
            size="lg"
            radius="sm"
            className="w-auto min-w-[148px] justify-self-end self-end"
          >
            Add To Table
          </Button>
        </div>

        <ScrollArea className="w-full mt-5">
          <Table
            removeWrapper
            aria-label="Example static collection table"
            classNames={tableClassNames}
          >
            <TableHeader>
              <TableColumn>Serial No.</TableColumn>
              <TableColumn align="center">Item Name</TableColumn>
              <TableColumn align="center">Item HSN</TableColumn>
              <TableColumn align="center">Item Unit</TableColumn>
              <TableColumn align="center">Item Quantity</TableColumn>
              <TableColumn align="center">Item Rate</TableColumn>
              <TableColumn align="center">Total</TableColumn>
              <TableColumn align="center">Action</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No data found."}>
              <Fragment>
                {itemTableData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{data?.itemName || ""}</TableCell>
                    <TableCell>{data?.itemHsn || ""}</TableCell>
                    <TableCell>
                      {data?.itemUnit
                        ? itemUnitData?.find(
                            (unit) => unit.Id.toString() === data?.itemUnit
                          )?.Unit_Name
                        : ""}
                    </TableCell>
                    <TableCell>{data?.itemQuantity || ""}</TableCell>
                    <TableCell>{data?.itemRate || ""}</TableCell>
                    <TableCell>{data?.itemTotal || ""}</TableCell>
                    <TableCell>
                      <TableDeleteButton
                        onPress={() => handleDeleteItemTableData(index)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {itemTableData.length > 0 && (
                  <TableRow>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell>Gross Total</TableCell>
                    <TableCell>{itemGrandTotal || ""}</TableCell>
                    <TableCell className="hidden"> </TableCell>
                  </TableRow>
                )}
                {itemTableData.length > 0 && (
                  <TableRow>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell>CGST Total</TableCell>
                    <TableCell>{itemGst || ""}</TableCell>
                    <TableCell className="hidden"> </TableCell>
                  </TableRow>
                )}
                {itemTableData.length > 0 && (
                  <TableRow>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell>SGST Total</TableCell>
                    <TableCell>{itemGst || ""}</TableCell>
                    <TableCell className="hidden"> </TableCell>
                  </TableRow>
                )}
                {itemTableData.length > 0 && (
                  <TableRow>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell>Round Off</TableCell>
                    <TableCell>{itemRoundOff || ""}</TableCell>
                    <TableCell className="hidden"> </TableCell>
                  </TableRow>
                )}
                {itemTableData.length > 0 && (
                  <TableRow>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>
                      <InputField
                        control={form.control}
                        name="discount"
                        type="number"
                      />
                    </TableCell>
                    <TableCell className="hidden"> </TableCell>
                  </TableRow>
                )}
                {itemTableData.length > 0 && (
                  <TableRow>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell>Grand Total</TableCell>
                    <TableCell>
                      {(
                        Number(itemGrandTotal) +
                        Number(itemGst) * 2 +
                        Number(itemRoundOff) -
                        Number(form.getValues("discount") || 0)
                      ).toFixed(2) || ""}
                    </TableCell>
                    <TableCell className="hidden"> </TableCell>
                  </TableRow>
                )}
              </Fragment>
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className={formActionsClassName}>
          <Button
            // type="submit"
            color="primary"
            size="lg"
            radius="sm"
            className={formSubmitButtonClassName}
            onPress={handleAddGstBill}
            isLoading={addGstBillLoading}
            isDisabled={addGstBillLoading}
          >
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default GstBillForm;
