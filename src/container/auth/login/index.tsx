"use client";

import Login from "@/components/auth/login";
import { useLogin } from "./Hooks";

const LoginContainer = () => {
  const { loading, afterLoginLoading, form, handleSubmit } = useLogin();

  return (
    <Login
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      afterLoginLoading={afterLoginLoading}
    />
  );
};
export default LoginContainer;
