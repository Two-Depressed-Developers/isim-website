"use client";

import { QueryWrapper } from "@/components/QueryWrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTicketDetails } from "@/data/queries/use-tickets";
import type { TicketStatus } from "@/types";
import { useFormatter, useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";

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

function TicketDetails() {
  const t = useTranslations("TicketStatus");
  const format = useFormatter();
  const params = useParams();
  const searchParams = useSearchParams();
  const ticketId = params.id as string;
  const token = searchParams.get("token");

  const { data: ticket } = useTicketDetails(ticketId, token);

  const statusLabels: Record<TicketStatus, string> = {
    pending: t("status.pending"),
    open: t("status.open"),
    "in-progress": t("status.in-progress"),
    resolved: t("status.resolved"),
    closed: t("status.closed"),
  };

  if (!ticket) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("error")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{t("notFound")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-2xl">{ticket.title}</CardTitle>
          <Badge className={statusColors[ticket.ticketStatus as TicketStatus]}>
            {statusLabels[ticket.ticketStatus as TicketStatus]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <h3 className="text-muted-foreground mb-1 text-sm font-semibold">
              {t("email")}
            </h3>
            <p>{ticket.email}</p>
          </div>

          <div>
            <h3 className="text-muted-foreground mb-1 text-sm font-semibold">
              {t("description")}
            </h3>
            <p className="whitespace-pre-wrap">{ticket.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-muted-foreground mb-1 text-sm font-semibold">
                {t("createdAt")}
              </h3>
              <p>
                {ticket.createdAt
                  ? format.dateTime(new Date(ticket.createdAt), {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </p>
            </div>

            {ticket.verifiedAtTime && (
              <div>
                <h3 className="text-muted-foreground mb-1 text-sm font-semibold">
                  {t("verifiedAt")}
                </h3>
                <p>
                  {format.dateTime(new Date(ticket.verifiedAtTime), {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {ticket.ticketStatus === "pending" && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-900/20">
            <p className="text-sm">{t("pending")}</p>
          </div>
        )}

        {ticket.ticketStatus === "open" && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
            <p className="text-sm">{t("open")}</p>
          </div>
        )}

        {ticket.ticketStatus === "in-progress" && (
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-900 dark:bg-purple-900/20">
            <p className="text-sm">{t("inProgress")}</p>
          </div>
        )}

        {ticket.ticketStatus === "resolved" && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
            <p className="text-sm">{t("resolved")}</p>
          </div>
        )}

        {ticket.ticketStatus === "closed" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
            <p className="text-sm">{t("rejected")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function TicketStatusPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <QueryWrapper
        loadingFallback={
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
        }
      >
        <TicketDetails />
      </QueryWrapper>
    </div>
  );
}
