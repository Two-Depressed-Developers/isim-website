"use client";

import { Calendar } from "@/components/calendar/calendar";
import { mapStrapiEventToCalendarEvent } from "@/components/calendar/mappers";
import { getCalendarEvents } from "@/data/api/calendar";
import { useCalendarEvents } from "@/data/queries/use-calendar";
import { queryKeys } from "@/data/query-keys";
import { usePrefetchLocales } from "@/hooks/use-prefetch-locales";
import { useLocale, useTranslations } from "next-intl";

export default function CalendarPage() {
  const t = useTranslations("Calendar");
  const locale = useLocale();
  const {
    data: calendarEvents,
    isPending,
    isError,
  } = useCalendarEvents(locale);

  usePrefetchLocales(queryKeys.calendar.events, getCalendarEvents);

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
