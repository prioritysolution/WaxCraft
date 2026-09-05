"use client";

import getCookieData from "@/utils/getCookieData";
import { useRouter } from "next/navigation";
import { FC, ReactNode, useEffect } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  const router = useRouter();
  const token = getCookieData<string | null>("waxCraftClientToken");

  useEffect(() => {
    if (token) router.push("/dashboard");
  }, [token, router]);
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-secondary text-foreground">
      {children}
    </main>
  );
};

export default AuthLayout;
