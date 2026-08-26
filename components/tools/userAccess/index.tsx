"use client";

import { UserAccessProps } from "@/types/tools/UserAccessTypes";
import {
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { ShieldCheck } from "lucide-react";
import { FC } from "react";
import UserAccessTable from "./UserAccessTable";

const UserAccess: FC<UserAccessProps> = ({
  getUserAccessLoading,
  form,
  handleToggleAccess,
}) => {
  return (
        <PageShell>
      <PageHeader
        icon={ShieldCheck}
        title="User Access"
        description="Enable or disable access for existing users."
      />

      <UserAccessTable
          loading={getUserAccessLoading}
          form={form}
          handleToggleAccess={handleToggleAccess}
        />
    </PageShell>
  );
};
export default UserAccess;
