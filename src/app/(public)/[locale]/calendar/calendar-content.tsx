"use client";

import { Calendar } from "@/components/calendar/calendar";
import { mapStrapiEventToCalendarEvent } from "@/components/calendar/mappers";
import PageTitle from "@/components/PageTitle";
import { getCalendarEvents } from "@/data/api/calendar";
import { useCalendarEvents } from "@/data/queries/use-calendar";
import { queryKeys } from "@/data/query-keys";
import { usePrefetchLocales } from "@/hooks/use-prefetch-locales";
import { useLocale, useTranslations } from "next-intl";

function CalendarView() {
  const locale = useLocale();
  const { data: calendarEvents } = useCalendarEvents(locale);

  usePrefetchLocales(queryKeys.calendar.events, getCalendarEvents);

  const mappedEvents = calendarEvents.map(mapStrapiEventToCalendarEvent);

  return <Calendar events={mappedEvents} users={[]} />;
}

export default function CalendarContent() {
  const t = useTranslations("Calendar");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-4 pb-8">
      <PageTitle
        label={t("label")}
        title={t("title")}
        description={t("description")}
      />
      <CalendarView />
    </div>
  );
}
