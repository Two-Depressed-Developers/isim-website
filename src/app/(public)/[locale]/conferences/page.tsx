import { getTranslations } from "next-intl/server";
import ConferencesContent from "./conferences-content";
import { QueryWrapper } from "@/components/QueryWrapper";
import { Loader2 } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Conferences" });

  return {
    title: t("title"),
  };
}

export default function ConferencesPage() {
  return (
    <QueryWrapper
      loadingFallback={
        <div className="flex items-center justify-center py-16">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ConferencesContent />
    </QueryWrapper>
  );
}
