"use client";

import { pl } from "date-fns/locale";
import type { ComponentProps } from "react";
import { DayPicker as ReactDayPicker } from "react-day-picker";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

type Props = ComponentProps<typeof ReactDayPicker> & {
  className?: string;
  classNames?: Partial<
    Record<keyof ComponentProps<typeof ReactDayPicker>["classNames"], string>
  >;
};

function DayPicker({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: Props) {
  return (
    <Calendar
      showOutsideDays={showOutsideDays}
      className={cn("w-full p-3", className)}
      classNames={{
        cell: cn(
          "size-9 flex items-center justify-center text-t-secondary text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
          "[&:has([aria-selected].day-range-end)]:rounded-r-lg last:[&:has([aria-selected])]:rounded-r-lg first:[&:has([aria-selected])]:rounded-l-lg [&:has([aria-selected])]:bg-bg-secondary",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8.5 p-0 font-normal aria-selected:opacity-100",
        ),
        ...classNames,
      }}
      locale={pl}
      {...props}
    />
  );
}

export { DayPicker };
