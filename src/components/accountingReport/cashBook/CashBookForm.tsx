"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import { Form } from "@/components/ui/form";
import { FormSubmitButton } from "@/components/ui/form-actions";
import {
  pageFormClassName,
  formGridClassName,
  reportActionButtonClassName,
} from "@/lib/uiStyles";
import { CashBookFormProps } from "@/types/accountingReport/CashBookTypes";
import { FC } from "react";

const CashBookForm: FC<CashBookFormProps> = ({
  getCashBookLoading,
  form,
  handleSubmit,
  cashBookData,
  setShowPrintDialog,
}) => {
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
            name="asOnDate"
            label="As On date"
            startYear={2000}
            endYear={2050}
          />
        </div>

        <div className="flex w-full items-center justify-end gap-2">
          <FormSubmitButton
            className={reportActionButtonClassName}
            isLoading={getCashBookLoading}
            isDisabled={getCashBookLoading}
          >
            Process
          </FormSubmitButton>

          <FormSubmitButton
            type="button"
            className={`${reportActionButtonClassName} !bg-blue-500 text-white data-[hover=true]:!bg-blue-600`}
            onPress={() => setShowPrintDialog(true)}
            isDisabled={!(cashBookData.length > 0)}
          >
            Preview
          </FormSubmitButton>
        </div>
      </form>
    </Form>
  );
};
export default CashBookForm;
