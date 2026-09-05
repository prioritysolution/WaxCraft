"use client";

import InputField from "@/common/formFields/InputField";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";
import { Form } from "@/components/ui/form";
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import { AccountGroupTableData } from "@/types/master/AccountGroupTypes";
import {
  AccountLedgerFormProps,
  AccountMainHeadData,
} from "@/types/master/AccountLedgerTypes";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface AccountGroupState {
  accountMainHeadData: AccountMainHeadData[];
  accountGroupData: AccountGroupTableData[];
}

interface RootState {
  accountGroup: AccountGroupState;
}

const AccountLedgerForm: FC<AccountLedgerFormProps> = ({
  addAccountLedgerLoading,
  updateAccountLedgerLoading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  handleSearchMainHead,
  handleScrollMainHead,
  handleSearchHead,
  handleScrollHead,
  mainHeadInput,
  setMainHeadInput,
  headInput,
  setHeadInput,
  getMainHeadLoading,
  getHeadLoading,
}) => {
  const [startYear, setStartYear] = useState<string | null>(null);

  const accountMainHeadData: AccountMainHeadData[] = useSelector(
    (state: RootState) => state?.accountGroup?.accountMainHeadData
  );

  const accountGroupData: AccountGroupTableData[] = useSelector(
    (state: RootState) => state?.accountGroup?.accountGroupData
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      setStartYear(getCookieData<string | null>("waxCraftClientFinStartDate"));
    }
  }, []);

  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = addAccountLedgerLoading || updateAccountLedgerLoading;

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
            title={isEdit ? "Edit Account Ledger" : "Add New Account Ledger"}
            description={
              isEdit
                ? "Update ledger details and save your changes."
                : "Enter ledger details and choose the parent heads."
            }
            isEdit={isEdit}
            onClose={() => setIsOpen(false)}
            isBusy={isBusy}
          />
          <FormModalBody>
              <InputField
                control={form.control}
                name="ledgerName"
                label="Ledger Name"
              />

              <SearchDropdownField
                label="Under Main Head"
                name="underMainHeadId"
                control={form.control}
                options={accountMainHeadData || []}
                optionLabelKey="Head_Name"
                handleSearch={handleSearchMainHead}
                loadMore={handleScrollMainHead}
                input={mainHeadInput}
                setInput={setMainHeadInput}
                loading={getMainHeadLoading}
              />

              <SearchDropdownField
                label="Under Head"
                name="underHeadId"
                control={form.control}
                options={accountGroupData || []}
                optionLabelKey="Sub_Head_Name"
                handleSearch={handleSearchHead}
                loadMore={handleScrollHead}
                input={headInput}
                setInput={setHeadInput}
                loading={getHeadLoading}
              />

              <InputField
                control={form.control}
                name="openingBalance"
                label={`Opening Balance (As On ${
                  startYear && format(startYear, "dd-MM-yyyy")
                })`}
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
export default AccountLedgerForm;
