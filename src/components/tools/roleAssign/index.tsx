"use client";

import { RoleAssignProps } from "@/types/tools/RoleAssignTypes";
import { FormCard, PageShell } from "@/components/ui/page-shell";
import { KeyRound } from "lucide-react";
import { FC } from "react";
import RoleAssignForm from "./RoleAssignForm";

const RoleAssign: FC<RoleAssignProps> = ({
  loading,
  form,
  handleSubmit,
  roleAssignList,
  roleAssignSingleList,
  openModuleId,
  setOpenModuleId,
  selected,
  setSelected,
  getUserLoading,
}) => {
  return (
    <PageShell>
      <FormCard
        icon={KeyRound}
        title="Assign User Role"
        description="Map modules and permissions to a selected user role."
      >
        <RoleAssignForm
          loading={loading}
          form={form}
          handleSubmit={handleSubmit}
          roleAssignList={roleAssignList}
          roleAssignSingleList={roleAssignSingleList}
          openModuleId={openModuleId}
          setOpenModuleId={setOpenModuleId}
          selected={selected}
          setSelected={setSelected}
          getUserLoading={getUserLoading}
        />
      </FormCard>
    </PageShell>
  );
};

export default RoleAssign;
