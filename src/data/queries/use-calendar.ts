import { getCalendarEvents } from "../api/calendar";
import { queryKeys } from "../query-keys";
import { createSuspenseQueryHook } from "./types";

export const useCalendarEvents = createSuspenseQueryHook(
  queryKeys.calendar.events,
  getCalendarEvents,
);
