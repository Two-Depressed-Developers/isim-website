"use client";

import PublicationTile from "@/components/custom/conferences/PublicationTile";
import IconWithBackground from "@/components/custom/IconWithBackground";
import PageTitle from "@/components/PageTitle";
import { getConferences } from "@/data/api/conferences";
import { useConferences } from "@/data/queries/use-conferences";
import { useJournals } from "@/data/queries/use-journals";
import { queryKeys } from "@/data/query-keys";
import { usePrefetchLocales } from "@/hooks/use-prefetch-locales";
import { BookOpen, CalendarDays } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";

function PublicationsList() {
  const t = useTranslations("Conferences");
  const locale = useLocale();
  const { data: conferences } = useConferences(locale);
  const { data: journals } = useJournals(locale);

  usePrefetchLocales(queryKeys.conferences.all, getConferences);

  if (conferences.length === 0 && journals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground mt-4">{t("empty")}</p>
      </div>
    );
  }

  return (
    <>
      {journals.length > 0 && (
        <div className="flex flex-col space-y-6">
          <div className="flex items-center gap-4">
            <IconWithBackground icon={BookOpen} />
            <h2 className="font-display text-xl font-semibold">
              {t("journals")}
            </h2>
          </div>

          <Separator className="bg-gray-accent" />

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
        <div className="flex flex-col space-y-6">
          <div className="flex items-center gap-4">
            <IconWithBackground icon={CalendarDays} />
            <h2 className="font-display text-xl font-semibold">
              {t("events")}
            </h2>
          </div>

          <Separator className="bg-gray-accent" />

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

export default function ConferencesContent() {
  const t = useTranslations("Conferences");

  return (
    <div className="container mx-auto max-w-7xl space-y-12 px-4 pt-4 pb-8">
      <PageTitle
        title={t("title")}
        label={t("label")}
        description={t("description")}
      />
      <PublicationsList />
    </div>
  );
}
