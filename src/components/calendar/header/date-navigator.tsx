import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations, useFormatter } from "next-intl";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonHover, transition } from "@/components/calendar/animations";
import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import type { IEvent } from "@/components/calendar/interfaces";
import type { TCalendarView } from "@/components/calendar/types";

import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { getEventsCount, navigateDate } from "../helpers";

interface IProps {
  view: TCalendarView;
  events: IEvent[];
}

const MotionButton = motion.create(Button);
const MotionBadge = motion.create(Badge);

export function DateNavigator({ view, events }: IProps) {
  const { selectedDate, setSelectedDate } = useCalendar();
  const format = useFormatter();
  const t = useTranslations("Calendar");

  const eventCount = useMemo(
    () => getEventsCount(events, selectedDate, view),
    [events, selectedDate, view],
  );

  const handlePrevious = () =>
    setSelectedDate(navigateDate(selectedDate, view, "previous"));
  const handleNext = () =>
    setSelectedDate(navigateDate(selectedDate, view, "next"));

  const getRangeText = () => {
    let start = selectedDate;
    let end = selectedDate;

    switch (view) {
      case "month":
      case "agenda":
        start = startOfMonth(selectedDate);
        end = endOfMonth(selectedDate);
        break;
      case "week":
        start = startOfWeek(selectedDate);
        end = endOfWeek(selectedDate);
        break;
      case "year":
        start = startOfYear(selectedDate);
        end = endOfYear(selectedDate);
        break;
      case "day":
        return format.dateTime(selectedDate, {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      default:
        break;
    }

    return format.dateTimeRange(start, end, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <motion.span
          className="text-lg font-semibold"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={transition}
        >
          {format.dateTime(selectedDate, { month: "long" })}{" "}
          {selectedDate.getFullYear()}
        </motion.span>
        <AnimatePresence mode="wait">
          <MotionBadge
            key={eventCount}
            variant="secondary"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={transition}
            suppressHydrationWarning
          >
            {eventCount} {t("events", { count: eventCount })}
          </MotionBadge>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2">
        <MotionButton
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={handlePrevious}
          variants={buttonHover}
          whileHover="hover"
          whileTap="tap"
        >
          <ChevronLeft className="h-4 w-4" />
        </MotionButton>

        <motion.p
          className="text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transition}
        >
          {getRangeText()}
        </motion.p>

        <MotionButton
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={handleNext}
          variants={buttonHover}
          whileHover="hover"
          whileTap="tap"
        >
          <ChevronRight className="h-4 w-4" />
        </MotionButton>
      </div>
    </div>
  );
}
