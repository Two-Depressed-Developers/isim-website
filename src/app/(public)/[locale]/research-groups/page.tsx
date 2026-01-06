"use client";

import ResearchGroupTile from "@/components/custom/research-groups/ResearchGroupTile";
import PageTitle from "@/components/PageTitle";
import { QueryWrapper } from "@/components/QueryWrapper";
import { getGroupsData } from "@/data/api/groups";
import { useGroupsData } from "@/data/queries/use-groups";
import { queryKeys } from "@/data/query-keys";
import { usePrefetchLocales } from "@/hooks/use-prefetch-locales";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

function ResearchGroupsList() {
  const t = useTranslations("ResearchGroups");
  const locale = useLocale();
  const { data: groups } = useGroupsData(locale);

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

export default function ResearchGroupsPage() {
  const t = useTranslations("ResearchGroups");

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-8">
      <PageTitle title={t("title")} />
      <QueryWrapper
        loadingFallback={
          <div className="flex items-center justify-center py-16">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        }
      >
        <ResearchGroupsList />
      </QueryWrapper>
    </div>
  );
}
