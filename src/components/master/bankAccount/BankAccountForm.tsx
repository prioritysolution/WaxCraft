"use client";

import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import { Form } from "@/components/ui/form";
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import { BankAccountFormProps } from "@/types/master/BankAccountTypes";
import { FC, FormEvent } from "react";
import { useSelector } from "react-redux";
import { DatePickerField } from "@/common/formFields/DatePickerField";

interface BankLedger {
  Id: number;
  Ledger_Name: string;
}

interface BankAccountState {
  bankLedgerData: BankLedger[];
}

interface RootState {
  bankAccount: BankAccountState;
}

const BankAccountForm: FC<BankAccountFormProps> = ({
  addBankAccountLoading,
  updateBankAccountLoading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  getBankLedgerLoading,
}) => {
  const bankLedgerData: BankLedger[] = useSelector(
    (state: RootState) => state?.bankAccount?.bankLedgerData
  );

  const handleStopPropagation = (e: FormEvent) => {
    e.stopPropagation();
  };

  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = addBankAccountLoading || updateBankAccountLoading;

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      size="md"
      isBusy={isBusy}
    >
      <Form {...form}>
        <form
          className="flex w-full flex-col"
          autoComplete="off"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormModalHeader
            title={isEdit ? "Edit Bank Account" : "Add New Bank Account"}
            description={
              isEdit
                ? "Update bank account details and save your changes."
                : "Enter bank details and opening balance."
            }
            isEdit={isEdit}
            onClose={() => setIsOpen(false)}
            isBusy={isBusy}
          />
          <FormModalBody>
              <InputField
                control={form.control}
                name="bankName"
                label="Bank Name"
              />

              <InputField
                control={form.control}
                name="branchName"
                label="Branch Name"
              />

              <InputField control={form.control} name="ifsc" label="IFSC" />

              <InputField
                control={form.control}
                name="accountNo"
                label="Account No."
                type="number"
              />

              <DropdownField
                label="Ledger"
                name="ledgerId"
                control={form.control}
                options={bankLedgerData || []}
                optionLabelKey="Ledger_Name"
                loading={getBankLedgerLoading}
              />

              <div onFocus={handleStopPropagation}>
                <DatePickerField
                  control={form.control}
                  name="openingDate"
                  label="Opening date"
                  startYear={2000}
                  endYear={2050}
                />
              </div>

              <InputField
                control={form.control}
                name="openingBalance"
                label="Opening Balance"
                type="number"
              />
          </FormModalBody>
          <FormModalFooter
            isBusy={isBusy}
            onCancel={() => setIsOpen(false)}
            submitLabel={isEdit ? "Save" : "Add"}
          />
        </form>
      </Form>
    </FormModal>
  );
};
export default BankAccountForm;
