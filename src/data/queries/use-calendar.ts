import { getCalendarEvents } from "../api/calendar";
import { queryKeys } from "../query-keys";
import { createQueryHook } from "./types";

export const useCalendarEvents = createQueryHook(
  queryKeys.calendar.events,
  getCalendarEvents,
);
