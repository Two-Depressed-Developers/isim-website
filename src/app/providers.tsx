"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import QueryProvider from "@/providers/QueryProvider";

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <QueryProvider>
      <SessionProvider>
        {children}
        <Toaster richColors position="bottom-right" />
      </SessionProvider>
    </QueryProvider>
  );
}
