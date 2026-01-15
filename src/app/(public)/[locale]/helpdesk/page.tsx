import { TicketForm } from "@/components/custom/helpdesk/TicketForm";
import PageTitle from "@/components/PageTitle";
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
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-8 px-2 py-8">
      <PageTitle title={t("title")} description={t("subtitle")} />

      <div className="flex justify-center">
        <TicketForm />
      </div>
    </div>
  );
}
