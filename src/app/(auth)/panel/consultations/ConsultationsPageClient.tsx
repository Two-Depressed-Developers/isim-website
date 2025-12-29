"use client";

import { useMemberData } from "@/data/queries/use-members";
import { Loader2 } from "lucide-react";
import ConsultationBookingsList from "@/components/custom/panel/ConsultationBookingsList";
import { AvailabilityManager } from "@/components/custom/panel/consultations/AvailabilityManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  memberSlug: string;
}

export default function ConsultationsPageClient({ memberSlug }: Props) {
  const { data: memberData, isPending, isError } = useMemberData(memberSlug);

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">
          Wystąpił błąd podczas ładowania danych profilu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Konsultacje</h1>
        <p className="text-muted-foreground">
          Zarządzaj swoją dostępnością oraz prośbami od studentów
        </p>
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="bookings">Prośby o spotkanie</TabsTrigger>
          <TabsTrigger value="availability">Moja dostępność</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings" className="mt-6">
          <ConsultationBookingsList memberSlug={memberSlug} />
        </TabsContent>
        <TabsContent value="availability" className="mt-6">
          <AvailabilityManager member={memberData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
