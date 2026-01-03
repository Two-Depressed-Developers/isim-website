"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  format,
  addMinutes,
  isAfter,
  addWeeks,
  startOfDay,
  getDay,
  parseISO,
  setHours,
  setMinutes,
} from "date-fns";
import { pl } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Mail,
  CheckCircle2,
  User,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

import WhiteCard from "../WhiteCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { consultationBookingFormSchema } from "@/lib/schemas";
import {
  useBookConsultation,
  useConsultationBookings,
} from "@/data/queries/use-consultations";
import type { MemberData } from "@/types";

type BookingFormData = z.infer<typeof consultationBookingFormSchema>;

type TimeSlot = {
  startTime: string;
  endTime: string;
  availabilityId: string;
  maxAttendees?: number | null;
};

type Props = {
  member: MemberData;
  slug: string;
};

const MemberConsultations = ({ member, slug }: Props) => {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const bookConsultation = useBookConsultation(slug);
  const { data: existingBookings = [] } = useConsultationBookings(
    member.documentId,
  );

  const form = useForm<BookingFormData>({
    resolver: zodResolver(consultationBookingFormSchema),
    defaultValues: {
      studentEmail: "",
      studentName: "",
      fieldAndSubject: "",
      startTime: "",
      endTime: "",
      memberDocumentId: member.documentId,
    },
  });

  const availableSlots = useMemo(() => {
    if (!member.consultationAvailability) return [];

    const slots: TimeSlot[] = [];
    const now = new Date();
    const weeksToGenerate = 2;

    const dayNameToNumber: Record<string, number> = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
    };

    member.consultationAvailability.forEach((availability) => {
      if (!availability.isActive) return;

      const targetDay = dayNameToNumber[availability.dayOfWeek];
      const [startHour, startMinute] = availability.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = availability.endTime.split(":").map(Number);

      for (let week = 0; week < weeksToGenerate; week++) {
        const weekStart = addWeeks(startOfDay(now), week);
        const currentDay = getDay(weekStart);
        const daysUntilTarget =
          (targetDay - currentDay + 7) % 7 || (week === 0 ? 7 : 0);
        let targetDate = addWeeks(startOfDay(now), week);
        targetDate = new Date(
          targetDate.getTime() + daysUntilTarget * 24 * 60 * 60 * 1000,
        );

        const blockStart = setMinutes(
          setHours(targetDate, startHour),
          startMinute,
        );
        const blockEnd = setMinutes(setHours(targetDate, endHour), endMinute);

        let currentSlotStart = blockStart;

        while (currentSlotStart < blockEnd) {
          const currentSlotEnd = addMinutes(
            currentSlotStart,
            availability.durationMinutes,
          );

          if (isAfter(currentSlotStart, now) && currentSlotEnd <= blockEnd) {
            slots.push({
              startTime: currentSlotStart.toISOString(),
              endTime: currentSlotEnd.toISOString(),
              availabilityId: availability.documentId,
              maxAttendees: availability.maxAttendees,
            });
          }

          currentSlotStart = currentSlotEnd;
        }
      }
    });

    const bookedSlots = existingBookings
      .filter(
        (booking) =>
          booking.reservationStatus === "pending" ||
          booking.reservationStatus === "accepted",
      )
      .reduce(
        (acc, booking) => {
          const key = `${booking.startTime}-${booking.endTime}`;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

    const availableSlots = slots.filter((slot) => {
      const key = `${slot.startTime}-${slot.endTime}`;
      const currentBookings = bookedSlots[key] || 0;

      if (!slot.maxAttendees && slot.maxAttendees !== 0) {
        return true;
      }

      return currentBookings < slot.maxAttendees;
    });

    return availableSlots;
  }, [member.consultationAvailability, existingBookings]);

  const onSubmit = async (data: BookingFormData) => {
    try {
      await bookConsultation.mutateAsync({
        studentEmail: data.studentEmail,
        studentName: data.studentName,
        fieldAndSubject: data.fieldAndSubject,
        startTime: data.startTime,
        endTime: data.endTime,
        memberDocumentId: member.documentId,
      });

      toast.success("Prośba o konsultację została wysłana!", {
        description:
          "Sprawdź swoją skrzynkę email i potwierdź rezerwację klikając w link weryfikacyjny.",
        duration: 8000,
      });

      setIsDialogOpen(false);
      setSelectedSlot(null);
      form.reset();
    } catch {
      toast.error("Wystąpił błąd", {
        description:
          "Nie udało się wysłać prośby o konsultację. Spróbuj ponownie.",
      });
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    form.setValue("startTime", slot.startTime);
    form.setValue("endTime", slot.endTime);
    form.setValue("memberDocumentId", member.documentId);
    setIsDialogOpen(true);
  };

  const groupSlotsByDate = (slots: TimeSlot[]) => {
    const grouped: Record<string, TimeSlot[]> = {};

    slots.forEach((slot) => {
      const date = format(parseISO(slot.startTime), "yyyy-MM-dd");
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });

    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  };

  if (availableSlots.length === 0) {
    return (
      <WhiteCard className="flex flex-col gap-y-4">
        <h2 className="text-3xl font-bold">Konsultacje</h2>
        <Separator />
        <div className="flex flex-col items-center justify-center gap-2 py-8">
          <Calendar className="text-muted-foreground h-12 w-12" />
          <p className="text-muted-foreground">
            Brak dostępnych terminów konsultacji
          </p>
        </div>
      </WhiteCard>
    );
  }

  const groupedSlots = groupSlotsByDate(availableSlots);

  return (
    <>
      <WhiteCard className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Konsultacje</h2>
          <Badge variant="outline" className="text-sm">
            {availableSlots.length} dostępnych terminów
          </Badge>
        </div>
        <Separator />

        <div className="space-y-6">
          {groupedSlots.map(([date, slots]) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="text-primary h-4 w-4" />
                <h3 className="text-lg font-semibold">
                  {format(parseISO(date), "EEEE, d MMMM yyyy", { locale: pl })}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {slots.map((slot, index) => (
                  <Button
                    key={`${slot.startTime}-${index}`}
                    variant="outline"
                    onClick={() => handleSlotSelect(slot)}
                    className="hover:bg-primary flex items-center gap-2 hover:text-white"
                  >
                    <Clock className="h-4 w-4" />
                    {format(parseISO(slot.startTime), "HH:mm")} -{" "}
                    {format(parseISO(slot.endTime), "HH:mm")}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="rounded-md bg-blue-50 p-4">
          <p className="text-sm text-blue-900">
            <strong>Informacja:</strong> Wybierz dostępny termin i podaj swój
            adres e-mail z domeny AGH. Po zatwierdzeniu prośby przez
            prowadzącego otrzymasz wiadomość e-mail z numerem pokoju.
          </p>
        </div>
      </WhiteCard>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rezerwacja konsultacji</DialogTitle>
            <DialogDescription>
              Konsultacje z {member.fullName}
            </DialogDescription>
          </DialogHeader>

          {selectedSlot && (
            <div className="space-y-4">
              <div className="space-y-2 rounded-md bg-gray-50 p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="text-primary h-4 w-4" />
                  <span className="font-medium">
                    {format(
                      parseISO(selectedSlot.startTime),
                      "EEEE, d MMMM yyyy",
                      { locale: pl },
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-primary h-4 w-4" />
                  <span className="font-medium">
                    {format(parseISO(selectedSlot.startTime), "HH:mm")} -{" "}
                    {format(parseISO(selectedSlot.endTime), "HH:mm")}
                  </span>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="studentEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Twój adres e-mail AGH{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="imie.nazwisko@student.agh.edu.pl"
                            startContent={<Mail className="h-4 w-4" />}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Imię i nazwisko{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Jan Kowalski"
                            startContent={<User className="h-4 w-4" />}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fieldAndSubject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Kierunek i przedmiot{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Informatyka, Bazy Danych"
                            startContent={<BookOpen className="h-4 w-4" />}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setSelectedSlot(null);
                        form.reset();
                      }}
                    >
                      Anuluj
                    </Button>
                    <Button
                      type="submit"
                      disabled={bookConsultation.isPending}
                      className="gap-2"
                    >
                      {bookConsultation.isPending ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Wysyłanie...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Wyślij prośbę
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemberConsultations;
