"use client";

import { tableClassNames } from "@/lib/uiStyles";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import SearchDropdownField from "@/common/formFields/SearchDropdrownField";
import { Form } from "@/components/ui/form";
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
} from "@/components/ui/form-modal";
import { OrderProcessFormProps } from "@/types/inventoryVoucher/OrderProcessTypes";
import { EmployeeTableData } from "@/types/master/EmployeeTypes";
import { WorkProcessTableData } from "@/types/master/WorkProcessTypes";
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
import { CheckCircle2, Workflow } from "lucide-react";
import { format } from "date-fns";
import { FC } from "react";
import { useSelector } from "react-redux";

interface EmployeeState {
  employeeData: EmployeeTableData[];
}

interface WorkProcessState {
  workProcessData: WorkProcessTableData[];
}

interface RootState {
  employee: EmployeeState;
  workProcess: WorkProcessState;
}

const OrderProcessForm: FC<OrderProcessFormProps> = ({
  addOrderProcessLoading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  dialogType,
  handleFurtherProcess,
  showFormFields,
  processTableData,
  handleFinalClose,
  processPostType,
  handleSearchEmployee,
  handleScrollEmployee,
  employeeInput,
  setEmployeeInput,
  getEmployeeLoading,
  getWorkProcessLoading,
}) => {
  const employeeData: EmployeeTableData[] = useSelector(
    (state: RootState) => state?.employee?.employeeData
  );

  const workProcessData: WorkProcessTableData[] = useSelector(
    (state: RootState) => state?.workProcess?.workProcessData
  );

  const handleStopPropagation = (event: React.FocusEvent<HTMLDivElement>) => {
    event.stopPropagation(); // Stops the event from propagating further
  };

  const isBusy = addOrderProcessLoading;

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      size="2xl"
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
              dialogType === "Process"
                ? "New Order Process"
                : "View Order Process"
            }
            description={
              dialogType === "Process"
                ? "Fill process details and continue the order."
                : "Review the order process details."
            }
            isEdit={dialogType !== "Process"}
            onClose={() => {
              setIsOpen(false);
              form.reset();
            }}
            isBusy={isBusy}
          />
          <FormModalBody className="gap-y-8">
              <div className="grid sm:grid-cols-2 gap-x-5 gap-y-3">
                <InputField
                  control={form.control}
                  name="orderDate"
                  label="Order Date"
                  disabled
                />

                <InputField
                  control={form.control}
                  name="orderNo"
                  label="Order No."
                  disabled
                />

                <InputField
                  control={form.control}
                  name="partyName"
                  label="Party Name"
                  disabled
                />

                <InputField
                  control={form.control}
                  name="totalOrder"
                  label="Total Order"
                  disabled
                />

                <InputField
                  control={form.control}
                  name="orderStatus"
                  label="Order Status"
                  disabled
                />
              </div>
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
                  disabled
                />

                <InputField
                  control={form.control}
                  name="orderQuantity"
                  label="Order Quantity"
                  disabled
                />

                <InputField
                  control={form.control}
                  name="designRate"
                  label="Design Rate"
                  disabled
                />

                <InputField
                  control={form.control}
                  name="wt"
                  label="WT"
                  disabled
                />

                <InputField
                  control={form.control}
                  name="wtRate"
                  label="WT Rate"
                  disabled
                />

                <InputField
                  control={form.control}
                  name="totalWt"
                  label="Total WT"
                  disabled
                />

                <InputField
                  control={form.control}
                  name="polish"
                  label="Polish"
                  disabled
                />

                <InputField
                  control={form.control}
                  name="totalPolish"
                  label="Total Polish"
                  disabled
                />

                <div className="w-full flex flex-col items-center gap-2">
                  <p className="self-start">Design Image</p>
                  <Image
                    src={form.getValues("image")}
                    alt="Design"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
              {dialogType === "Process" &&
                showFormFields &&
                processPostType === "FurtherProcess" && (
                  <div className="grid sm:grid-cols-2 gap-x-5 gap-y-3">
                    <div onFocus={handleStopPropagation}>
                      <DatePickerField
                        control={form.control}
                        name="startDate"
                        label="Work start date"
                        startYear={2000}
                        endYear={2050}
                      />
                    </div>

                    <SearchDropdownField
                      label="Employee"
                      name="employeeId"
                      control={form.control}
                      options={employeeData || []}
                      optionLabelKey="Emp_Name"
                      handleSearch={handleSearchEmployee}
                      loadMore={handleScrollEmployee}
                      input={employeeInput}
                      setInput={setEmployeeInput}
                      loading={getEmployeeLoading}
                    />

                    <DropdownField
                      label="Work Details"
                      name="workDetails"
                      control={form.control}
                      options={workProcessData || []}
                      optionLabelKey="Process_Name"
                      loading={getWorkProcessLoading}
                    />
                  </div>
                )}

              {dialogType === "Process" &&
                showFormFields &&
                processPostType === "FinalClose" && (
                  <div className="grid sm:grid-cols-2 gap-x-5 gap-y-3">
                    <div onFocus={handleStopPropagation}>
                      <DatePickerField
                        control={form.control}
                        name="closeDate"
                        label="Close date"
                        startYear={2000}
                        endYear={2050}
                      />
                    </div>
                  </div>
                )}

              {processTableData.length > 0 && (
                <div>
                  <Table
                    aria-label="Example static collection table"
                    classNames={tableClassNames}
                  >
                    <TableHeader>
                      <TableColumn>Work Details</TableColumn>
                      <TableColumn>Work Start</TableColumn>
                      <TableColumn>Work End</TableColumn>
                      <TableColumn>Work Under</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {processTableData.map((data, i) => (
                        <TableRow key={i}>
                          <TableCell>{data.Work_Details}</TableCell>
                          <TableCell>
                            {format(data.Work_Start, "dd-MM-yyyy")}
                          </TableCell>
                          <TableCell>
                            {data.Work_End
                              ? format(data.Work_End, "dd-MM-yyyy")
                              : "Processing"}
                          </TableCell>
                          <TableCell>{data.Work_Under}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {dialogType === "Process" && !showFormFields && (
                <div className="w-full flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-5 mt-5">
                  <Button
                    color="success"
                    variant="flat"
                    onPress={handleFurtherProcess}
                    size="lg"
                    radius="sm"
                    startContent={<Workflow className="h-4 w-4" />}
                    className="w-full bg-success/15 text-success-700 font-medium"
                  >
                    Further Process
                  </Button>

                  <Button
                    color="success"
                    variant="flat"
                    onPress={handleFinalClose}
                    size="lg"
                    radius="sm"
                    startContent={<CheckCircle2 className="h-4 w-4" />}
                    className="w-full bg-emerald-200/55 text-emerald-800 font-medium"
                  >
                    Final Close
                  </Button>
                </div>
              )}
          </FormModalBody>
          <FormModalFooter
            isBusy={isBusy}
            onCancel={() => {
              setIsOpen(false);
              form.reset();
            }}
            cancelLabel={dialogType === "Process" ? "Cancel" : "Close"}
            submitLabel="Add"
            showSubmit={dialogType === "Process" && showFormFields}
          />
        </form>
      </Form>
    </FormModal>
  );
};
export default OrderProcessForm;
