"use client";

import { FC, useEffect } from "react";
import getCookieData from "@/utils/getCookieData";
import { useRoleAssign } from "./Hooks";
import RoleAssign from "@/components/tools/roleAssign";
import { useAddUser } from "../addUser/Hooks";

const RoleAssignContainer: FC = () => {
  const token = getCookieData("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    form,
    loading,
    handleSubmit,
    roleAssignList,
    roleAssignSingleList,
    openModuleId,
    setOpenModuleId,
    selected,
    setSelected,
    getModuleDataApiCall,
  } = useRoleAssign();

  const { getUserListApiCall, loading: getUserLoading } = useAddUser();

  useEffect(() => {
    if (token && orgId) {
      getUserListApiCall(orgId);
      getModuleDataApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <RoleAssign
      form={form}
      loading={loading}
      roleAssignList={roleAssignList}
      roleAssignSingleList={roleAssignSingleList}
      handleSubmit={handleSubmit}
      openModuleId={openModuleId}
      setOpenModuleId={setOpenModuleId}
      selected={selected}
      setSelected={setSelected}
      getUserLoading={getUserLoading}
    />
  );
};
export default RoleAssignContainer;
