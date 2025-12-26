"use client";

import { useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { toast } from "sonner";

import type { Ticket, TicketStatus } from "@/lib/types";
import { useUpdateTicketStatus } from "@/data/queries/use-tickets";
import { StatusUpdateModal } from "./StatusUpdateModal";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TicketListProps = {
  tickets: Ticket[];
};

const statusLabels: Record<TicketStatus, string> = {
  pending: "Oczekujące",
  open: "Otwarte",
  "in-progress": "W trakcie",
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

const getAvailableStatuses = (currentStatus: TicketStatus): TicketStatus[] => {
  switch (currentStatus) {
    case "open":
      return ["open", "in-progress", "closed"];
    case "in-progress":
      return ["in-progress", "resolved", "closed"];
    case "resolved":
      return ["resolved", "closed"];
    case "closed":
      return ["closed"];
    default:
      return [currentStatus];
  }
};

export function TicketList({ tickets }: TicketListProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    ticketId: string | null;
    currentStatus: TicketStatus | null;
    newStatus: TicketStatus | null;
    email: string | null;
  }>({
    isOpen: false,
    ticketId: null,
    currentStatus: null,
    newStatus: null,
    email: null,
  });

  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean;
    ticket: Ticket | null;
  }>({
    isOpen: false,
    ticket: null,
  });

  const updateTicketMutation = useUpdateTicketStatus();

  const handleStatusChange = (
    ticketId: string,
    currentStatus: TicketStatus,
    newStatus: TicketStatus,
    email: string,
  ) => {
    setModalState({
      isOpen: true,
      ticketId,
      currentStatus,
      newStatus,
      email,
    });
  };

  const handleConfirmStatusChange = () => {
    if (!modalState.ticketId || !modalState.newStatus) return;

    updateTicketMutation.mutate(
      {
        ticketId: modalState.ticketId,
        status: modalState.newStatus,
        email: modalState.email || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Status zgłoszenia został zaktualizowany");
          setModalState({
            isOpen: false,
            ticketId: null,
            currentStatus: null,
            newStatus: null,
            email: null,
          });
        },
        onError: (error) => {
          console.error("Błąd podczas aktualizacji statusu:", error);
          toast.error("Wystąpił błąd podczas aktualizacji statusu");
        },
      },
    );
  };

  const handleCloseModal = () => {
    if (!updateTicketMutation.isPending) {
      setModalState({
        isOpen: false,
        ticketId: null,
        currentStatus: null,
        newStatus: null,
        email: null,
      });
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="text-muted-foreground py-10 text-center">
        Brak zgłoszeń do wyświetlenia
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tytuł</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data utworzenia</TableHead>
              <TableHead>Szczegóły</TableHead>
              <TableHead>Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => {
              const availableStatuses = getAvailableStatuses(
                ticket.ticketStatus!,
              );
              const canChangeStatus =
                ticket.ticketStatus !== "closed" &&
                availableStatuses.length > 1;

              return (
                <TableRow key={ticket.id}>
                  <TableCell className="max-w-xs font-medium">
                    <div className="truncate" title={ticket.title}>
                      {ticket.title}
                    </div>
                  </TableCell>
                  <TableCell>{ticket.email}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[ticket.ticketStatus!]}>
                      {statusLabels[ticket.ticketStatus!]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {ticket.createdAt
                      ? format(
                          new Date(ticket.createdAt),
                          "dd MMM yyyy, HH:mm",
                          {
                            locale: pl,
                          },
                        )
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDetailsModal({ isOpen: true, ticket })}
                    >
                      Szczegóły
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={ticket.ticketStatus}
                      onValueChange={(value) =>
                        handleStatusChange(
                          ticket.documentId!,
                          ticket.ticketStatus!,
                          value as TicketStatus,
                          ticket.email,
                        )
                      }
                      disabled={
                        updateTicketMutation.isPending || !canChangeStatus
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {statusLabels[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {modalState.currentStatus && modalState.newStatus && (
        <StatusUpdateModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmStatusChange}
          currentStatus={modalState.currentStatus}
          newStatus={modalState.newStatus}
          isLoading={updateTicketMutation.isPending}
        />
      )}

      <Dialog
        open={detailsModal.isOpen}
        onOpenChange={(isOpen) =>
          setDetailsModal({
            isOpen,
            ticket: isOpen ? detailsModal.ticket : null,
          })
        }
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{detailsModal.ticket?.title}</DialogTitle>
            <DialogDescription>
              {detailsModal.ticket?.email} •{" "}
              {detailsModal.ticket?.createdAt &&
                format(
                  new Date(detailsModal.ticket.createdAt),
                  "dd MMM yyyy, HH:mm",
                  { locale: pl },
                )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold">Opis zgłoszenia:</h4>
              <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                {detailsModal.ticket?.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Status:</span>
              <Badge
                className={
                  statusColors[detailsModal.ticket?.ticketStatus || "open"]
                }
              >
                {statusLabels[detailsModal.ticket?.ticketStatus || "open"]}
              </Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
