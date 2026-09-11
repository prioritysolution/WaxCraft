"use client";

import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import TextareaField from "@/common/formFields/TextareaField";
import { Form } from "@/components/ui/form";
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import { PartyFormProps } from "@/types/master/PartyTypes";
import { FC } from "react";
import { useSelector } from "react-redux";

interface LedgerData {
  Id: number;
  Ledger_Name: string;
}

interface PartyState {
  partyLedgerData: LedgerData[];
}

interface RootState {
  party: PartyState;
}

const PartyForm: FC<PartyFormProps> = ({
  addPartyLoading,
  updatePartyLoading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData = null,
  getPartyLedgerLoading,
}) => {
  const partyTypeData = [
    {
      Id: 1,
      Value: "Debtor",
    },
    {
      Id: 2,
      Value: "Creditor",
    },
  ];

  const partyLedgerData: LedgerData[] = useSelector(
    (state: RootState) => state?.party?.partyLedgerData
  );

  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = addPartyLoading || updatePartyLoading;

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      size="md"
      isBusy={isBusy}
      contentClassName="z-[100]"
    >
      <Form {...form}>
        <form
          className="flex w-full flex-col"
          autoComplete="off"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormModalHeader
            title={isEdit ? "Edit Party" : "Add New Party"}
            description={
              isEdit
                ? "Update party details and save your changes."
                : "Enter party details and choose the ledger."
            }
            isEdit={isEdit}
            onClose={() => setIsOpen(false)}
            isBusy={isBusy}
          />
          <FormModalBody>
              <DropdownField
                label="Party Type"
                name="partyType"
                control={form.control}
                options={partyTypeData || []}
              />

              <InputField
                control={form.control}
                name="partyName"
                label="Party Name"
              />

              <TextareaField
                control={form.control}
                name="address"
                label="Address"
              />

              <InputField
                control={form.control}
                name="mobileNo"
                label="Mobile"
                type="number"
              />

              <InputField control={form.control} name="email" label="Email" />

              <InputField control={form.control} name="gstin" label="GSTIN" />

              <DropdownField
                label="Under Ledger"
                name="underLedger"
                control={form.control}
                options={partyLedgerData || []}
                optionLabelKey="Ledger_Name"
                loading={getPartyLedgerLoading}
              />

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
export default PartyForm;
