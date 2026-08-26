"use client";
import getCookieData from "@/utils/getCookieData";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const token = getCookieData<string | null>("waxCraftClientToken");

  useEffect(() => {
    if (token) router.push("/dashboard");
    else router.push("/login");
  }, [token, router]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-secondary">
      <Spinner size="lg" color="primary" />
    </main>
  );
}
