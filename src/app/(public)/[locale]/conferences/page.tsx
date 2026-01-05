"use client";

import PublicationTile from "@/components/custom/conferences/PublicationTile";
import { useConferences } from "@/data/queries/use-conferences";
import { useJournals } from "@/data/queries/use-journals";
import { BookOpen, CalendarDays, Loader2 } from "lucide-react";
import PageTitle from "@/components/PageTitle";
import { useLocale, useTranslations } from "next-intl";
import { usePrefetchLocales } from "@/hooks/use-prefetch-locales";
import { queryKeys } from "@/data/query-keys";
import { getConferences } from "@/data/api/conferences";

export default function ConferencesPage() {
  const t = useTranslations("Conferences");
  const locale = useLocale();
  const { data: conferences, isPending, isError } = useConferences(locale);
  const {
    data: journals,
    isPending: isJournalsPending,
    isError: isJournalsError,
  } = useJournals(locale);

  usePrefetchLocales(queryKeys.conferences.all, getConferences);

  if (isPending || isJournalsPending) {
    return (
      <div className="container mx-auto flex items-center justify-center py-16">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || isJournalsError) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-muted-foreground text-center">{t("error")}</p>
      </div>
    );
  }

  if (conferences.length === 0 && journals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground mt-4">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-12 p-8">
      <PageTitle title={t("title")} />

      {journals.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen className="text-primary h-6 w-6" />
            <h2 className="text-2xl font-semibold">{t("journals")}</h2>
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
            <h2 className="text-2xl font-semibold">{t("events")}</h2>
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
    </div>
  );
}
