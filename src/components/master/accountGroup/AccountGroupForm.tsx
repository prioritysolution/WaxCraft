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
import {
  AccountGroupFormProps,
  AccountMainHeadData,
} from "@/types/master/AccountGroupTypes";
import { FC } from "react";
import { useSelector } from "react-redux";

interface AccountGroupState {
  accountMainHeadData: AccountMainHeadData[];
}

interface RootState {
  accountGroup: AccountGroupState;
}

const AccountGroupForm: FC<AccountGroupFormProps> = ({
  addAccountGroupLoading,
  updateAccountGroupLoading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  handleSearchMainHead,
  handleScrollMainHead,
  mainHeadInput,
  setMainHeadInput,
  getMainHeadLoading,
}) => {
  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = addAccountGroupLoading || updateAccountGroupLoading;

  const accountMainHeadData: AccountMainHeadData[] = useSelector(
    (state: RootState) => state?.accountGroup?.accountMainHeadData
  );

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
            title={isEdit ? "Edit Account Group" : "Add New Account Group"}
            description={
              isEdit
                ? "Update the head details and save your changes."
                : "Enter a head name and choose the parent head."
            }
            isEdit={isEdit}
            onClose={() => setIsOpen(false)}
            isBusy={isBusy}
          />
          <FormModalBody>
            <InputField
              control={form.control}
              name="headName"
              label="Head Name"
            />

            <SearchDropdownField
              label="Under Head"
              name="underHeadId"
              control={form.control}
              options={accountMainHeadData || []}
              optionLabelKey="Head_Name"
              handleSearch={handleSearchMainHead}
              loadMore={handleScrollMainHead}
              input={mainHeadInput}
              setInput={setMainHeadInput}
              loading={getMainHeadLoading}
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
export default AccountGroupForm;
