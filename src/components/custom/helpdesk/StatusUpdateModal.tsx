"use client";

import type { TicketStatus } from "@/types/strapi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type StatusUpdateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentStatus: TicketStatus;
  newStatus: TicketStatus;
  isLoading?: boolean;
};

const statusLabels: Record<TicketStatus, string> = {
  pending: "Oczekujące",
  open: "Otwarte",
  "in-progress": "W trakcie",
  resolved: "Rozwiązane",
  closed: "Odrzucone",
};

export function StatusUpdateModal({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  newStatus,
  isLoading = false,
}: StatusUpdateModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Potwierdź zmianę statusu</AlertDialogTitle>
          <AlertDialogDescription>
            Czy na pewno chcesz zmienić status zgłoszenia z{" "}
            <strong>{statusLabels[currentStatus]}</strong> na{" "}
            <strong>{statusLabels[newStatus]}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Zapisywanie..." : "Potwierdź"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
