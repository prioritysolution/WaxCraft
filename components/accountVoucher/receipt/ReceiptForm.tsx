"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import RadioField from "@/common/formFields/RadioFields";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";
import { Form } from "@/components/ui/form";
import {
  formActionsClassName,
  formGridClassName,
  formSubmitButtonClassName,
  formTitleClassName,
  pageFormClassName,
} from "@/lib/uiStyles";
import { ReceiptFormProps } from "@/types/accountVoucher/ReceiptTypes";
import { BankAccountTableData } from "@/types/master/BankAccountTypes";
import { Button, Divider } from "@heroui/react";
import { FC } from "react";
import { useSelector } from "react-redux";

interface ReceiptLedgerData {
  Id: number;
  Ledger_Name: string;
}

interface ReceiptPartyData {
  Id: number;
  Party_Name: string;
}

interface ReceiptState {
  receiptLedgerData: ReceiptLedgerData[];
  receiptPartyData: ReceiptPartyData[];
}

interface BankAccountState {
  bankAccountData: BankAccountTableData[];
}

interface RootState {
  receipt: ReceiptState;
  bankAccount: BankAccountState;
}

const ReceiptForm: FC<ReceiptFormProps> = ({
  addReceiptLoading,
  form,
  handleSubmit,
  handleSearchReceiptLedger,
  handleScrollReceiptLedger,
  receiptLedgerInput,
  setReceiptLedgerInput,
  getReceiptLedgerLoading,
  checkReceiptPartyLoading,
  getBankAccountLoading,
}) => {
  const ledgerData: ReceiptLedgerData[] = useSelector(
    (state: RootState) => state?.receipt?.receiptLedgerData
  );

  const partyData: ReceiptPartyData[] = useSelector(
    (state: RootState) => state?.receipt?.receiptPartyData
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
        <h3 className={formTitleClassName}>Add New Receipt</h3>
        <Divider />
        <div className={formGridClassName}>
          <DatePickerField
            control={form.control}
            name="receiptDate"
            label="Receipt date"
            startYear={2000}
            endYear={2050}
          />

          <InputField
            control={form.control}
            name="particular"
            label="Particular"
          />

          <InputField
            control={form.control}
            name="manualVoucherNo"
            label="Manual Voucher No."
          />

          <SearchDropdownField
            label="Ledger"
            name="ledgerId"
            control={form.control}
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            handleSearch={handleSearchReceiptLedger}
            loadMore={handleScrollReceiptLedger}
            input={receiptLedgerInput}
            setInput={setReceiptLedgerInput}
            loading={getReceiptLedgerLoading}
          />

          <DropdownField
            label="Party"
            name="partyId"
            control={form.control}
            options={partyData || []}
            optionLabelKey="Party_Name"
            disabled={!form.getValues("ledgerId") || !(partyData.length > 0)}
            loading={checkReceiptPartyLoading}
          />

          <InputField
            control={form.control}
            name="amount"
            label="Amount"
            type="number"
          />

          <RadioField
            control={form.control}
            name="transMode"
            label="Trans Mode"
            orientation="horizontal"
            className="border-0 bg-transparent px-0 py-0 rounded-none h-12 flex items-center"
            options={[
              {
                value: "C",
                label: "Cash",
              },
              {
                value: "B",
                label: "Bank",
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
              loading={getBankAccountLoading}
            />
          )}
        </div>

        <div className={formActionsClassName}>
          <Button
            type="submit"
            color="primary"
            size="lg"
            radius="sm"
            className={formSubmitButtonClassName}
            isLoading={addReceiptLoading}
            isDisabled={addReceiptLoading}
          >
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default ReceiptForm;
