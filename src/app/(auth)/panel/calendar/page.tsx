"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useMemo } from "react";
import { Calendar } from "@/components/calendar/calendar";
import { mapConsultationBookingToCalendarEvent } from "@/components/calendar/mappers";
import { useConsultationBookings, useMemberData } from "@/data/queries";
import { Loader2 } from "lucide-react";

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const memberSlug = session?.user?.memberProfileSlug;

  const {
    data: memberData,
    isPending: isMemberPending,
    isError: isMemberError,
  } = useMemberData(memberSlug || "", { enabled: !!memberSlug });

  const {
    data: bookings = [],
    isPending: isBookingsPending,
    isError: isBookingsError,
  } = useConsultationBookings(memberData?.documentId || "", {
    enabled: !!memberData?.documentId,
  });

  const acceptedBookings = useMemo(
    () =>
      bookings.filter((booking) => booking.reservationStatus === "accepted"),
    [bookings],
  );

  if (status === "loading" || isMemberPending || isBookingsPending) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Kalendarz konsultacji</h1>
          <p className="text-muted-foreground">Zaakceptowane konsultacje</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session?.user) {
    redirect("/login");
  }

  if (!memberSlug) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Kalendarz konsultacji</h1>
          <p className="text-muted-foreground">Zaakceptowane konsultacje</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border py-12">
          <p className="text-muted-foreground">
            Aby wyświetlić kalendarz konsultacji, najpierw musisz powiązać
            profil pracownika.
          </p>
        </div>
      </div>
    );
  }

  if (isMemberError || isBookingsError || !memberData?.documentId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Kalendarz konsultacji</h1>
          <p className="text-muted-foreground">Zaakceptowane konsultacje</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">
            Wystąpił błąd podczas ładowania konsultacji.
          </p>
        </div>
      </div>
    );
  }

  const mappedEvents = acceptedBookings.map(
    mapConsultationBookingToCalendarEvent,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kalendarz konsultacji</h1>
        <p className="text-muted-foreground">Zaakceptowane konsultacje</p>
      </div>

      {mappedEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border py-12">
          <p className="text-muted-foreground">
            Brak zaakceptowanych konsultacji
          </p>
        </div>
      ) : (
        <Calendar events={mappedEvents} users={[]} readOnly={true} />
      )}
    </div>
  );
}
