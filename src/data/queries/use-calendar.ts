import { getCalendarEvents } from "../api/calendar";
import { queryKeys } from "../query-keys";
import { createQueryHookWithParams } from "./types";

export const useCalendarEvents = createQueryHookWithParams(
  queryKeys.calendar.events,
  getCalendarEvents,
);
