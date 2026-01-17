import type { IEvent } from "@/components/calendar/interfaces";
import type { TEventColor } from "@/components/calendar/types";
import type { CalendarEvent, ConsultationBooking } from "@/types";

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

function mapConsultationBookingToCalendarEvent(
  booking: ConsultationBooking,
): IEvent {
  const title = `Konsultacje - ${booking.studentName}`;
  const description = `${booking.fieldAndSubject}<br />Student: ${booking.studentName}<br />Email: ${booking.studentEmail}`;

  return {
    id: booking.id,
    startDate: booking.startTime,
    endDate: booking.endTime,
    title,
    color: "blue",
    description,
    user: {
      id: booking.documentId,
      name: booking.studentName,
      picturePath: null,
    },
  };
}

export function mapConsultationBookingsToGroupedEvents(
  bookings?: ConsultationBooking[],
): IEvent[] {
  const groups: Record<string, ConsultationBooking[]> = {};

  bookings?.forEach((booking) => {
    const key = `${booking.startTime}_${booking.endTime}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(booking);
  });

  return Object.values(groups).map((group) => {
    if (group.length === 1) {
      return mapConsultationBookingToCalendarEvent(group[0]);
    }

    const first = group[0];
    const count = group.length;

    const names = group.map((b) => b.studentName).join(", ");
    const title = `Konsultacje (${count}): ${names}`;

    const description = group
      .map(
        (b) =>
          `<strong>${b.studentName}</strong> <span style="opacity: 0.7">(${b.studentEmail})</span><br />Temat: ${b.fieldAndSubject}`,
      )
      .join("<br /><br />");

    return {
      id: first.id,
      startDate: first.startTime,
      endDate: first.endTime,
      title: title,
      color: "blue",
      description: description,
      user: {
        id: "group",
        name: `${count} osób`,
        picturePath: null,
      },
    };
  });
}
