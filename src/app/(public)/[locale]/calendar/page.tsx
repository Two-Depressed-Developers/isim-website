import { getTranslations } from "next-intl/server";
import CalendarContent from "./calendar-content";
import { QueryWrapper } from "@/components/QueryWrapper";
import { Loader2 } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Calendar" });

  return {
    title: t("title"),
  };
}

export default function CalendarPage() {
  return (
    <QueryWrapper
      loadingFallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      }
    >
      <CalendarContent />
    </QueryWrapper>
  );
}
