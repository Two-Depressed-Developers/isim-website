"use client";

import ResearchGroupTile from "@/components/custom/research-groups/ResearchGroupTile";
import PageTitle from "@/components/PageTitle";
import { useGroupsData } from "@/data/queries/use-groups";
import { Loader2 } from "lucide-react";
import { getGroupsData } from "@/data/api/groups";
import { queryKeys } from "@/data/query-keys";
import { usePrefetchLocales } from "@/hooks/use-prefetch-locales";
import { useLocale, useTranslations } from "next-intl";

export default function ResearchGroupsPage() {
  const t = useTranslations("ResearchGroups");
  const locale = useLocale();
  const { data: groups, isPending, isError } = useGroupsData(locale);

  usePrefetchLocales(queryKeys.groups.all, getGroupsData);

  if (isPending) {
    return (
      <div className="container mx-auto flex items-center justify-center py-16">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-muted-foreground text-center">{t("error")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-8">
      <PageTitle title={t("title")} />

      {groups.length > 0 ? (
        <div className="space-y-4">
          {groups.map((group) => (
            <ResearchGroupTile key={group.documentId} group={group} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground">{t("notFound")}</p>
        </div>
      )}
    </div>
  );
}
