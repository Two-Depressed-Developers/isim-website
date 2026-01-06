"use client";

import ConsultationBookingsList from "@/components/custom/panel/ConsultationBookingsList";
import { AvailabilityManager } from "@/components/custom/panel/consultations/AvailabilityManager";
import { QueryWrapper } from "@/components/QueryWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemberData } from "@/data/queries/use-members";
import { Loader2 } from "lucide-react";

type Props = {
  memberSlug: string;
};

function ConsultationsContent({ memberSlug }: Props) {
  const { data: memberData } = useMemberData(memberSlug);

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Konsultacje</h1>
        <p className="text-muted-foreground">
          Zarządzaj swoją dostępnością oraz prośbami od studentów
        </p>
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
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

export default function ConsultationsPageClient({ memberSlug }: Props) {
  return (
    <QueryWrapper
      loadingFallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ConsultationsContent memberSlug={memberSlug} />
    </QueryWrapper>
  );
}
