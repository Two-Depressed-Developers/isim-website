"use client";

import PublicationTile from "@/components/custom/conferences/PublicationTile";
import { useConferences } from "@/data/queries/use-conferences";
import { useJournals } from "@/data/queries/use-journals";
import { BookOpen, CalendarDays, Loader2 } from "lucide-react";
import PageTitle from "@/components/PageTitle";
import { QueryWrapper } from "@/components/QueryWrapper";

function PublicationsList() {
  const { data: conferences } = useConferences();
  const { data: journals } = useJournals();

  if (conferences.length === 0 && journals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground mt-4">
          Brak dostępnych publikacji i wydarzeń.
        </p>
      </div>
    );
  }

  return (
    <>
      {journals.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen className="text-primary h-6 w-6" />
            <h2 className="text-2xl font-semibold">Czasopisma naukowe</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {journals.map((journal) => (
              <PublicationTile
                key={journal.documentId}
                item={journal}
                type="journal"
              />
            ))}
          </div>
        </div>
      )}

      {conferences.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-primary h-6 w-6" />
            <h2 className="text-2xl font-semibold">Konferencje i wydarzenia</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {conferences.map((conference) => (
              <PublicationTile
                key={conference.documentId}
                item={conference}
                type="conference"
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function ConferencesPage() {
  return (
    <div className="container mx-auto max-w-7xl space-y-12 p-8">
      <PageTitle title="Publikacje i wydarzenia" />
      <QueryWrapper
        loadingFallback={
          <div className="flex items-center justify-center py-16">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        }
      >
        <PublicationsList />
      </QueryWrapper>
    </div>
  );
}
