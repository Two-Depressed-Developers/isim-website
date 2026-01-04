"use client";

import { Calendar } from "@/components/calendar/calendar";
import { mapStrapiEventToCalendarEvent } from "@/components/calendar/mappers";
import { useCalendarEvents } from "@/data/queries/use-calendar";
import { QueryWrapper } from "@/components/QueryWrapper";

function CalendarView() {
  const { data: calendarEvents } = useCalendarEvents();
  const mappedEvents = calendarEvents.map(mapStrapiEventToCalendarEvent);

  return <Calendar events={mappedEvents} users={[]} />;
}

export default function CalendarPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-2 py-8">
      <QueryWrapper
        loadingFallback={
          <div className="flex h-[600px] items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
              <p className="text-muted-foreground text-sm">
                Loading calendar...
              </p>
            </div>
          </div>
        }
      >
        <CalendarView />
      </QueryWrapper>
    </div>
  );
}
