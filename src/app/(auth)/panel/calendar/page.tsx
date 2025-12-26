"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { Calendar } from "@/components/calendar/calendar";
import {
  mapConsultationBookingToCalendarEvent,
  mapStrapiEventToCalendarEvent,
} from "@/components/calendar/mappers";
import { useConsultationBookings } from "@/data/queries/use-consultations";
import { useMemberData } from "@/data/queries/use-members";
import { useCalendarEvents } from "@/data/queries/use-calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link2, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const memberSlug = session?.user?.memberProfileSlug;
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const { data: globalEvents = [], isPending: isGlobalEventsPending } =
    useCalendarEvents();

  const acceptedBookings = useMemo(
    () =>
      bookings.filter((booking) => booking.reservationStatus === "accepted"),
    [bookings],
  );

  const consultationEvents = useMemo(
    () => acceptedBookings.map(mapConsultationBookingToCalendarEvent),
    [acceptedBookings],
  );

  const globalCalendarEvents = useMemo(
    () => globalEvents.map(mapStrapiEventToCalendarEvent),
    [globalEvents],
  );

  const mappedEvents = useMemo(
    () => [...consultationEvents, ...globalCalendarEvents],
    [consultationEvents, globalCalendarEvents],
  );

  const [calendarToken, setCalendarToken] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);

  useEffect(() => {
    const fetchCalendarToken = async () => {
      if (calendarToken || !session?.user?.id) return;

      setTokenLoading(true);
      try {
        const response = await fetch("/api/consultations/calendar-token");
        if (response.ok) {
          const data = await response.json();
          setCalendarToken(data.token);
        }
      } catch (error) {
        console.error("Error fetching calendar token:", error);
      } finally {
        setTokenLoading(false);
      }
    };

    fetchCalendarToken();
  }, [session?.user?.id, calendarToken]);

  const calendarFeedUrl =
    typeof window !== "undefined" && session?.user?.id && calendarToken
      ? `${window.location.origin}/api/consultations/calendar.ics?token=${calendarToken}&userId=${session.user.id}`
      : "";

  const webcalUrl = calendarFeedUrl.replace(/^https?:/, "webcal:");

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(webcalUrl);
      setCopied(true);
      toast.success("Link skopiowany do schowka");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Nie udało się skopiować linku");
    }
  };

  if (
    status === "loading" ||
    isMemberPending ||
    isBookingsPending ||
    isGlobalEventsPending
  ) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kalendarz konsultacji</h1>
          <p className="text-muted-foreground">Zaakceptowane konsultacje</p>
        </div>
        {acceptedBookings.length > 0 && (
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default">
                  <Link2 className="mr-2 h-4 w-4" />
                  Dodaj konsultacje do swojego kalendarza
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Subskrybuj kalendarz konsultacji</DialogTitle>
                  <DialogDescription>
                    Skopiuj poniższy link i dodaj go do swojej aplikacji
                    kalendarzowej. Kalendarz będzie automatycznie aktualizowany
                    gdy pojawią się nowe konsultacje.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={
                        tokenLoading
                          ? "Ładowanie..."
                          : webcalUrl || "Brak linku"
                      }
                      disabled={!webcalUrl || tokenLoading}
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      size="icon"
                      disabled={!webcalUrl || tokenLoading}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="bg-muted rounded-lg border p-4 text-sm">
                    <p className="mb-2 font-medium">Instrukcja:</p>
                    <ul className="text-muted-foreground list-inside list-disc space-y-1">
                      <li>
                        <strong>Google Calendar:</strong> Kliknij &quot;+&quot;
                        obok &quot;Inne kalendarze&quot; → &quot;Z adresu
                        URL&quot; → wklej link
                      </li>
                      <li>
                        <strong>Apple Calendar:</strong> Plik → Nowa subskrypcja
                        kalendarza → wklej link
                      </li>
                      <li>
                        <strong>Outlook:</strong> Dodaj kalendarz → Subskrybuj z
                        sieci Web → wklej link
                      </li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
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
