"use client";

import { ProfileProps } from "@/types/ProfileTypes";
import { FC } from "react";
import ProfileForm from "./ProfileForm";
import { PageHeader, PageShell } from "@/components/ui/page-shell";
import { UserRound } from "lucide-react";
import { Spinner } from "@heroui/react";

const Profile: FC<ProfileProps> = ({
  loading,
  updateProfileLoading,
  form,
  handleSubmit,
  userName,
  userMobile,
}) => {
  const name = form.watch("name") || userName;
  const email = form.watch("email");
  const role = form.watch("role");
  const initials = (name || "WC")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <PageShell>
      <PageHeader
        icon={UserRound}
        title="Profile"
        description="Update your account details and password."
      />
      <section className="overflow-hidden rounded-2xl border border-black/[0.06] bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        {loading ? (
          <div className="flex items-center justify-center px-5 py-16">
            <Spinner size="lg" color="primary" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-4 sm:px-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {initials || "WC"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-foreground">
                  {name || "WaxCraft User"}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {email || "Your account details"}
                </p>
              </div>
              {role ? (
                <span className="ml-auto inline-flex shrink-0 items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                  {role}
                </span>
              ) : null}
            </div>
            <div className="p-4 sm:p-5">
              <ProfileForm
                updateProfileLoading={updateProfileLoading}
                form={form}
                handleSubmit={handleSubmit}
                userName={userName}
                userMobile={userMobile}
              />
            </div>
          </>
        )}
      </section>
    </PageShell>
  );
};
export default Profile;
