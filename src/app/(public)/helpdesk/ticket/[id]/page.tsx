"use client";

import { useParams, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

import { useTicketDetails } from "@/data/queries/use-tickets";
import type { TicketStatus } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const statusLabels: Record<TicketStatus, string> = {
  pending: "Oczekujące na weryfikację",
  open: "Otwarte",
  "in-progress": "W trakcie realizacji",
  resolved: "Rozwiązane",
  closed: "Odrzucone",
};

const statusColors: Record<TicketStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30",
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30",
  "in-progress":
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30",
  resolved:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30",
  closed:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30",
};

export default function TicketStatusPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const ticketId = params.id;
  const token = searchParams.get("token");

  const {
    data: ticket,
    isPending,
    isError,
  } = useTicketDetails(ticketId, token);

  if (isPending) {
    return (
      <div className="container mx-auto max-w-3xl py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="container mx-auto max-w-3xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Błąd</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              Nie znaleziono zgłoszenia. Sprawdź, czy link jest poprawny.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-2xl">{ticket.title}</CardTitle>
            <Badge
              className={statusColors[ticket.ticketStatus as TicketStatus]}
            >
              {statusLabels[ticket.ticketStatus as TicketStatus]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div>
              <h3 className="text-muted-foreground mb-1 text-sm font-semibold">
                Email
              </h3>
              <p>{ticket.email}</p>
            </div>

            <div>
              <h3 className="text-muted-foreground mb-1 text-sm font-semibold">
                Opis problemu
              </h3>
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-muted-foreground mb-1 text-sm font-semibold">
                  Data utworzenia
                </h3>
                <p>
                  {ticket.createdAt
                    ? format(
                        new Date(ticket.createdAt),
                        "dd MMMM yyyy, HH:mm",
                        { locale: pl },
                      )
                    : "-"}
                </p>
              </div>

              {ticket.verifiedAtTime && (
                <div>
                  <h3 className="text-muted-foreground mb-1 text-sm font-semibold">
                    Data weryfikacji
                  </h3>
                  <p>
                    {format(
                      new Date(ticket.verifiedAtTime),
                      "dd MMMM yyyy, HH:mm",
                      { locale: pl },
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {ticket.ticketStatus === "pending" && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-900/20">
              <p className="text-sm">
                Twoje zgłoszenie oczekuje na weryfikację. Sprawdź swoją skrzynkę
                email i kliknij w link weryfikacyjny.
              </p>
            </div>
          )}

          {ticket.ticketStatus === "open" && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
              <p className="text-sm">
                Twoje zgłoszenie zostało zweryfikowane i oczekuje na realizację.
              </p>
            </div>
          )}

          {ticket.ticketStatus === "in-progress" && (
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-900 dark:bg-purple-900/20">
              <p className="text-sm">
                Twoje zgłoszenie jest obecnie w trakcie realizacji.
              </p>
            </div>
          )}

          {ticket.ticketStatus === "resolved" && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
              <p className="text-sm">
                Twoje zgłoszenie zostało pomyślnie rozwiązane! Problem został
                usunięty. Dziękujemy za kontakt!
              </p>
            </div>
          )}

          {ticket.ticketStatus === "closed" && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
              <p className="text-sm">Zgłoszenie zostało odrzucone.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
