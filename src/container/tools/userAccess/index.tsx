"use client";

import UserAccess from "@/components/tools/userAccess";
import { useUserAccess } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";

const UserAccessContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getUserAccessLoading,
    getUserAccessApiCall,
    form,
    handleToggleAccess,
  } = useUserAccess();

  useEffect(() => {
    if (orgId && token) getUserAccessApiCall(orgId);
  }, [token, orgId]);

  return (
    <UserAccess
      getUserAccessLoading={getUserAccessLoading}
      form={form}
      handleToggleAccess={handleToggleAccess}
    />
  );
};
export default UserAccessContainer;
