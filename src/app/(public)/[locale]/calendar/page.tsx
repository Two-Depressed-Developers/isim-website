"use client";

import { Calendar } from "@/components/calendar/calendar";
import { mapStrapiEventToCalendarEvent } from "@/components/calendar/mappers";
import { useCalendarEvents } from "@/data/queries/use-calendar";
import { useTranslations } from "next-intl";

export default function CalendarPage() {
  const t = useTranslations("Calendar");
  const { data: calendarEvents, isPending, isError } = useCalendarEvents();

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-7xl py-8">
        <div>{t("loading")}</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-7xl py-8">
        <div>{t("error")}</div>
      </div>
    );
  }

  const mappedEvents = calendarEvents.map(mapStrapiEventToCalendarEvent);

  return (
    <div className="mx-auto w-full max-w-7xl px-2 py-8">
      <Calendar events={mappedEvents} users={[]} />
    </div>
  );
}
