"use client";

import TrailorTransaction from "@/components/accountVoucher/trailorTransaction";
import { useTrailorTransaction } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";

const TrailorTransactionContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const { loading, form, handleSubmit, getTrailorUserApiCall, getUserLoading } =
    useTrailorTransaction();

  useEffect(() => {
    if (token && orgId) {
      getTrailorUserApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <TrailorTransaction
      getUserLoading={getUserLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
    />
  );
};
export default TrailorTransactionContainer;
