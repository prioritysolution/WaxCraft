"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { Form } from "@/components/ui/form";
import {
  pageFormClassName,
  formGridClassName,
} from "@/lib/uiStyles";
import { TrailorCashbookFormProps } from "@/types/accountingReport/TrailorCashbookTypes";
import { Button } from "@heroui/react";
import { FC } from "react";
import { useSelector } from "react-redux";

// Define types for User Data
interface UserData {
  Id: number;
  User_Name: string;
}

// Define state for TrailorTransaction, including user data
interface TrailorTransactionState {
  trailorUserData: UserData[];
}

// Define the structure of RootState to include trailorTransaction state
interface RootState {
  trailorTransaction: TrailorTransactionState;
}

const TrailorCashbookForm: FC<TrailorCashbookFormProps> = ({
  getTrailorCashbookLoading,
  form,
  handleSubmit,
  trailorCashbookData,
  setShowPrintDialog,
}) => {
  const userListData = useSelector(
    (state: RootState) => state?.trailorTransaction?.trailorUserData
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
            name="asOnDate"
            label="As On date"
            startYear={2000}
            endYear={2050}
          />

          <DropdownField
            control={form.control}
            name="userId"
            label="User"
            options={userListData || []}
            optionLabelKey="User_Name"
          />
        </div>

        <div className="flex w-full items-center justify-end gap-2">
          <Button
            type="submit"
            color="primary"
            size="lg"
            radius="sm"
            className="w-full sm:w-40"
            isLoading={getTrailorCashbookLoading}
            isDisabled={getTrailorCashbookLoading}
          >
            Process
          </Button>

          <Button
            color="primary"
            size="lg"
            radius="sm"
            className="w-full sm:w-40 bg-blue-500 text-white"
            onPress={() => setShowPrintDialog(true)}
            isDisabled={!(trailorCashbookData.length > 0)}
          >
            Preview
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default TrailorCashbookForm;
