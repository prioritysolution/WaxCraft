"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import { Form } from "@/components/ui/form";
import { BankWithdrawnFormProps } from "@/types/accountVoucher/BankWithdrawnTypes";
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

const BankWithdrawnForm: FC<BankWithdrawnFormProps> = ({
  getBankAccountLoading,
  addBankWithdrawnLoading,
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
        <h3 className={formTitleClassName}>Add New Withdrawn</h3>
        <Divider />
        <div className={formGridClassName}>
          <DatePickerField
            control={form.control}
            name="withdrawnDate"
            label="Withdrawn date"
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
            name="bankId"
            label="Bank"
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
            isLoading={addBankWithdrawnLoading}
            isDisabled={addBankWithdrawnLoading}
          >
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default BankWithdrawnForm;
