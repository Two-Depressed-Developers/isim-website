import { getAccessibilityPage } from "@/data/api/accessibility";
import { getFormatter, getTranslations } from "next-intl/server";
import PageTitle from "@/components/PageTitle";
import { MarkdownRenderer } from "@/components/custom/MarkdownRenderer";
import { ShieldCheck, MessageSquare, Scale, Calendar } from "lucide-react";
import { AccessibilitySection } from "@/components/custom/accessibility/AccessibilitySection";
import { ContactCard } from "@/components/custom/accessibility/ContactCard";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Accessibility" });
  return { title: t("metaTitle") };
}

export default async function AccessibilityPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Accessibility" });
  const format = await getFormatter();
  const data = await getAccessibilityPage(locale);

  if (!data) {
    return (
      <div className="flex grow flex-col items-center justify-center">
        <h1 className="text-4xl font-semibold">{t("notFound")}</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-slate-900">
      <div className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4">
          <PageTitle
            title={data.title}
            label={t("label")}
            description={t("description")}
          />
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            <Calendar size={16} />
            <span>
              {t("lastUpdated")}:{" "}
              {format.dateTime(new Date(data.publicationDate), {
                year: "numeric",
                month: "long",
                day: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-second-background border-gray-accent border-y py-16">
        <div className="prose mx-auto max-w-7xl px-4">
          <MarkdownRenderer content={data.introText} />
        </div>
      </div>

      <AccessibilitySection icon={ShieldCheck} title={t("statusHeader")}>
        <p>{data.complianceStatus}</p>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <Calendar size={16} />
          <span>
            {t("preparedOn")}:{" "}
            {format.dateTime(new Date(data.preparationDate), {
              year: "numeric",
              month: "long",
              day: "2-digit",
            })}
          </span>
        </div>
      </AccessibilitySection>

      <AccessibilitySection
        icon={MessageSquare}
        title={t("feedbackHeader")}
        gray
      >
        <p className="mb-8">{t("feedbackIntro")}</p>
        <div className="flex flex-col gap-6">
          {data.feedbackPersonContact && (
            <ContactCard
              contact={data.feedbackPersonContact}
              title={t("contactPersonTitle")}
            />
          )}
          <div className="border-gray-accent border bg-white p-6">
            <h3 className="mt-0 mb-4 font-semibold">{t("requestDetails")}</h3>
            <MarkdownRenderer content={data.feedbackProcedureText} />
          </div>
        </div>
      </AccessibilitySection>

      <AccessibilitySection icon={Scale} title={t("procedureHeader")}>
        <MarkdownRenderer content={data.enforcementProcedureText} />
        {data.appealPersonContact && (
          <div className="mt-8">
            <ContactCard
              contact={data.appealPersonContact}
              title={t("appealPersonTitle")}
              gray
            />
          </div>
        )}
      </AccessibilitySection>
    </div>
  );
}
