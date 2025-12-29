"use client";

import { useMemo, useState } from "react";
import { Plus, Save, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MemberData, ConsultationAvailability } from "@/lib/types";
import { useUpdateMember } from "@/data/queries/use-members";
import { AvailabilityTile } from "./AvailabilityTile";
import { AvailabilityFormModal } from "./AvailabilityFormModal";

const DAYS_ORDER: Record<string, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

const DAYS_POLISH: Record<string, string> = {
  monday: "Poniedziałek",
  tuesday: "Wtorek",
  wednesday: "Środa",
  thursday: "Czwartek",
  friday: "Piątek",
  saturday: "Sobota",
  sunday: "Niedziela",
};

type Props = {
  member: MemberData;
}

export function AvailabilityManager({ member }: Props) {
  const { data: session } = useSession();
  const updateMutation = useUpdateMember(member.slug);

  const [availabilities, setAvailabilities] = useState<Partial<ConsultationAvailability>[]>(
    member.consultationAvailability || []
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ConsultationAvailability> | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const groupedAvailabilities = useMemo(() => {
    const groups: Record<string, { OriginalIndex: number; item: Partial<ConsultationAvailability> }[]> = {};
    availabilities.forEach((item, index) => {
      const day = item.dayOfWeek || "monday";
      if (!groups[day]) groups[day] = [];
      groups[day].push({ OriginalIndex: index, item });
    });
    
    Object.keys(groups).forEach(day => {
      groups[day].sort((a, b) => (a.item.startTime || "").localeCompare(b.item.startTime || ""));
    });

    return groups;
  }, [availabilities]);

  const sortedDays = Object.keys(groupedAvailabilities).sort((a, b) => DAYS_ORDER[a] - DAYS_ORDER[b]);

  const handleAdd = () => {
    setEditingItem(null);
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingItem(availabilities[index]);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index: number) => {
    setAvailabilities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleModalSubmit = (data: any) => {
    if (editingIndex !== null) {
      setAvailabilities((prev) => {
        const next = [...prev];
        next[editingIndex] = data;
        return next;
      });
    } else {
      setAvailabilities((prev) => [...prev, data]);
    }
  };

  const hasChanges = JSON.stringify(availabilities) !== JSON.stringify(member.consultationAvailability || []);

  const handleSave = async () => {
    if (!session?.accessToken) {
      toast.error("Brak autoryzacji.");
      return;
    }

    try {
      const cleanedAvailabilities = availabilities.map((a) => {
        const formatTime = (t: string) => {
          if (t.length === 5) return `${t}:00.000`;
          if (t.length === 8) return `${t}.000`;
          return t;
        };

        return {
          dayOfWeek: a.dayOfWeek,
          durationMinutes: Number(a.durationMinutes),
          endTime: formatTime(a.endTime || "10:00"),
          isActive: Boolean(a.isActive),
          startTime: formatTime(a.startTime || "09:00"),
        };
      });

      await updateMutation.mutateAsync({
        documentId: member.documentId,
        data: {
          consultationAvailability: cleanedAvailabilities,
        } as Partial<MemberData>,
        accessToken: session.accessToken as string,
      });

      toast.success("Dostępność została zaktualizowana!");
    } catch (error) {
      toast.error("Nie udało się zaktualizować dostępności.");
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle>Twoja dostępność</CardTitle>
            <CardDescription>
              Skonfiguruj stałe terminy swoich konsultacji. Studenci będą mogli zapisywać się tylko w tych ramach.
            </CardDescription>
          </div>
          <Button onClick={handleAdd} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Dodaj termin
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {availabilities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Nie zdefiniowano jeszcze żadnych terminów.</p>
              <Button variant="link" onClick={handleAdd}>Dodaj pierwszy termin</Button>
            </div>
          ) : (
            <div className="space-y-8">
              {sortedDays.map(day => (
                <div key={day} className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    <Calendar className="h-4 w-4" />
                    {DAYS_POLISH[day]}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedAvailabilities[day].map(({ OriginalIndex, item }) => (
                      <AvailabilityTile
                        key={OriginalIndex}
                        availability={item}
                        onEdit={() => handleEdit(OriginalIndex)}
                        onDelete={() => handleDelete(OriginalIndex)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {hasChanges && (
        <div className="flex justify-end sticky bottom-6 z-10">
          <Button 
            onClick={handleSave} 
            disabled={updateMutation.isPending}
            className="gap-2 shadow-lg"
            size="lg"
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Zapisz wszystkie zmiany
          </Button>
        </div>
      )}

      <AvailabilityFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={editingItem}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
