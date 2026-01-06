"use client";

import { TicketList } from "@/components/custom/helpdesk/TicketList";
import { QueryWrapper } from "@/components/QueryWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTickets } from "@/data/queries/use-tickets";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";

type Props = {
  session: Session;
};

function ManageTicketsContent({ session }: Props) {
  const { data: tickets } = useTickets(session.accessToken ?? "");

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Zarządzanie zgłoszeniami</CardTitle>
        </CardHeader>
        <CardContent>
          <TicketList tickets={tickets} session={session} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function ManageTickets({ session }: Props) {
  return (
    <QueryWrapper
      loadingFallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ManageTicketsContent session={session} />
    </QueryWrapper>
  );
}
