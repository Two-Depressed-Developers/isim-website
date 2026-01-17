"use client";

import ResearchGroupTile from "@/components/custom/research-groups/ResearchGroupTile";
import PageTitle from "@/components/PageTitle";
import { getGroupsData } from "@/data/api/groups";
import { useResearchGroupsData } from "@/data/queries/use-groups";
import { queryKeys } from "@/data/query-keys";
import { usePrefetchLocales } from "@/hooks/use-prefetch-locales";
import { useLocale, useTranslations } from "next-intl";

function ResearchGroupsList() {
  const t = useTranslations("ResearchGroups");
  const locale = useLocale();
  const { data: groups } = useResearchGroupsData(locale, true);

  usePrefetchLocales(queryKeys.groups.all, getGroupsData);

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">{t("notFound")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <ResearchGroupTile key={group.documentId} group={group} />
      ))}
    </div>
  );
}

export default function ResearchGroupsContent() {
  const t = useTranslations("ResearchGroups");

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 pt-4 pb-8">
      <PageTitle
        title={t("title")}
        label={t("label")}
        description={t("description")}
      />
      <ResearchGroupsList />
    </div>
  );
}
