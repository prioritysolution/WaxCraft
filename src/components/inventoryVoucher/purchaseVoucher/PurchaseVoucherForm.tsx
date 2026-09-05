"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import RadioField from "@/common/formFields/RadioFields";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";
import { Form } from "@/components/ui/form";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  formActionsClassName,
  formGridClassName,
  formSubmitButtonClassName,
  formTitleClassName,
  pageFormClassName,
  tableClassNames,
} from "@/lib/uiStyles";
import { PurchaseVoucherFormProps } from "@/types/inventoryVoucher/PurchaseVoucherTypes";
import { BankAccountTableData } from "@/types/master/BankAccountTypes";
import { ItemTableData } from "@/types/master/ItemTypes";
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
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import RequisitionModal from "./RequisitionModal";

interface PurchasePartyData {
  Id: number;
  Party_Name: string;
}

interface ItemState {
  itemData: ItemTableData[];
}

interface PurchaseVoucherState {
  purchasePartyData: PurchasePartyData[];
}

interface BankAccountState {
  bankAccountData: BankAccountTableData[];
}

interface RootState {
  purchaseVoucher: PurchaseVoucherState;
  item: ItemState;
  bankAccount: BankAccountState;
}

const PurchaseVoucherForm: FC<PurchaseVoucherFormProps> = ({
  addPurchaseVoucherLoading,
  form,
  handleSubmit,
  purchaseTableData,
  handleDeletePurchaseTableData,
  handleAddPurchase,
  handleSearchItem,
  handleScrollItem,
  handleSearchPurchaseParty,
  handleScrollPurchaseParty,
  purchasePartyInput,
  setPurchasePartyInput,
  itemInput,
  setItemInput,
  orderPurchaseType,
  handleOrderPurchaseTypeChange,
  showRequisitionModal,
  setShowRequisitionModal,
  requisitionLoading,
  handleAddRequisitionItems,
}) => {
  const [showRowDeleteConfirm, setShowRowDeleteConfirm] = useState(false);
  const [pendingDeleteRowIndex, setPendingDeleteRowIndex] = useState<
    number | null
  >(null);

  const purchasePartyData: PurchasePartyData[] = useSelector(
    (state: RootState) => state?.purchaseVoucher?.purchasePartyData
  );

  const itemData: ItemTableData[] = useSelector(
    (state: RootState) => state?.item?.itemData
  );

  const bankAccountData: BankAccountTableData[] = useSelector(
    (state: RootState) => state?.bankAccount?.bankAccountData
  );

  return (
    <Form {...form}>
      <form
        className={pageFormClassName}
        autoComplete="off"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h3 className={formTitleClassName}>Add New Purchase</h3>
          <div className="w-full sm:w-auto">
            <RadioField
              control={form.control}
              name="orderPurchaseType"
              className="border-0 bg-transparent px-0 py-0 rounded-none"
              orientation="horizontal"
              options={[
                {
                  value: "R",
                  label: "Regular Purchase",
                },
                {
                  value: "O",
                  label: "Ordered Purchase",
                },
              ]}
              onValueChange={handleOrderPurchaseTypeChange}
            />
          </div>
        </div>
        <Divider />
        <div className={formGridClassName}>
          <RadioField
            control={form.control}
            name="purchaseType"
            className="border-0 bg-transparent px-0 py-0 rounded-none"
            orientation="horizontal"
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
            label="GST"
          />

          <DatePickerField
            control={form.control}
            name="purchaseDate"
            label="Purchase date"
            startYear={2000}
            endYear={2050}
          />

          <SearchDropdownField
            label="Party"
            name="partyId"
            control={form.control}
            options={purchasePartyData || []}
            optionLabelKey="Party_Name"
            handleSearch={handleSearchPurchaseParty}
            loadMore={handleScrollPurchaseParty}
            input={purchasePartyInput}
            setInput={setPurchasePartyInput}
          />

          <InputField
            control={form.control}
            name="purchaseNo"
            label="Purchase No."
          />

          <SearchDropdownField
            label="Item"
            name="itemId"
            control={form.control}
            options={itemData || []}
            optionLabelKey="Item_Name"
            handleSearch={handleSearchItem}
            loadMore={handleScrollItem}
            input={itemInput}
            setInput={setItemInput}
          />

          <InputField
            control={form.control}
            name="quantity"
            label="Quantity"
            type="number"
          />

          <InputField
            control={form.control}
            name="rate"
            label="Rate"
            type="number"
          />

          <Button
            type="submit"
            color="primary"
            size="lg"
            radius="sm"
            className="w-auto min-w-[148px] justify-self-end self-end"
            isLoading={addPurchaseVoucherLoading}
            isDisabled={addPurchaseVoucherLoading || orderPurchaseType === "O"}
          >
            Add To Table
          </Button>

          {orderPurchaseType === "O" && (
            <Button
              type="button"
              color="primary"
              variant="flat"
              size="lg"
              radius="sm"
              className="w-auto min-w-[148px] justify-self-end self-end"
              onPress={() => handleOrderPurchaseTypeChange("O")}
            >
              Item Requisition
            </Button>
          )}
        </div>

        <ScrollArea className="w-full">
          <Table
            removeWrapper
            aria-label="Example static collection table"
            classNames={tableClassNames}
          >
            <TableHeader>
              <TableColumn>Serial No.</TableColumn>
              <TableColumn align="center">Purchase Type</TableColumn>
              <TableColumn align="center">Item Name</TableColumn>
              <TableColumn align="center">Quantity</TableColumn>
              <TableColumn align="center">Rate</TableColumn>
              {/* {purchaseType === "Y" ? (
                <> */}
              <TableColumn align="center">Taxable Amount</TableColumn>
              <TableColumn align="center">CGST</TableColumn>
              <TableColumn align="center">SGST</TableColumn>
              {/* </>
              ) : (
                <></>
              )} */}
              <TableColumn align="center">Grand Total</TableColumn>
              <TableColumn align="center">Action</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No data found."}>
              {purchaseTableData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {data.orderPurchaseType === "O"
                      ? "Ordered Purchase"
                      : "Regular Purchase"}
                  </TableCell>
                  <TableCell>{data?.itemName}</TableCell>
                  <TableCell>{data?.quantity}</TableCell>
                  <TableCell>{data?.rate}</TableCell>
                  {/* {purchaseType === "Y" ? (
                    <> */}
                  <TableCell>{data?.taxableTotal}</TableCell>
                  <TableCell>{data?.cgst}</TableCell>
                  <TableCell>{data?.sgst}</TableCell>
                  {/* </>
                  ) : (
                    <></>
                  )} */}
                  <TableCell>{data?.grandTotal}</TableCell>
                  <TableCell>
                    <TableDeleteButton
                      onPress={() => {
                        setPendingDeleteRowIndex(index);
                        setShowRowDeleteConfirm(true);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className={formGridClassName}>
          <InputField
            control={form.control}
            name="roundOff"
            label="Round Off"
            type="number"
          />

          <InputField
            control={form.control}
            name="discount"
            label="Discount"
            type="number"
          />
        </div>

        <div className={formGridClassName}>
          <RadioField
            control={form.control}
            name="transMode"
            label="Trans Mode"
            className="border-0 bg-transparent px-0 py-0 rounded-none"
            orientation="horizontal"
            options={[
              {
                value: "C",
                label: "Cash",
              },
              {
                value: "B",
                label: "Bank",
              },
              {
                value: "Cr",
                label: "Credit",
              },
            ]}
          />

          {form.getValues("transMode") === "B" && (
            <DropdownField
              control={form.control}
              name="bankId"
              label="Bank"
              options={bankAccountData || []}
              optionLabelKey="Bank_Name"
            />
          )}
        </div>

        <div className={formActionsClassName}>
          <Button
            color="primary"
            size="lg"
            radius="sm"
            className={formSubmitButtonClassName}
            isLoading={addPurchaseVoucherLoading}
            isDisabled={addPurchaseVoucherLoading}
            onPress={handleAddPurchase}
          >
            Add
          </Button>
        </div>

        <DeleteConfirmModal
          isOpen={showRowDeleteConfirm}
          onOpenChange={setShowRowDeleteConfirm}
          message="Are you sure to delete this row?"
          onCancel={() => {
            setShowRowDeleteConfirm(false);
            setPendingDeleteRowIndex(null);
          }}
          onConfirm={() => {
            if (pendingDeleteRowIndex !== null) {
              handleDeletePurchaseTableData(pendingDeleteRowIndex);
            }
            setShowRowDeleteConfirm(false);
            setPendingDeleteRowIndex(null);
          }}
        />
        <RequisitionModal
          isOpen={showRequisitionModal}
          onOpenChange={setShowRequisitionModal}
          loading={requisitionLoading}
          onAddItems={handleAddRequisitionItems}
        />
      </form>
    </Form>
  );
};
export default PurchaseVoucherForm;
