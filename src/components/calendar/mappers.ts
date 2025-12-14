import type { IEvent } from "@/components/calendar/interfaces";
import type { TEventColor } from "@/components/calendar/types";
import type { CalendarEvent } from "@/lib/types";

export function mapStrapiEventToCalendarEvent(
  strapiEvent: CalendarEvent,
): IEvent {
  const validColors: TEventColor[] = [
    "blue",
    "green",
    "red",
    "yellow",
    "purple",
    "orange",
  ];
  const color = validColors.includes(strapiEvent.color as TEventColor)
    ? (strapiEvent.color as TEventColor)
    : "blue";

  return {
    id: strapiEvent.id,
    startDate: strapiEvent.startDate,
    endDate: strapiEvent.endDate,
    title: strapiEvent.title,
    color: color,
    description: strapiEvent.description,
    user: {
      id: "1",
      name: "Default User",
      picturePath: null,
    },
  };
}
