import { useEffect, useState } from "react";
import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { formatTime } from "@/components/calendar/helpers";

export function CalendarTimeline() {
  const { use24HourFormat } = useCalendar();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentTimePosition = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutesFromStart = (hours - 7) * 60 + minutes;
    const totalVisibleMinutes = 15 * 60; // 7AM to 9PM = 15 hours
    return (totalMinutesFromStart / totalVisibleMinutes) * 100;
  };

  const formatCurrentTime = () => {
    return formatTime(currentTime, use24HourFormat);
  };

  return (
    <div
      className="border-primary pointer-events-none absolute inset-x-0 z-50 border-t"
      style={{ top: `${getCurrentTimePosition()}%` }}
    >
      <div className="bg-primary absolute -top-1.5 -left-1.5 size-3 rounded-full"></div>

      <div className="bg-background text-primary absolute -left-18 flex w-16 -translate-y-1/2 justify-end pr-1 text-xs font-medium">
        {formatCurrentTime()}
      </div>
    </div>
  );
}
