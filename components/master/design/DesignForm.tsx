"use client";

import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FormModal,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import {
  TableDeleteButton,
  TableNameCell,
  formatTableSerial,
} from "@/components/ui/table-edit-button";
import { Input } from "@/components/ui/input";
import { ItemCategoryTableData } from "@/types/master/ItemCategoryTypes";
import { DesignFormProps } from "@/types/master/DesignTypes";
import { ItemTableData } from "@/types/master/ItemTypes";
import { formatTwoDecimals } from "@/utils/formatDecimal";
import { Button, Image } from "@heroui/react";
import { ImageIcon } from "lucide-react";
import { FC } from "react";
import { useSelector } from "react-redux";

interface ItemCategoryState {
  itemCategoryData: ItemCategoryTableData[];
}

interface ItemState {
  itemData: ItemTableData[];
}

interface RootState {
  itemCategory: ItemCategoryState;
  item: ItemState;
}

const DesignForm: FC<DesignFormProps> = ({
  addDesignLoading,
  updateDesignLoading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  designFormTableData,
  handleDeleteFormTableData,
  handleAddDesign,
  photoPreview,
  handlePhotoChange,
  handleSearchCategory,
  handleScrollCategory,
  categoryInput,
  setCategoryInput,
  getCategoryLoading,
  getItemLoading,
}) => {
  const itemCategoryData: ItemCategoryTableData[] = useSelector(
    (state: RootState) => state?.itemCategory?.itemCategoryData,
  );

  const itemData: ItemTableData[] = useSelector(
    (state: RootState) => state?.item?.itemData,
  );

  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = addDesignLoading || updateDesignLoading;
  const lockDesignFields = designFormTableData.length > 0;

  const handleAddToTablePress = async () => {
    const fieldsToValidate = lockDesignFields
      ? (["categoryId", "itemId", "quantity", "makingRate", "wtRate"] as const)
      : ([
          "designName",
          "designNo",
          "wt",
          "wtRate",
          "polish",
          "designImage",
          "categoryId",
          "itemId",
          "quantity",
          "makingRate",
        ] as const);

    const isValid = await form.trigger([...fieldsToValidate]);
    if (!isValid) return;

    handleSubmit(form.getValues());
  };

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      size="3xl"
      isBusy={isBusy}
    >
      <Form {...form}>
        <form
          className="flex max-h-[min(88dvh,calc(100dvh-1.5rem))] min-h-0 w-full flex-col overflow-hidden"
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            void handleAddToTablePress();
          }}
        >
          <FormModalHeader
            title={isEdit ? "Edit Design" : "Add New Design"}
            description={
              isEdit
                ? "Update design details and save your changes."
                : "Enter design details and add items to the list."
            }
            isEdit={isEdit}
            onClose={() => setIsOpen(false)}
            isBusy={isBusy}
          />
          <div
            className="wc-form-modal-body flex min-h-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-4 sm:px-5"
            style={{
              maxHeight: "calc(min(88dvh, 100dvh - 1.5rem) - 10.5rem)",
            }}
          >
            <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-x-5">
              <InputField
                control={form.control}
                name="designName"
                label="Design Name"
                disabled={lockDesignFields}
              />

              <InputField
                control={form.control}
                name="designNo"
                label="Design No."
                disabled={lockDesignFields}
              />

              <InputField
                control={form.control}
                name="wt"
                label="WT"
                type="number"
                disabled={lockDesignFields}
              />

              <InputField
                control={form.control}
                name="wtRate"
                label="WT Rate"
                type="number"
              />

              <InputField
                control={form.control}
                name="polish"
                label="Polish"
                type="number"
                disabled={lockDesignFields}
              />

              <FormField
                control={form.control}
                name="designImage"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Design Image
                    </FormLabel>
                    <div className="flex min-w-0 flex-col gap-3 xs:flex-row xs:items-center">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-[#F7F5F3]">
                        {photoPreview ? (
                          <Image
                            src={photoPreview}
                            alt="Photo Preview"
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <FormControl>
                        <Input
                          key={isEdit ? `design-image-${editData?.Id}` : "design-image-new"}
                          placeholder="Upload photo"
                          type="file"
                          accept=".png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif"
                          className="h-11 min-w-0 w-full rounded-2xl border border-black/15 bg-[#F7F5F3] px-3 text-sm shadow-none file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground disabled:text-muted-foreground focus-visible:border-black/25 focus-visible:outline-none focus-visible:ring-0"
                          onChange={(e) => {
                            handlePhotoChange(e);
                          }}
                          disabled={isBusy}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SearchDropdownField
                label="Category"
                name="categoryId"
                control={form.control}
                options={itemCategoryData || []}
                optionLabelKey="Cat_Name"
                handleSearch={handleSearchCategory}
                loadMore={handleScrollCategory}
                input={categoryInput}
                setInput={setCategoryInput}
                loading={getCategoryLoading}
              />

              <DropdownField
                label="Item"
                name="itemId"
                control={form.control}
                options={itemData || []}
                optionLabelKey="Item_Name"
                loading={getItemLoading}
              />

              <InputField
                control={form.control}
                name="quantity"
                label="Quantity"
                type="number"
              />

              <InputField
                control={form.control}
                name="makingRate"
                label="Making Rate"
                type="number"
              />

              <div className="flex justify-stretch sm:col-span-2 sm:justify-end">
                <Button
                  color="success"
                  variant="solid"
                  type="button"
                  radius="md"
                  className="h-11 w-full min-w-0 bg-[#22C55E] px-4 text-sm font-medium text-white shadow-none transition-all data-[hover=true]:!bg-[#16A34A] sm:w-auto sm:min-w-[148px]"
                  onPress={() => {
                    void handleAddToTablePress();
                  }}
                >
                  Add To Table
                </Button>
              </div>
            </div>

            <div className="min-w-0 rounded-xl border border-black/[0.06]">
              <div
                className={
                  designFormTableData.length > 4
                    ? "max-h-[280px] w-full overflow-x-auto overflow-y-auto overscroll-contain"
                    : "w-full overflow-x-auto overflow-y-visible"
                }
              >
                <table className="w-full min-w-[520px] border-collapse text-center">
                  <thead className="sticky top-0 z-[1]">
                    <tr className="bg-[#F7F5F3]">
                      <th className="w-[110px] bg-[#F7F5F3] px-3 py-3 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:px-4">
                        Serial No.
                      </th>
                      <th className="bg-[#F7F5F3] px-3 py-3 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:px-4">
                        Item Name
                      </th>
                      <th className="bg-[#F7F5F3] px-3 py-3 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:px-4">
                        Quantity
                      </th>
                      <th className="bg-[#F7F5F3] px-3 py-3 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:px-4">
                        Making Rate
                      </th>
                      <th className="w-[96px] bg-[#F7F5F3] px-3 py-3 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:px-4">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {designFormTableData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-10 text-center text-sm text-muted-foreground"
                        >
                          No data found.
                        </td>
                      </tr>
                    ) : (
                      designFormTableData.map((data, index) => (
                        <tr
                          key={index}
                          className="border-b border-black/[0.05] last:border-b-0"
                        >
                          <td className="px-3 py-3.5 text-center text-sm tabular-nums text-muted-foreground sm:px-4">
                            {formatTableSerial(index)}
                          </td>
                          <td className="min-w-0 px-3 py-3.5 text-center sm:px-4">
                            <div className="flex justify-center">
                              <TableNameCell name={data.itemName} />
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-center text-sm sm:px-4">
                            {String(data.quantity ?? "")}
                          </td>
                          <td className="px-3 py-3.5 text-center text-sm sm:px-4">
                            {formatTwoDecimals(data.makingRate, "")}
                          </td>
                          <td className="px-3 py-3.5 text-center sm:px-4">
                            <div className="inline-flex justify-center">
                              <TableDeleteButton
                                onPress={() => handleDeleteFormTableData(index)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <FormModalFooter
            isBusy={isBusy}
            onCancel={() => setIsOpen(false)}
            submitLabel={isEdit ? "Save" : "Add"}
            submitType="button"
            onSubmitPress={handleAddDesign}
          />
        </form>
      </Form>
    </FormModal>
  );
};
export default DesignForm;
