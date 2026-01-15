import { getTranslations } from "next-intl/server";
import ResearchGroupsContent from "./research-groups-content";
import { QueryWrapper } from "@/components/QueryWrapper";
import { Loader2 } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ResearchGroups" });

  return {
    title: t("title"),
  };
}

export default function ResearchGroupsPage() {
  return (
    <QueryWrapper
      loadingFallback={
        <div className="flex items-center justify-center py-16">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ResearchGroupsContent />
    </QueryWrapper>
  );
}
