import { TicketForm } from "@/components/custom/helpdesk/TicketForm";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function HelpdeskPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Helpdesk");

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="flex justify-center">
        <TicketForm />
      </div>
    </div>
  );
}
