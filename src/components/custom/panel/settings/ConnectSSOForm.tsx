"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";

export default function ConnectSSOForm() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const isConnected = session?.user?.hasSsoLinked;

  const handleToggleConnection = async () => {
    try {
      if (isConnected) {
        const res = await fetch("/api/panel/settings/unlink", {
          method: "POST",
        });

        if (!res.ok) throw new Error("Błąd rozłączania");

        await update({
          ...session,
          user: {
            ...session?.user,
            hasSsoLinked: false,
          },
        });

        toast.success("Rozłączono konto GitHub");
      } else {
        const params = new URLSearchParams({
          client_id: "Ov23liKhbn3e0rvtBY5d",
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/connect/github`,
          scope: "read:user user:email",
          state: "idkidk",
        });

        console.log("Redirecting to SSO with params:", params.toString());

        window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
      }
    } catch (error) {
      console.error("SSO connection error:", error);
      toast.error("Wystąpił błąd podczas zmiany ustawień SSO");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-w-lg grow">
      <Card className="w-full">
        <CardHeader className="text-center text-xl font-bold">
          Połączenia SSO
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <Github className="h-6 w-6" />
              <div>
                <p className="font-semibold">GitHub</p>
                <p className="text-sm text-gray-500">
                  {isConnected ? "Połączone" : "Niepołączone"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleToggleConnection}
              disabled={isLoading}
              variant={isConnected ? "destructive" : "default"}
            >
              {isLoading
                ? "Przetwarzanie..."
                : isConnected
                  ? "Rozłącz"
                  : "Połącz"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
