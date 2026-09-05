"use client";

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
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
} from "@heroui/react";
import { ImageIcon, X } from "lucide-react";
import { FC, useEffect, useMemo, useState } from "react";
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

/** Item names follow: Category - Model - Size [- Colour] */
const getSizeFromItemName = (itemName: string): string => {
  const parts = (itemName || "").split(" - ");
  return parts.length >= 3 ? parts[2].trim() : "";
};

const compareItemNamesBySizeAsc = (nameA: string, nameB: string): number => {
  const sizeA = getSizeFromItemName(nameA);
  const sizeB = getSizeFromItemName(nameB);

  if (!sizeA && !sizeB) {
    return nameA.localeCompare(nameB, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }
  if (!sizeA) return 1;
  if (!sizeB) return -1;

  const numA = Number.parseFloat(sizeA);
  const numB = Number.parseFloat(sizeB);
  const isNumA =
    !Number.isNaN(numA) && /^-?\d+(\.\d+)?$/.test(sizeA);
  const isNumB =
    !Number.isNaN(numB) && /^-?\d+(\.\d+)?$/.test(sizeB);

  if (isNumA && isNumB && numA !== numB) return numA - numB;

  const sizeCompare = sizeA.localeCompare(sizeB, undefined, {
    numeric: true,
    sensitivity: "base",
  });
  if (sizeCompare !== 0) return sizeCompare;

  return nameA.localeCompare(nameB, undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

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
  itemInput,
  setItemInput,
  getCategoryLoading,
  getItemLoading,
}) => {
  const [showImagePreview, setShowImagePreview] = useState(false);

  const itemCategoryData: ItemCategoryTableData[] = useSelector(
    (state: RootState) => state?.itemCategory?.itemCategoryData,
  );

  const itemData: ItemTableData[] = useSelector(
    (state: RootState) => state?.item?.itemData,
  );

  const isEdit = !!(editData && Object.keys(editData).length > 0);
  const isBusy = addDesignLoading || updateDesignLoading;
  const lockDesignFields = designFormTableData.length > 0;
  const categoryId = form.watch("categoryId");
  const designName = form.watch("designName");

  useEffect(() => {
    if (!isOpen) setShowImagePreview(false);
  }, [isOpen]);

  const filteredItemOptions = useMemo(() => {
    const list = itemData || [];
    const query = itemInput.trim().toLowerCase();
    if (!query) return list;

    return list.filter((item) => {
      const name = String(item.Item_Name ?? "").toLowerCase();
      const shortName = String(item.Item_Sh_Name ?? "").toLowerCase();
      return name.includes(query) || shortName.includes(query);
    });
  }, [itemData, itemInput]);

  const sortedDesignFormTableData = useMemo(
    () =>
      designFormTableData
        .map((data, originalIndex) => ({ data, originalIndex }))
        .sort((a, b) =>
          compareItemNamesBySizeAsc(
            String(a.data.itemName ?? ""),
            String(b.data.itemName ?? ""),
          ),
        ),
    [designFormTableData],
  );

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
    <>
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
              />

              <InputField
                control={form.control}
                name="designNo"
                label="Design No."
              />

              <InputField
                control={form.control}
                name="wt"
                label="WT"
                type="number"
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
                      {photoPreview ? (
                        <button
                          type="button"
                          aria-label="View design image"
                          className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-[#F7F5F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                          onClick={() => setShowImagePreview(true)}
                        >
                          <Image
                            src={photoPreview}
                            alt="Photo Preview"
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        </button>
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-[#F7F5F3]">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
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

              <SearchDropdownField
                label="Item"
                name="itemId"
                control={form.control}
                options={filteredItemOptions}
                optionLabelKey="Item_Name"
                handleSearch={() => undefined}
                loadMore={() => undefined}
                input={itemInput}
                setInput={setItemInput}
                loading={getItemLoading}
                disabled={!categoryId}
                hideContent={!categoryId}
                placeholder="Search item"
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
                      sortedDesignFormTableData.map(
                        ({ data, originalIndex }, index) => (
                          <tr
                            key={`${originalIndex}-${data.itemId ?? ""}-${index}`}
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
                                  onPress={() =>
                                    handleDeleteFormTableData(originalIndex)
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                        ),
                      )
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

      <Modal
        isOpen={showImagePreview && Boolean(photoPreview)}
        onOpenChange={(open) => {
          if (!open) setShowImagePreview(false);
        }}
        placement="center"
        hideCloseButton
        backdrop="blur"
        size="lg"
        classNames={{
          wrapper: "z-[100] items-center justify-center p-4",
          base: "mx-auto w-full max-w-[560px] overflow-hidden rounded-[20px] border border-[#D1D1D1] bg-white shadow-none",
          backdrop: "z-[100] bg-black/35",
          body: "p-0",
        }}
      >
        <ModalContent>
          <ModalBody>
            <div className="relative flex min-h-[280px] flex-col items-center justify-center gap-4 p-6 sm:p-8">
              <button
                type="button"
                aria-label="Close image preview"
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-black/[0.05] hover:text-foreground"
                onClick={() => setShowImagePreview(false)}
              >
                <X className="h-4 w-4" />
              </button>
              {photoPreview ? (
                <>
                  <p className="max-w-full truncate text-center text-sm font-medium text-foreground">
                    {designName || editData?.Design_Name || "Design"}
                  </p>
                  <div className="flex w-full items-center justify-center">
                    <Image
                      src={photoPreview}
                      alt={designName || editData?.Design_Name || "Design"}
                      className="max-h-[min(70vh,480px)] w-auto max-w-full rounded-xl object-contain"
                    />
                  </div>
                </>
              ) : null}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default DesignForm;
