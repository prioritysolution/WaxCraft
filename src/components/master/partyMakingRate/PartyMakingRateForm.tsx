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
import { PartyMakingRateFormProps } from "@/types/master/PartyMakingRateTypes";
import { FC } from "react";

const PartyMakingRateForm: FC<PartyMakingRateFormProps> = ({
  addPartyMakingRateLoading,
  updatePartyMakingRateLoading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  partyOptions,
  partyInput,
  setPartyInput,
  handleSearchParty,
  handleScrollParty,
  getPartyLoading,
}) => {
  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = addPartyMakingRateLoading || updatePartyMakingRateLoading;

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      size="sm"
      isBusy={isBusy}
    >
      <Form {...form}>
        <form
          className="flex w-full flex-col"
          autoComplete="off"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormModalHeader
            title={
              isEdit ? "Edit Party Making Rate" : "Add Party Making Rate"
            }
            description={
              isEdit
                ? "Update the party making rate and save your changes."
                : "Select a party and enter the making rate."
            }
            isEdit={isEdit}
            onClose={() => setIsOpen(false)}
            isBusy={isBusy}
          />
          <FormModalBody>
            <SearchDropdownField
              label="Party"
              name="partyId"
              control={form.control}
              options={partyOptions || []}
              optionLabelKey="Party_Name"
              handleSearch={handleSearchParty}
              loadMore={handleScrollParty}
              input={partyInput}
              setInput={setPartyInput}
              loading={getPartyLoading}
            />
            <InputField
              control={form.control}
              name="makingRate"
              label="Making Rate"
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

export default PartyMakingRateForm;
