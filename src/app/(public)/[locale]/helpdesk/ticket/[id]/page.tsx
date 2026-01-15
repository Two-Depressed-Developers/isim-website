import { QueryWrapper } from "@/components/QueryWrapper";
import { Loader2 } from "lucide-react";
import TicketContent from "./ticket-content";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Helpdesk" });

  return {
    title: t("title"),
  };
}

export default function TicketStatusPage() {
  return (
    <QueryWrapper
      loadingFallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      }
    >
      <TicketContent />
    </QueryWrapper>
  );
}
