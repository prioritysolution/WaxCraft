"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { Form } from "@/components/ui/form";
import { FormSubmitButton } from "@/components/ui/form-actions";
import {
  pageFormClassName,
  formGridClassName,
  reportActionButtonClassName,
} from "@/lib/uiStyles";
import { BankLedgerFormProps } from "@/types/accountingReport/BankLedgerTypes";
import { BankAccountTableData } from "@/types/master/BankAccountTypes";
import { FC } from "react";
import { useSelector } from "react-redux";

interface BankAccountState {
  bankAccountData: BankAccountTableData[];
}

interface RootState {
  bankAccount: BankAccountState;
}

const BankLedgerForm: FC<BankLedgerFormProps> = ({
  getBankLedgerLoading,
  form,
  handleSubmit,
  bankLedgerData,
  setShowPrintDialog,
  getBankAccountLoading,
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
        <div className={formGridClassName}>
          <DatePickerField
            control={form.control}
            name="fromDate"
            label="From date"
            startYear={2000}
            endYear={2050}
          />

          <DatePickerField
            control={form.control}
            name="toDate"
            label="To date"
            startYear={2000}
            endYear={2050}
          />

          <DropdownField
            control={form.control}
            name="bankId"
            label="Bank"
            options={bankAccountData || []}
            optionLabelKey="Bank_Name"
            loading={getBankAccountLoading}
          />
        </div>

        <div className="flex w-full items-center justify-end gap-2">
          <FormSubmitButton
            className={reportActionButtonClassName}
            isLoading={getBankLedgerLoading}
            isDisabled={getBankLedgerLoading}
          >
            Process
          </FormSubmitButton>

          <FormSubmitButton
            type="button"
            className={`${reportActionButtonClassName} !bg-blue-500 text-white data-[hover=true]:!bg-blue-600`}
            onPress={() => setShowPrintDialog(true)}
            isDisabled={!(bankLedgerData.length > 0)}
          >
            Preview
          </FormSubmitButton>
        </div>
      </form>
    </Form>
  );
};
export default BankLedgerForm;
