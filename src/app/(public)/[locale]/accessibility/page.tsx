import { getAccessibilityPage } from "@/data/api/accessibility";
import { getFormatter, getTranslations } from "next-intl/server";
import PageTitle from "@/components/PageTitle";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import ContactCard from "@/components/custom/accessibility/ContactCard";

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

  if (!data)
    return (
      <div className="flex grow flex-col items-center justify-center">
        <h1 className="text-4xl font-semibold">{t("notFound")}</h1>
      </div>
    );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-12 px-4 py-10">
      <PageTitle title={data.title} />

      <Card>
        <CardContent>
          <div className="my-6 text-sm text-gray-600">
            {t("lastUpdated")}:{" "}
            {format.dateTime(new Date(data.publicationDate), {
              year: "numeric",
              month: "long",
              day: "2-digit",
            })}
          </div>

          <div className="space-y-12">
            <section className="prose max-w-none">
              <ReactMarkdown>{data.introText}</ReactMarkdown>
            </section>

            <section className="border-l-4 border-yellow-600 bg-yellow-50 p-6">
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                {t("statusHeader")}
              </h2>
              <p className="text-gray-800">{data.complianceStatus}</p>
              <p className="mt-3 text-sm text-gray-600">
                {t("preparedOn")}:{" "}
                {format.dateTime(new Date(data.preparationDate), {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                })}
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                {t("feedbackHeader")}
              </h2>
              <p className="mb-6 text-gray-700">{t("feedbackIntro")}</p>

              {data.feedbackPersonContact && (
                <div className="mb-6">
                  <ContactCard
                    member={data.feedbackPersonContact}
                    title={t("contactPersonTitle")}
                  />
                </div>
              )}

              <div className="border-l-4 border-gray-300 bg-gray-50 p-6">
                <h3 className="mb-3 font-semibold text-gray-900">
                  {t("requestDetails")}
                </h3>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{data.feedbackProcedureText}</ReactMarkdown>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                {t("procedureHeader")}
              </h2>
              <div className="prose max-w-none">
                <ReactMarkdown>{data.enforcementProcedureText}</ReactMarkdown>
              </div>

              {data.appealPersonContact && (
                <div className="mt-6">
                  <ContactCard
                    member={data.appealPersonContact}
                    title={t("appealPersonTitle")}
                  />
                </div>
              )}
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
