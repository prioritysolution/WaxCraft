"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";
import { Form } from "@/components/ui/form";
import { FormSubmitButton } from "@/components/ui/form-actions";
import {
  pageFormClassName,
  formGridClassName,
  reportActionButtonClassName,
} from "@/lib/uiStyles";
import { AccountLedgerFormProps } from "@/types/accountingReport/AccountLedgerTypes";
import { FC } from "react";
import { useSelector } from "react-redux";

interface LedgerData {
  Id: number;
  Ledger_Name: string;
}

interface AccountLedgerReportState {
  accountLedgerListData: LedgerData[];
}

interface RootState {
  accountLedgerReport: AccountLedgerReportState;
}

const AccountLedgerForm: FC<AccountLedgerFormProps> = ({
  getAccountLedgerLoading,
  form,
  handleSubmit,
  accountLedgerData,
  setShowPrintDialog,
  handleSearchAccountLedger,
  handleScrollAccountLedger,
  accountLedgerInput,
  setAccountLedgerInput,
  getAccountLedgerListLoading,
}) => {
  const legderData: LedgerData[] = useSelector(
    (state: RootState) => state?.accountLedgerReport?.accountLedgerListData
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

          <SearchDropdownField
            label="Ledger"
            name="ledgerId"
            control={form.control}
            options={legderData || []}
            optionLabelKey="Ledger_Name"
            handleSearch={handleSearchAccountLedger}
            loadMore={handleScrollAccountLedger}
            input={accountLedgerInput}
            setInput={setAccountLedgerInput}
            loading={getAccountLedgerListLoading}
          />
        </div>

        <div className="flex w-full items-center justify-end gap-2">
          <FormSubmitButton
            className={reportActionButtonClassName}
            isLoading={getAccountLedgerLoading}
            isDisabled={getAccountLedgerLoading}
          >
            Process
          </FormSubmitButton>

          <FormSubmitButton
            type="button"
            className={`${reportActionButtonClassName} !bg-blue-500 text-white data-[hover=true]:!bg-blue-600`}
            onPress={() => setShowPrintDialog(true)}
            isDisabled={!(accountLedgerData.length > 0)}
          >
            Preview
          </FormSubmitButton>
        </div>
      </form>
    </Form>
  );
};
export default AccountLedgerForm;
