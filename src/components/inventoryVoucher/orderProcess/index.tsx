"use client";

import { FC } from "react";
import OrderProcessTable from "./OrderProcessTable";
import { OrderProcessProps } from "@/types/inventoryVoucher/OrderProcessTypes";
import OrderProcessForm from "./OrderProcessForm";
import { PageHeader, PageShell } from "@/components/ui/page-shell";
import { Cog } from "lucide-react";

const OrderProcess: FC<OrderProcessProps> = ({
  addOrderProcessLoading,
  loading,
  form,
  handleSubmit,
  isOpenProcess,
  setIsOpenProcess,
  handleOpenProcessDialog,
  dialogType,
  handleFurtherProcess,
  showFormFields,
  processTableData,
  processDesignRows,
  selectedProcessOrder,
  handleFinalClose,
  processPostType,
  handleSearchEmployee,
  handleScrollEmployee,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  employeeInput,
  setEmployeeInput,
  getEmployeeLoading,
  getWorkProcessLoading,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={Cog}
        title="Order Process"
        description="Move booked orders through production and close completed work."
      />
      <OrderProcessForm
        addOrderProcessLoading={addOrderProcessLoading}
        form={form}
        handleSubmit={handleSubmit}
        isOpen={isOpenProcess}
        setIsOpen={setIsOpenProcess}
        dialogType={dialogType}
        handleFurtherProcess={handleFurtherProcess}
        showFormFields={showFormFields}
        processTableData={processTableData}
        processDesignRows={processDesignRows}
        selectedProcessOrder={selectedProcessOrder}
        handleFinalClose={handleFinalClose}
        processPostType={processPostType}
        handleSearchEmployee={handleSearchEmployee}
        handleScrollEmployee={handleScrollEmployee}
        employeeInput={employeeInput}
        setEmployeeInput={setEmployeeInput}
        getEmployeeLoading={getEmployeeLoading}
        getWorkProcessLoading={getWorkProcessLoading}
      />

      <OrderProcessTable
          loading={loading}
          handleOpenProcessDialog={handleOpenProcessDialog}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          lastPage={lastPage}
              perPage={perPage}
              onPerPageChange={onPerPageChange}
        />
    </PageShell>
  );
};
export default OrderProcess;
