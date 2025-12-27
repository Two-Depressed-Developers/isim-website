"use client";

import { useTickets } from "@/data/queries/use-tickets";
import { TicketList } from "@/components/custom/helpdesk/TicketList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Session } from "next-auth";

type Props = {
  session: Session;
};

export default function ManageTickets({ session }: Props) {
  const {
    data: tickets,
    isPending,
    isError,
  } = useTickets(session.accessToken ?? "");

  if (isPending) {
    return (
      <div className="container mx-auto space-y-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Zarządzanie zgłoszeniami</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Zarządzanie zgłoszeniami</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-destructive py-10 text-center">
              Wystąpił błąd podczas ładowania zgłoszeń. Spróbuj odświeżyć
              stronę.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Zarządzanie zgłoszeniami</CardTitle>
        </CardHeader>
        <CardContent>
          <TicketList tickets={tickets} />
        </CardContent>
      </Card>
    </div>
  );
}
