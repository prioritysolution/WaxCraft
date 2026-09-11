"use client";

import { TrailorTransactionProps } from "@/types/accountVoucher/TrailorTransactionTypes";
import { FC } from "react";
import TrailorTransactionForm from "./TrailorTransactionForm";
import { FormCard, PageShell } from "@/components/ui/page-shell";
import { Truck } from "lucide-react";

const TrailorTransaction: FC<TrailorTransactionProps> = ({
  getUserLoading,
  loading,
  form,
  handleSubmit,
}) => {
  return (
    <PageShell>
      <FormCard
        icon={Truck}
        title="Trailor Transaction"
        description="Record trailor cash transactions for the selected user."
      >
        <TrailorTransactionForm
          getUserLoading={getUserLoading}
          loading={loading}
          form={form}
          handleSubmit={handleSubmit}
        />
      </FormCard>
    </PageShell>
  );
};
export default TrailorTransaction;
