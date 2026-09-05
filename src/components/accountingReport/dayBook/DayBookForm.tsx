"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import { Form } from "@/components/ui/form";
import {
  pageFormClassName,
  formGridClassName,
} from "@/lib/uiStyles";
import { DayBookFormProps } from "@/types/accountingReport/DayBookTypes";
import { Button } from "@heroui/react";
import { FC } from "react";

const DayBookForm: FC<DayBookFormProps> = ({
  getDayBookLoading,
  form,
  handleSubmit,
  dayBookData,
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
          <Button
            type="submit"
            color="primary"
            size="lg"
            radius="sm"
            className="w-full sm:w-40"
            isLoading={getDayBookLoading}
            isDisabled={getDayBookLoading}
          >
            Process
          </Button>

          <Button
            color="primary"
            size="lg"
            radius="sm"
            className="w-full sm:w-40 bg-blue-500 text-white"
            onPress={() => setShowPrintDialog(true)}
            isDisabled={!(dayBookData.length > 0)}
          >
            Preview
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default DayBookForm;
