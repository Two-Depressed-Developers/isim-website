"use client";

import { LoginForm } from "@/components/custom/auth/LoginForm";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function LoginPageContent() {
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/panel/profile");
    }
  }, [session.status, router]);

  return (
    <div className="bg-muted flex grow flex-col items-center justify-center gap-y-4">
      <div className="max-w-xl text-center">
        <h2 className="mb-4 text-2xl font-semibold">
          Jeśli pierwszy raz odwiedzasz tę stronę, skontaktuj się z
          administratorem, aby utworzyć konto.
        </h2>
      </div>
      {state && (
        <div className="rounded-md border-2 border-green-600/10 bg-green-100/25 p-3 text-center text-sm text-green-700">
          {state === "setup" &&
            "Konto zostało aktywowane. Możesz się teraz zalogować."}
          {state === "reset" &&
            "Hasło zostało zmienione. Możesz się teraz zalogować."}
        </div>
      )}
      <div className="flex w-full max-w-sm flex-col">
        <LoginForm errorCode={error} />
      </div>
    </div>
  );
}
