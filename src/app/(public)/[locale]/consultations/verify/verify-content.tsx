"use client";

import { useSearchParams } from "next/navigation";
import { useVerifyConsultationBooking } from "@/data/queries/use-consultations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function VerifyConsultationContent() {
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
    if (!token) return "Brak tokenu weryfikacyjnego.";
    if (isPending) return "";
    if (data?.success)
      return "Rezerwacja konsultacji została potwierdzona pomyślnie! Powiadomiliśmy prowadzącego - otrzymasz wiadomość email z potwierdzeniem lub odmową konsultacji.";
    if (isError) {
      return "Wystąpił błąd podczas weryfikacji.";
    }
    return data?.error || "Wystąpił błąd podczas weryfikacji.";
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
                  Weryfikacja rezerwacji...
                </>
              )}
              {state === "success" && (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Sukces!
                </>
              )}
              {state === "error" && (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  Błąd weryfikacji
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
                  <strong>Student:</strong> {data.booking.studentName}
                </p>
                <p>
                  <strong>Prowadzący:</strong> {data.booking.memberName}
                </p>
                <p>
                  <strong>Termin:</strong>{" "}
                  {new Date(data.booking.startTime).toLocaleDateString("pl-PL")}
                  ,{" "}
                  {new Date(data.booking.startTime).toLocaleTimeString(
                    "pl-PL",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}{" "}
                  -{" "}
                  {new Date(data.booking.endTime).toLocaleTimeString("pl-PL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}

            {state === "success" && (
              <Button asChild className="w-full">
                <Link href="/">Wróć na stronę główną</Link>
              </Button>
            )}

            {state === "error" && (
              <Button asChild className="w-full">
                <Link href="/about-us/staff">Zobacz dostępne konsultacje</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
