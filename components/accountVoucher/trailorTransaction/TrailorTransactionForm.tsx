"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import RadioField from "@/common/formFields/RadioFields";
import { Form } from "@/components/ui/form";
import {
  formActionsClassName,
  formGridClassName,
  formSubmitButtonClassName,
  pageFormClassName,
} from "@/lib/uiStyles";
import { TrailorTransactionFormProps } from "@/types/accountVoucher/TrailorTransactionTypes";
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

const TrailorTransactionForm: FC<TrailorTransactionFormProps> = ({
  getUserLoading,
  loading,
  form,
  handleSubmit,
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
            name="date"
            label="Transaction date"
            startYear={2000}
            endYear={2050}
          />

          <DropdownField
            control={form.control}
            name="userId"
            label="User"
            options={userListData || []}
            optionLabelKey="User_Name"
            loading={getUserLoading}
          />

          <InputField
            control={form.control}
            name="balance"
            label="Balance"
            disabled
          />

          <RadioField
            control={form.control}
            name="transType"
            label="Transaction Type"
            orientation="horizontal"
            className="flex h-12 items-center bg-white"
            options={[
              {
                value: "R",
                label: "Received",
              },
              {
                value: "P",
                label: "Payment",
              },
            ]}
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
            size="md"
            radius="md"
            className={formSubmitButtonClassName}
            isLoading={loading}
            isDisabled={loading}
          >
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default TrailorTransactionForm;
