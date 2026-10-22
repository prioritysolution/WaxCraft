"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import RadioField from "@/common/formFields/RadioFields";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";
import { Form } from "@/components/ui/form";
import { FormSubmitButton } from "@/components/ui/form-actions";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  formActionsClassName,
  formGridClassName,
  formTitleClassName,
  pageFormClassName,
  secondaryButtonClassName,
  tableClassNames,
} from "@/lib/uiStyles";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import {
  PurchaseTableData,
  PurchaseVoucherFormProps,
} from "@/types/inventoryVoucher/PurchaseVoucherTypes";
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
import { Input } from "@/components/ui/input";
import { sanitizeDecimalInput } from "@/utils/formatDecimal";
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
  editPurchaseId,
  handleCancelEditPurchase,
  purchaseType,
  form,
  handleSubmit,
  purchaseTableData,
  handleDeletePurchaseTableData,
  handleUpdatePurchaseTableRate,
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

  const isEditing = editPurchaseId != null;
  const withGst = purchaseType === "Y";

  const tableColumns = [
    { key: "serial", label: "Serial No." },
    { key: "purchaseType", label: "Purchase Type" },
    { key: "itemName", label: "Item Name" },
    { key: "quantity", label: "Quantity" },
    { key: "rate", label: "Rate" },
    { key: "taxableTotal", label: "Taxable Amount" },
    ...(withGst
      ? [
          { key: "cgst", label: "CGST" },
          { key: "sgst", label: "SGST" },
        ]
      : []),
    { key: "grandTotal", label: "Grand Total" },
    { key: "action", label: "Action" },
  ];

  const renderPurchaseCell = (
    data: PurchaseTableData,
    index: number,
    columnKey: string,
  ) => {
    switch (columnKey) {
      case "serial":
        return index + 1;
      case "purchaseType":
        return data.orderPurchaseType === "O"
          ? "Ordered Purchase"
          : "Regular Purchase";
      case "itemName":
        return (
          <div className="flex flex-col items-center">
            <span>{data?.itemName}</span>
            {data?.orderNo ? (
              <span className="text-xs text-muted-foreground">
                {data.orderNo}
              </span>
            ) : null}
          </div>
        );
      case "quantity":
        return data?.quantity;
      case "rate":
        return data.orderPurchaseType === "O" ? (
          <Input
            type="text"
            inputMode="decimal"
            value={String(data?.rate ?? "")}
            aria-label={`Edit rate for ${data?.itemName || "item"}`}
            className="mx-auto h-9 w-[96px] rounded-lg border border-black/15 bg-[#F7F5F3] px-2 text-center text-sm tabular-nums shadow-none focus-visible:border-black/25 focus-visible:outline-none focus-visible:ring-0"
            onChange={(e) => {
              const next = sanitizeDecimalInput(e.target.value);
              handleUpdatePurchaseTableRate(index, next);
            }}
          />
        ) : (
          data?.rate
        );
      case "taxableTotal":
        return data?.taxableTotal;
      case "cgst":
        return data?.cgst;
      case "sgst":
        return data?.sgst;
      case "grandTotal":
        return data?.grandTotal;
      case "action":
        return (
          <TableDeleteButton
            onPress={() => {
              setPendingDeleteRowIndex(index);
              setShowRowDeleteConfirm(true);
            }}
          />
        );
      default:
        return null;
    }
  };

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
          <h3 className={formTitleClassName}>
            {isEditing ? "Edit Purchase" : "Add New Purchase"}
          </h3>
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
              isDisabled={isEditing}
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

          <FormSubmitButton
            className="w-auto min-w-[148px] justify-self-end self-end"
            isLoading={addPurchaseVoucherLoading}
            isDisabled={addPurchaseVoucherLoading || orderPurchaseType === "O"}
          >
            Add To Table
          </FormSubmitButton>

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
            <TableHeader columns={tableColumns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  align={column.key === "serial" ? "start" : "center"}
                >
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent={"No data found."}>
              {purchaseTableData.map((data, index) => (
                <TableRow key={index}>
                  {(columnKey) => (
                    <TableCell>
                      {renderPurchaseCell(data, index, String(columnKey))}
                    </TableCell>
                  )}
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
          {isEditing ? (
            <Button
              type="button"
              variant="bordered"
              size="lg"
              radius="sm"
              isDisabled={addPurchaseVoucherLoading}
              startContent={<X className="h-4 w-4" />}
              className={cn(secondaryButtonClassName, "w-auto")}
              onPress={handleCancelEditPurchase}
            >
              Cancel Edit
            </Button>
          ) : null}
          <FormSubmitButton
            type="button"
            isLoading={addPurchaseVoucherLoading}
            isDisabled={addPurchaseVoucherLoading}
            onPress={handleAddPurchase}
          >
            {isEditing ? "Update" : "Add"}
          </FormSubmitButton>
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
