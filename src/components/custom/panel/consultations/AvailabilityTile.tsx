"use client";

import { Clock, Trash2, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConsultationAvailability } from "@/types/strapi";
import { cn } from "@/lib/utils";

type Props = {
  availability: Partial<ConsultationAvailability>;
  onEdit: () => void;
  onDelete: () => void;
};

export function AvailabilityTile({ availability, onEdit, onDelete }: Props) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-md",
        !availability.isActive && "bg-muted/30 opacity-60",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="text-primary h-4 w-4" />
              <span className="text-sm font-semibold">
                {availability.startTime?.slice(0, 5)} -{" "}
                {availability.endTime?.slice(0, 5)}
              </span>
              {!availability.isActive && (
                <Badge variant="secondary" className="h-4 text-[10px]">
                  Nieaktywne
                </Badge>
              )}
            </div>

            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <span>Czas trwania okna: {availability.durationMinutes} min</span>
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onEdit}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive h-8 w-8"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
