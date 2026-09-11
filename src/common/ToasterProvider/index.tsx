"use client";

import { ReactNode, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { installEmptyDataToastFilter } from "@/lib/emptyDataMessage";

interface ToasterProviderProps {
  children: ReactNode;
}

const ToasterProvider: React.FC<ToasterProviderProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    installEmptyDataToastFilter();
    setMounted(true);
  }, []);

  return (
    <>
      {mounted ? <Toaster position="bottom-right" reverseOrder={false} /> : null}
      {children}
    </>
  );
};

export default ToasterProvider;
