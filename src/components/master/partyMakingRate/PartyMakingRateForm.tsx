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
import { fieldInputClassNames } from "@/lib/uiStyles";
import {
  PartyMakingRateFormData,
  PartyMakingRateFormProps,
} from "@/types/master/PartyMakingRateTypes";
import { sanitizeRateInput } from "@/utils/formatDecimal";
import { Input, Spinner } from "@heroui/react";
import { Search, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

const MakingRateCell: FC<{
  name: `rows.${number}.makingRate`;
  label: string;
}> = ({ name, label }) => {
  const { control } = useFormContext<PartyMakingRateFormData>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Input
          aria-label={label}
          size="sm"
          radius="lg"
          variant="bordered"
          placeholder="Optional"
          inputMode="decimal"
          value={field.value ?? ""}
          onValueChange={(value) => field.onChange(sanitizeRateInput(value))}
          onBlur={field.onBlur}
          isInvalid={!!fieldState.error}
          errorMessage={fieldState.error?.message}
          classNames={{
            ...fieldInputClassNames,
            inputWrapper: "h-9 min-h-9 rounded-xl bg-white",
            errorMessage: "text-xs",
          }}
        />
      )}
    />
  );
};

const PartyMakingRateForm: FC<PartyMakingRateFormProps> = ({
  savePartyMakingRateLoading,
  rowsLoading,
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
  getModelLoading,
}) => {
  const [modelFilter, setModelFilter] = useState("");
  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = savePartyMakingRateLoading;
  const partyId = useWatch({ control: form.control, name: "partyId" });
  const rows = useWatch({ control: form.control, name: "rows" }) || [];
  const query = modelFilter.trim().toLowerCase();
  const visibleRows = rows
    .map((row, index) => ({ row, index }))
    .filter(
      ({ row }) =>
        !query || String(row.modelName || "").toLowerCase().includes(query),
    );
  const filledCount = rows.filter((row) => row.makingRate).length;
  const hasExisting = rows.some((row) => row.makingRateId);
  const modelsLoading = Boolean(partyId) && (getModelLoading || rowsLoading);

  useEffect(() => {
    if (!isOpen) setModelFilter("");
  }, [isOpen]);

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      size="3xl"
      isBusy={isBusy}
    >
      <Form {...form}>
        <form
          className="flex w-full flex-col"
          autoComplete="off"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormModalHeader
            title={isEdit ? "Edit Party Making Rate" : "Add Party Making Rate"}
            description={
              isEdit
                ? "WT rate, ghat, and polish apply once for this party. Making rate is entered per item model."
                : "Choose a party, then set WT rate, ghat, and polish once. Enter a making rate only where a model needs one."
            }
            isEdit={isEdit}
            onClose={() => setIsOpen(false)}
            isBusy={isBusy}
          />
          <FormModalBody>
            <div className="max-w-md">
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
            </div>

            {!partyId ? (
              <div className="rounded-xl border border-dashed border-black/10 bg-[#F7F5F3]/60 px-4 py-8 text-center text-sm text-muted-foreground">
                Select a party to enter WT rate, ghat, polish, and item model
                making rates.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <InputField
                    control={form.control}
                    name="wtRate"
                    label="WT Rate"
                    placeholder="Optional"
                    disabled={modelsLoading || isBusy}
                  />
                  <InputField
                    control={form.control}
                    name="ghat"
                    label="Ghat"
                    placeholder="Optional"
                    disabled={modelsLoading || isBusy}
                  />
                  <InputField
                    control={form.control}
                    name="polish"
                    label="Polish"
                    placeholder="Optional"
                    disabled={modelsLoading || isBusy}
                  />
                </div>

                <div className="overflow-hidden rounded-xl border border-black/[0.06]">
                  <div className="flex flex-col gap-3 border-b border-black/[0.06] px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Item models
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {modelsLoading
                          ? "Loading models and saved rates…"
                          : `${filledCount} of ${rows.length} models have a making rate. Making rate is optional.`}
                      </p>
                    </div>
                    <Input
                      aria-label="Search item model"
                      size="sm"
                      radius="lg"
                      variant="bordered"
                      placeholder="Search item model"
                      value={modelFilter}
                      onValueChange={setModelFilter}
                      isDisabled={modelsLoading}
                      startContent={
                        <Search className="h-3.5 w-3.5 text-muted-foreground" />
                      }
                      endContent={
                        modelFilter ? (
                          <button
                            type="button"
                            aria-label="Clear search"
                            className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/10 hover:text-foreground"
                            onClick={() => setModelFilter("")}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        ) : null
                      }
                      className="w-full sm:max-w-xs"
                      classNames={{
                        ...fieldInputClassNames,
                        inputWrapper: "h-9 min-h-9 rounded-xl bg-white",
                      }}
                    />
                  </div>

                  {modelsLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Spinner color="primary" />
                    </div>
                  ) : visibleRows.length === 0 ? (
                    <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                      {rows.length === 0
                        ? "No item models found."
                        : "No item model matches your search."}
                    </p>
                  ) : (
                    <div className="max-h-[min(52vh,28rem)] overflow-auto">
                      <table className="w-full border-collapse">
                        <thead className="sticky top-0 z-10 bg-[#F7F5F3]">
                          <tr className="text-left text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                            <th className="px-3 py-3 font-medium">
                              Item Model
                            </th>
                            <th className="w-[220px] px-3 py-3 font-medium">
                              Making Rate
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {visibleRows.map(({ row, index }) => (
                            <tr
                              key={`${row.modelId}-${index}`}
                              className="border-t border-black/[0.05]"
                            >
                              <td className="px-3 py-2 text-sm font-medium text-foreground">
                                {row.modelName || "-"}
                              </td>
                              <td className="px-3 py-2">
                                <MakingRateCell
                                  name={`rows.${index}.makingRate`}
                                  label={`Making rate for ${row.modelName}`}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </FormModalBody>
          <FormModalFooter
            isBusy={isBusy}
            onCancel={() => setIsOpen(false)}
            submitLabel={isEdit || hasExisting ? "Save" : "Add"}
          />
        </form>
      </Form>
    </FormModal>
  );
};

export default PartyMakingRateForm;
