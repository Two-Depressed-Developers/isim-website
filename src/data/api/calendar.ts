import qs from "qs";
import type { CalendarEvent, StrapiCollectionResponse } from "@/types";
import { fetchData, baseAPIUrl } from "./base";

export async function getCalendarEvents(
  locale: string,
): Promise<CalendarEvent[]> {
  const url = new URL("/api/calendar-events", baseAPIUrl);

  const populateOptions = {
    fields: ["title", "startDate", "endDate", "description", "color"],
  };

  url.search = qs.stringify({
    populate: populateOptions,
    locale,
  });

  const response = await fetchData<StrapiCollectionResponse<CalendarEvent>>(
    url.href,
  );

  return response.data;
}
