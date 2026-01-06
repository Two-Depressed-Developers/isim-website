"use client";

import { Calendar } from "@/components/calendar/calendar";
import { mapStrapiEventToCalendarEvent } from "@/components/calendar/mappers";
import { QueryWrapper } from "@/components/QueryWrapper";
import { getCalendarEvents } from "@/data/api/calendar";
import { useCalendarEvents } from "@/data/queries/use-calendar";
import { queryKeys } from "@/data/query-keys";
import { usePrefetchLocales } from "@/hooks/use-prefetch-locales";
import { Loader2 } from "lucide-react";
import { useLocale } from "next-intl";

function CalendarView() {
  const locale = useLocale();
  const { data: calendarEvents } = useCalendarEvents(locale);

  usePrefetchLocales(queryKeys.calendar.events, getCalendarEvents);

  const mappedEvents = calendarEvents.map(mapStrapiEventToCalendarEvent);

  return <Calendar events={mappedEvents} users={[]} />;
}

export default function CalendarPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-2 py-8">
      <QueryWrapper
        loadingFallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        }
      >
        <CalendarView />
      </QueryWrapper>
    </div>
  );
}
