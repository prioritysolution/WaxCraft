"use client";

import Profile from "@/components/profile";
import { useProfile } from "./Hooks";

const ProfileContainer = () => {
  const {
    loading,
    updateProfileLoading,
    form,
    handleSubmit,
    userName,
    userMobile,
  } = useProfile();

  return (
    <Profile
      updateProfileLoading={updateProfileLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      userName={userName}
      userMobile={userMobile}
    />
  );
};
export default ProfileContainer;
