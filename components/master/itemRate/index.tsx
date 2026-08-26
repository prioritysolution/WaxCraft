"use client";

import { ItemRateProps } from "@/types/master/ItemRateTypes";
import { FC } from "react";
import ItemRateForm from "./ItemRateForm";
import { FormCard, PageShell } from "@/components/ui/page-shell";
import { IndianRupee } from "lucide-react";

const ItemRate: FC<ItemRateProps> = ({
  addItemRateLoading,
  form,
  handleSubmit,
  handleSearchItem,
  handleScrollItem,
  itemInput,
  setItemInput,
  getItemLoading,
}) => {
  return (
    <PageShell>
      <FormCard
        icon={IndianRupee}
        title="Item Rate"
        description="Update current rates for existing items."
      >
        <ItemRateForm
          addItemRateLoading={addItemRateLoading}
          form={form}
          handleSubmit={handleSubmit}
          handleSearchItem={handleSearchItem}
          handleScrollItem={handleScrollItem}
          itemInput={itemInput}
          setItemInput={setItemInput}
          getItemLoading={getItemLoading}
        />
      </FormCard>
    </PageShell>
  );
};
export default ItemRate;
