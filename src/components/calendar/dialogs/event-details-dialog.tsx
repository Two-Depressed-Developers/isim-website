"use client";

import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { AddEditEventDialog } from "@/components/calendar/dialogs/add-edit-event-dialog";
import type { IEvent } from "@/components/calendar/interfaces";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { parseISO } from "date-fns";
import { Calendar, Clock, Text } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { toast } from "sonner";

interface IProps {
  event: IEvent;
  children: ReactNode;
}

export function EventDetailsDialog({ event, children }: IProps) {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  const { removeEvent, readOnly } = useCalendar();
  const t = useTranslations("Calendar.eventDetails");
  const formatDateTime = useFormatter();

  const deleteEvent = (eventId: number) => {
    try {
      removeEvent(eventId);
      toast.success("Event deleted successfully.");
    } catch {
      toast.error("Error deleting event.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-4 p-4">
            {/* <div className="flex items-start gap-2">
							<User className="mt-1 size-4 shrink-0 text-muted-foreground" />
							<div>
								<p className="text-sm font-medium">Responsible</p>
								<p className="text-sm text-muted-foreground">
									{event.user.name}
								</p>
							</div>
						</div> */}

            <div className="flex items-start gap-2">
              <Calendar className="text-muted-foreground mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">{t("startDate")}</p>
                <p className="text-muted-foreground text-sm">
                  {formatDateTime.dateTime(startDate, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                  <span className="mx-1">{t("at")}</span>
                  {formatDateTime.dateTime(startDate, {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="text-muted-foreground mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">{t("endDate")}</p>
                <p className="text-muted-foreground text-sm">
                  {formatDateTime.dateTime(endDate, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                  <span className="mx-1">{t("at")}</span>
                  {formatDateTime.dateTime(endDate, {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Text className="text-muted-foreground mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">{t("description")}</p>
                <p
                  className="text-muted-foreground text-sm"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
        {!readOnly && (
          <div className="flex justify-end gap-2">
            <AddEditEventDialog event={event}>
              <Button variant="outline">{t("edit")}</Button>
            </AddEditEventDialog>
            <Button
              variant="destructive"
              onClick={() => {
                deleteEvent(event.id);
              }}
            >
              {t("delete")}
            </Button>
          </div>
        )}
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
