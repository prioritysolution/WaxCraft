"use client";

import { tableClassNames } from "@/lib/uiStyles";

import InputField from "@/common/formFields/InputField";
import { Form } from "@/components/ui/form";
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DesignModalProps } from "@/types/inventoryVoucher/SamplePrintTypes";
import { DesignTableData } from "@/types/master/DesignTypes";
import {
  Button,
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { FC } from "react";
import { useSelector } from "react-redux";

interface OrderBookingState {
  orderDesignDetailsData: DesignTableData;
}

interface RootState {
  orderBooking: OrderBookingState;
}

const DesignModal: FC<DesignModalProps> = ({
  showDesignDialog,
  setShowDesignDialog,
  form,
  handleAddDesign,
  setDesignInput,
}) => {
  const designFormTableData = useSelector(
    (state: RootState) => state?.orderBooking?.orderDesignDetailsData
  );

  return (
    <FormModal
      isOpen={showDesignDialog}
      onOpenChange={setShowDesignDialog}
      size="3xl"
    >
      <Form {...form}>
        <form className="flex w-full flex-col" autoComplete="off">
          <FormModalHeader
            title="Add Design"
            description="Review design details and add it to the print."
            onClose={() => {
              setShowDesignDialog(false);
              form.setValue("designId", "");
              setDesignInput("");
            }}
          />
          <FormModalBody>
              <div className="grid sm:grid-cols-2 gap-x-5 gap-y-3">
                <InputField
                  control={form.control}
                  name="designName"
                  label="Design Name"
                  disabled
                />

                <InputField
                  control={form.control}
                  name="designNo"
                  label="Design No."
                  type="number"
                  disabled
                />

                <InputField
                  control={form.control}
                  name="wt"
                  label="WT"
                  type="number"
                  disabled
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

                <div className=" w-full flex justify-center">
                  <Image
                    src={form.getValues("image")}
                    alt="Design Image"
                    width={100}
                    height={100}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <ScrollArea className="w-full max-w-[400px] sm:max-w-full mx-auto mt-5">
                  <Table
                    removeWrapper
                    aria-label="Example static collection table"
                    classNames={tableClassNames}
                  >
                    <TableHeader>
                      <TableColumn>Serial No.</TableColumn>
                      <TableColumn align="center">Item Name</TableColumn>
                      <TableColumn align="center">Item Short Name</TableColumn>
                      <TableColumn align="center">Quantity</TableColumn>
                      <TableColumn align="center">Rate</TableColumn>
                      <TableColumn align="center">Making Rate</TableColumn>
                      <TableColumn align="center">Total</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No data found."}>
                      {(Array.isArray(designFormTableData)
                        ? []
                        : designFormTableData?.childrow
                      )?.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <InputField
                              control={form.control}
                              name={`item.${index}.itemName`}
                              // label="Item Name"
                              disabled
                              className="min-w-[70px]"
                            />
                          </TableCell>
                          <TableCell>
                            <InputField
                              control={form.control}
                              name={`item.${index}.itemShName`}
                              // label="Item ShName"
                              disabled
                              className="min-w-[70px]"
                            />
                          </TableCell>
                          <TableCell>
                            <InputField
                              control={form.control}
                              name={`item.${index}.itemQuantity`}
                              // label="Item Quantity"
                              disabled
                              className="min-w-[70px]"
                            />
                          </TableCell>
                          <TableCell>
                            <InputField
                              control={form.control}
                              name={`item.${index}.itemRate`}
                              // label="Item Rate"
                              type="number"
                              variant="bordered"
                              className="min-w-[70px]"
                            />
                          </TableCell>
                          <TableCell>
                            <InputField
                              control={form.control}
                              name={`item.${index}.makingRate`}
                              // label="Item Total"
                              variant="bordered"
                              className="min-w-[70px]"
                            />
                          </TableCell>
                          <TableCell>
                            <InputField
                              control={form.control}
                              name={`item.${index}.itemTotal`}
                              // label="Item Total"
                              disabled
                              className="min-w-[70px]"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <div className="w-full xs:w-[400px] sm:w-full mx-auto flex items-center justify-between">
                  <p className="sm:flex-grow sm:text-center font-semibold text-lg">
                    Item Grand Total
                  </p>
                  <p className="sm:min-w-[100px]">
                    {form.getValues("item")?.reduce((acc, item) => {
                      const rate = item.itemTotal
                        ? parseFloat(item.itemTotal)
                        : 0; // Convert string to number, default to 0 if invalid
                      return acc + rate;
                    }, 0) || 0}
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-5 gap-y-3">
                <InputField
                  control={form.control}
                  name="totalRate"
                  label="Total Rate"
                  disabled
                />
              </div>
          </FormModalBody>
          <FormModalFooter
            onCancel={() => {
              setShowDesignDialog(false);
              form.setValue("designId", "");
              setDesignInput("");
            }}
            submitLabel="Add"
            submitType="button"
            onSubmitPress={handleAddDesign}
          />
        </form>
      </Form>
    </FormModal>
  );
};
export default DesignModal;
