import { CalendarBody } from "@/components/calendar/calendar-body";
import { CalendarProvider } from "@/components/calendar/contexts/calendar-context";
import { CalendarHeader } from "@/components/calendar/header/calendar-header";
import { IEvent, IUser } from "./interfaces";

type Props = {
  events: IEvent[];
  users: IUser[];
  readOnly?: boolean;
};

export function Calendar({ events, users, readOnly = true }: Props) {
  return (
    <CalendarProvider
      events={events}
      users={users}
      view="month"
      readOnly={readOnly}
    >
      <div className="border-gray-accent w-full border">
        <CalendarHeader />
        <CalendarBody />
      </div>
    </CalendarProvider>
  );
}
