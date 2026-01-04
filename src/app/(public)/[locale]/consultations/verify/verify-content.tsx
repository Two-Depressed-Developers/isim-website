"use client";

import { useSearchParams } from "next/navigation";
import { useVerifyConsultationBooking } from "@/data/queries/use-consultations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations, useFormatter } from "next-intl";

export function VerifyConsultationContent() {
  const t = useTranslations("VerifyConsultation");
  const format = useFormatter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { data, isPending, isError } = useVerifyConsultationBooking(token);

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
            <CardTitle className="flex items-center gap-2">
              {state === "verifying" && (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t("verifying")}
                </>
              )}
              {state === "success" && (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  {t("success")}
                </>
              )}
              {state === "error" && (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  {t("error")}
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <p
                className={
                  state === "success" ? "text-sm" : "text-muted-foreground"
                }
              >
                {message}
              </p>
            )}

            {state === "success" && data?.booking && (
              <div className="bg-muted space-y-2 rounded-lg p-4 text-sm">
                <p>
                  <strong>{t("student")}:</strong> {data.booking.studentName}
                </p>
                <p>
                  <strong>{t("host")}:</strong> {data.booking.memberName}
                </p>
                <p>
                  <strong>{t("date")}:</strong>{" "}
                  {format.dateTime(new Date(data.booking.startTime), {
                     year: 'numeric',
                     month: 'numeric',
                     day: 'numeric',
                     hour: '2-digit',
                     minute: '2-digit'
                  })}{" "}
                  -{" "}
                  {format.dateTime(new Date(data.booking.endTime), {
                     hour: '2-digit',
                     minute: '2-digit'
                  })}
                </p>
              </div>
            )}

            {state === "success" && (
              <Button asChild className="w-full">
                <Link href="/">{t("backHome")}</Link>
              </Button>
            )}

            {state === "error" && (
              <Button asChild className="w-full">
                <Link href="/about-us/staff">{t("viewConsultations")}</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
