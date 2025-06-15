"use client";

import { LoginForm } from "@/components/custom/auth/LoginForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const session = useSession();
  const router = useRouter();

  console.log("Session data:", session);

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/panel/profile");
    }
  }, [session.status, router]);

  return (
    <div className="flex grow flex-col items-center justify-center gap-y-4 bg-muted">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-semibold">
          Jeśli pierwszy raz odwiedzasz tę stronę, skontaktuj się z
          administratorem, aby utworzyć konto.
        </h2>
      </div>
      <div className="flex w-full max-w-sm flex-col">
        <LoginForm />
      </div>
    </div>
  );
}
