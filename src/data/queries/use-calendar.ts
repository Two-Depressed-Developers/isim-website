import { getCalendarEvents } from "../api/calendar";
import { queryKeys } from "../query-keys";
import { createSuspenseQueryHookWithParams } from "./types";

export const useCalendarEvents = createSuspenseQueryHookWithParams(
  queryKeys.calendar.events,
  getCalendarEvents,
);
