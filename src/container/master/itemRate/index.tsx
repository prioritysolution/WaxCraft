"use client";

import ItemRate from "@/components/master/itemRate";
import { useItemRate } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useBankAccount } from "@/container/master/bankAccount/Hooks";
import { useItem } from "../item/Hooks";

const ItemRateContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getItemRateApiCall,
    addItemRateLoading,
    loading,
    form,
    handleSubmit,
    itemId,
    itemInput,
    setItemInput,
  } = useItemRate();

  const {
    getItemApiCall,
    currentPage: currentItemPage,
    setCurrentPage: setCurrentItemPage,
    lastPage: lastItemPage,
    loading: getItemLoading,
  } = useItem();

  const handleSearchItem = () => {
    setCurrentItemPage(1);
    if (orgId) getItemApiCall(orgId, 1, itemInput, "DROPDOWN");
  };

  const handleScrollItem = () => {
    setCurrentItemPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (orgId && currentItemPage > 1 && currentItemPage <= lastItemPage)
      getItemApiCall(orgId, currentItemPage, itemInput, "DROPDOWN");
  }, [currentItemPage, orgId]);

  useEffect(() => {
    if (token && orgId && !!itemId) {
      getItemRateApiCall(orgId, itemId);
    }
  }, [token, orgId, itemId]);

  return (
    <ItemRate
      addItemRateLoading={addItemRateLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      handleSearchItem={handleSearchItem}
      handleScrollItem={handleScrollItem}
      itemInput={itemInput}
      setItemInput={setItemInput}
      getItemLoading={getItemLoading}
    />
  );
};
export default ItemRateContainer;
