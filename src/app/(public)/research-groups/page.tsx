"use client";

import { Loader2 } from "lucide-react";
import { useGroupsData } from "@/data/queries/use-groups";
import ResearchGroupTile from "@/components/custom/research-groups/ResearchGroupTile";
import PageTitle from "@/components/PageTitle";
import { QueryWrapper } from "@/components/QueryWrapper";

function ResearchGroupsList() {
  const { data: groups } = useGroupsData();

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">Nie znaleziono grup badawczych.</p>
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
  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-8">
      <PageTitle title="Grupy badawcze" />
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
