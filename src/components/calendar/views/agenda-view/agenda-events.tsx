import { format, parseISO } from "date-fns";
import type { FC } from "react";
import { useTranslations, useFormatter } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { EventDetailsDialog } from "@/components/calendar/dialogs/event-details-dialog";
import {
  formatTime,
  getBgColor,
  getColorClass,
  getEventsForMonth,
  getFirstLetters,
  toCapitalize,
} from "@/components/calendar/helpers";
import { EventBullet } from "@/components/calendar/views/month-view/event-bullet";

export const AgendaEvents: FC = () => {
  const {
    events,
    use24HourFormat,
    badgeVariant,
    agendaModeGroupBy,
    selectedDate,
  } = useCalendar();
  const t = useTranslations("Calendar");
  const formatDateTime = useFormatter();

  const monthEvents = getEventsForMonth(events, selectedDate);

  const agendaEvents = Object.groupBy(monthEvents, (event) => {
    return agendaModeGroupBy === "date"
      ? format(parseISO(event.startDate), "yyyy-MM-dd")
      : event.color;
  });

  const groupedAndSortedEvents = Object.entries(agendaEvents).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
  );

  return (
    <Command className="h-[80vh] bg-transparent py-4">
      <div className="mx-4 mb-4">
        <CommandInput placeholder={t("searchPlaceholder")} />
      </div>
      <CommandList className="max-h-max border-t px-3">
        {groupedAndSortedEvents.map(([date, groupedEvents]) => (
          <CommandGroup
            key={date}
            heading={
              agendaModeGroupBy === "date"
                ? formatDateTime.dateTime(parseISO(date), {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : toCapitalize(groupedEvents![0].color)
            }
          >
            {groupedEvents!.map((event) => (
              <CommandItem
                key={event.id}
                className={cn(
                  "data-[selected=true]:bg-bg data-[selected=true]:text-none mb-2 rounded-md border p-4 transition-all hover:cursor-pointer",
                  {
                    [getColorClass(event.color)]: badgeVariant === "colored",
                    "hover:bg-zinc-200 dark:hover:bg-gray-900":
                      badgeVariant === "dot",
                    "hover:opacity-60": badgeVariant === "colored",
                  },
                )}
              >
                <EventDetailsDialog event={event}>
                  <div className="flex w-full items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {badgeVariant === "dot" ? (
                        <EventBullet color={event.color} />
                      ) : (
                        <Avatar>
                          <AvatarImage src="" alt="@shadcn" />
                          <AvatarFallback className={getBgColor(event.color)}>
                            {getFirstLetters(event.title)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        <p
                          className={cn({
                            "font-medium": badgeVariant === "dot",
                            "text-foreground": badgeVariant === "dot",
                          })}
                        >
                          {event.title}
                        </p>
                        <p
                          className="text-muted-foreground line-clamp-1 w-[100px] text-sm text-ellipsis sm:w-[200px] md:text-clip"
                          dangerouslySetInnerHTML={{
                            __html: event.description,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex w-40 items-center justify-center gap-1">
                      {agendaModeGroupBy === "date" ? (
                        <>
                          <p className="text-sm">
                            {formatTime(event.startDate, use24HourFormat)}
                          </p>
                          <span className="text-muted-foreground">-</span>
                          <p className="text-sm">
                            {formatTime(event.endDate, use24HourFormat)}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm">
                            {format(event.startDate, "MM/dd/yyyy")}
                          </p>
                          <span className="text-sm">at</span>
                          <p className="text-sm">
                            {formatTime(event.startDate, use24HourFormat)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </EventDetailsDialog>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
        <CommandEmpty>{t("noResults")}</CommandEmpty>
      </CommandList>
    </Command>
  );
};
