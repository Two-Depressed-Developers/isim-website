import { motion } from "framer-motion";
import { useMemo } from "react";
import { staggerContainer, transition } from "@/components/calendar/animations";
import { useCalendar } from "@/components/calendar/contexts/calendar-context";

import {
  calculateMonthEventPositions,
  getCalendarCells,
} from "@/components/calendar/helpers";

import type { IEvent } from "@/components/calendar/interfaces";
import { DayCell } from "@/components/calendar/views/month-view/day-cell";

import { startOfWeek, addDays } from "date-fns";
import { useFormatter } from "next-intl";

interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

export function CalendarMonthView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate } = useCalendar();
  const formatDateTime = useFormatter();

  const allEvents = [...multiDayEvents, ...singleDayEvents];

  const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate]);

  const eventPositions = useMemo(
    () =>
      calculateMonthEventPositions(
        multiDayEvents,
        singleDayEvents,
        selectedDate,
      ),
    [multiDayEvents, singleDayEvents, selectedDate],
  );

  const weekStart = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <motion.div initial="initial" animate="animate" variants={staggerContainer}>
      <div className="grid grid-cols-7">
        {weekDays.map((day, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-center py-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, ...transition }}
          >
            <span className="text-t-quaternary text-xs font-medium">
              {formatDateTime.dateTime(day, { weekday: "short" })}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-7 overflow-hidden">
        {cells.map((cell, index) => (
          <DayCell
            key={index}
            cell={cell}
            events={allEvents}
            eventPositions={eventPositions}
          />
        ))}
      </div>
    </motion.div>
  );
}
