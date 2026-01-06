"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVerifyTicket } from "@/data/queries/use-tickets";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export function VerifyTicketContent() {
  const t = useTranslations("VerifyTicket");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { data, isPending, isError } = useVerifyTicket(token);

  const getState = () => {
    if (!token) return "error";
    if (isPending) return "verifying";
    if (isError) return "error";
    if (data?.success) return "success";
    return "error";
  };

  const getMessage = () => {
    if (!token) return t("missingToken");
    if (isPending) return "";
    if (data?.success)
      return t("successMessage");
    if (isError) {
      return t("errorMessage");
    }
    return data?.error || t("errorMessage");
  };

  const state = getState();
  const message = getMessage();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              {state === "verifying" && t("verifying")}
              {state === "success" && t("success")}
              {state === "error" && t("error")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && <p className="text-muted-foreground">{message}</p>}

            {state === "success" && (
              <Button asChild className="w-full">
                <Link href="/">{t("backHome")}</Link>
              </Button>
            )}

            {state === "error" && (
              <Button asChild className="w-full">
                <Link href="/helpdesk">{t("createTicket")}</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
