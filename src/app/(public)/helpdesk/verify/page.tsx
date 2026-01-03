"use client";

import { useSearchParams } from "next/navigation";
import { useVerifyTicket } from "@/data/queries/use-tickets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyTicketPage() {
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
    if (!token) return "Brak tokenu weryfikacyjnego.";
    if (isPending) return "";
    if (data?.success)
      return "Zgłoszenie zostało potwierdzone i utworzone pomyślnie!";
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
            <CardTitle>
              {state === "verifying" && "Weryfikacja zgłoszenia..."}
              {state === "success" && "Sukces!"}
              {state === "error" && "Błąd weryfikacji"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && <p className="text-muted-foreground">{message}</p>}

            {state === "success" && (
              <Button asChild className="w-full">
                <Link href="/">Wróć na stronę główną</Link>
              </Button>
            )}

            {state === "error" && (
              <Button asChild className="w-full">
                <Link href="/helpdesk">Utwórz nowe zgłoszenie</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
