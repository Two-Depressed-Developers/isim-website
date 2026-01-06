"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useStrapiClient } from "@/lib/strapi-client";
import { usePathname } from "next/navigation";

export default function ConnectSSOForm() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const api = useStrapiClient();

  const isConnected = session?.user?.hasSsoLinked;

  const handleToggleConnection = async () => {
    try {
      setIsLoading(true);
      if (isConnected) {
        const res = await api.post("/api/auth-custom/unlink-account");

        if (res.status !== 200) {
          throw new Error("Nie udało się rozłączyć");
        }

        await update({
          ...session,
          user: {
            ...session?.user,
            hasSsoLinked: false,
          },
        });

        toast.success("Rozłączono konto GitHub");
      } else {
        await signIn("github", {
          redirectTo: pathname,
        });
      }
    } catch (error) {
      console.error("SSO connection error:", error);
      toast.error("Wystąpił błąd podczas zmiany ustawień SSO");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
}
