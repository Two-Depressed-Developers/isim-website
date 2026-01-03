"use client";

import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import { Calendar, Clock, Text } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
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
import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { AddEditEventDialog } from "@/components/calendar/dialogs/add-edit-event-dialog";
import { formatTime } from "@/components/calendar/helpers";
import type { IEvent } from "@/components/calendar/interfaces";

interface IProps {
  event: IEvent;
  children: ReactNode;
}

export function EventDetailsDialog({ event, children }: IProps) {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  const { use24HourFormat, removeEvent, readOnly } = useCalendar();

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
                <p className="text-sm font-medium">Data rozpoczęcia</p>
                <p className="text-muted-foreground text-sm">
                  {format(startDate, "EEEE, d LLLL", { locale: pl })}
                  <span className="mx-1">o</span>
                  {formatTime(parseISO(event.startDate), use24HourFormat)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="text-muted-foreground mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">Data zakończenia</p>
                <p className="text-muted-foreground text-sm">
                  {format(endDate, "EEEE, d LLLL", { locale: pl })}
                  <span className="mx-1">o</span>
                  {formatTime(parseISO(event.endDate), use24HourFormat)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Text className="text-muted-foreground mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">Opis</p>
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
              <Button variant="outline">Edytuj</Button>
            </AddEditEventDialog>
            <Button
              variant="destructive"
              onClick={() => {
                deleteEvent(event.id);
              }}
            >
              Usuń
            </Button>
          </div>
        )}
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
