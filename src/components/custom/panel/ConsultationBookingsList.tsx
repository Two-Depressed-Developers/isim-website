"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Mail,
  BookOpen,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useConsultationBookings,
  useMemberData,
  useUpdateConsultationBookingStatus,
} from "@/data/queries";
import type { ConsultationBooking } from "@/lib/types";

type Props = {
  memberSlug: string;
};

const statusLabels: Record<
  ConsultationBooking["reservationStatus"],
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  pending: { label: "Oczekuje", variant: "secondary" },
  accepted: { label: "Zaakceptowana", variant: "default" },
  declined: { label: "Odrzucona", variant: "destructive" },
};

export default function ConsultationBookingsList({ memberSlug }: Props) {
  const { data: session } = useSession();
  const {
    data: memberData,
    isPending: isMemberPending,
    isError: isMemberError,
  } = useMemberData(memberSlug);

  if (isMemberPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isMemberError || !memberData?.documentId) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">
          Wystąpił błąd podczas ładowania próśb o konsultacje.
        </p>
      </div>
    );
  }

  return (
    <ConsultationBookingsContent
      memberDocumentId={memberData.documentId}
      memberFullName={memberData.fullName}
      memberRoom={memberData.room}
      session={session}
    />
  );
}

type ContentProps = {
  memberDocumentId: string;
  memberFullName: string;
  memberRoom?: string;
  session: any;
};

function ConsultationBookingsContent({
  memberDocumentId,
  memberFullName,
  memberRoom,
  session,
}: ContentProps) {
  const {
    data: bookings = [],
    isPending: isBookingsPending,
    isError: isBookingsError,
  } = useConsultationBookings(memberDocumentId);

  const updateStatus = useUpdateConsultationBookingStatus(memberDocumentId);

  const [processingId, setProcessingId] = useState<string | null>(null);

  const pendingBookings = useMemo(
    () => bookings.filter((booking) => booking.reservationStatus === "pending"),
    [bookings],
  );

  if (isBookingsPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isBookingsError) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">
          Wystąpił błąd podczas ładowania próśb o konsultacje.
        </p>
      </div>
    );
  }

  const handleStatusUpdate = async (
    booking: ConsultationBooking,
    status: "accepted" | "declined",
  ) => {
    if (!session?.accessToken) {
      toast.error("Błąd autoryzacji");
      return;
    }

    setProcessingId(booking.documentId);

    try {
      await updateStatus.mutateAsync({
        documentId: booking.documentId,
        status,
        accessToken: session.accessToken,
        emailData: {
          email: booking.studentEmail,
          studentName: booking.studentName,
          memberName: memberFullName,
          startTime: booking.startTime,
          endTime: booking.endTime,
          room: memberRoom,
        },
      });

      toast.success(
        status === "accepted"
          ? "Konsultacja zaakceptowana i email wysłany"
          : "Konsultacja odrzucona i email wysłany",
      );
    } catch (error) {
      toast.error("Wystąpił błąd podczas aktualizacji statusu");
    } finally {
      setProcessingId(null);
    }
  };

  if (pendingBookings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-2 py-12">
          <Calendar className="text-muted-foreground h-12 w-12" />
          <p className="text-muted-foreground">
            Brak oczekujących próśb o konsultacje
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {pendingBookings.map((booking) => (
        <Card key={booking.documentId}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base">
                  {booking.studentName}
                </CardTitle>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3" />
                  {booking.studentEmail}
                </div>
              </div>
              <Badge variant={statusLabels[booking.reservationStatus].variant}>
                {statusLabels[booking.reservationStatus].label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="text-muted-foreground h-4 w-4" />
              <span>{booking.fieldAndSubject}</span>
            </div>
            <Separator />
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="text-primary h-4 w-4" />
                <span className="font-medium">
                  {format(parseISO(booking.startTime), "EEEE, d MMMM yyyy", {
                    locale: pl,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-primary h-4 w-4" />
                <span className="font-medium">
                  {format(parseISO(booking.startTime), "HH:mm")} -{" "}
                  {format(parseISO(booking.endTime), "HH:mm")}
                </span>
              </div>
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleStatusUpdate(booking, "accepted")}
                disabled={processingId === booking.documentId}
                className="flex-1"
              >
                {processingId === booking.documentId ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Akceptuj
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleStatusUpdate(booking, "declined")}
                disabled={processingId === booking.documentId}
                className="flex-1"
              >
                {processingId === booking.documentId ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                Odrzuć
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
