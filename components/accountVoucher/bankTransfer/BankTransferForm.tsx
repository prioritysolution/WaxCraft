"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import { Form } from "@/components/ui/form";
import { BankTransferFormProps } from "@/types/accountVoucher/BankTransferTypes";
import { BankAccountTableData } from "@/types/master/BankAccountTypes";
import {
  formActionsClassName,
  formGridClassName,
  formSubmitButtonClassName,
  formTitleClassName,
  pageFormClassName,
} from "@/lib/uiStyles";
import { Button, Divider } from "@heroui/react";
import { FC } from "react";
import { useSelector } from "react-redux";

interface BankAccountState {
  bankAccountData: BankAccountTableData[];
}

interface RootState {
  bankAccount: BankAccountState;
}

const BankTransferForm: FC<BankTransferFormProps> = ({
  getBankAccountLoading,
  addBankTransferLoading,
  form,
  handleSubmit,
}) => {
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
        <h3 className={formTitleClassName}>Add New Transfer</h3>
        <Divider />
        <div className={formGridClassName}>
          <DatePickerField
            control={form.control}
            name="transferDate"
            label="Transfer date"
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

          <DropdownField
            control={form.control}
            name="sendersBankId"
            label="Senders Bank"
            options={bankAccountData || []}
            optionLabelKey="Bank_Name"
            loading={getBankAccountLoading}
          />

          <InputField
            control={form.control}
            name="availableBalance"
            label="Available Balance"
            disabled
          />

          <DropdownField
            control={form.control}
            name="receiversBankId"
            label="Receivers Bank"
            options={
              bankAccountData.filter(
                (bank) => bank.Id.toString() !== form.getValues("sendersBankId")
              ) || []
            }
            optionLabelKey="Bank_Name"
            loading={getBankAccountLoading}
            disabled={!form.getValues("sendersBankId")}
          />

          <InputField
            control={form.control}
            name="amount"
            label="Amount"
            type="number"
          />
        </div>

        <div className={formActionsClassName}>
          <Button
            type="submit"
            color="primary"
            size="lg"
            radius="sm"
            className={formSubmitButtonClassName}
            isLoading={addBankTransferLoading}
            isDisabled={addBankTransferLoading}
          >
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default BankTransferForm;
