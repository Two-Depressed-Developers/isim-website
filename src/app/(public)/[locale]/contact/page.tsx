import { getContactPage } from "@/data/api/contact";
import { getTranslations } from "next-intl/server";
import PageTitle from "@/components/PageTitle";
import ContactContent from "./contact-content";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });

  return {
    title: t("metaTitle"),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  const data = await getContactPage(locale);

  if (!data)
    return (
      <div className="flex grow flex-col items-center justify-center">
        <h1 className="text-4xl font-semibold">{t("notFound")}</h1>
      </div>
    );

  return (
    <div className="container mx-auto max-w-7xl space-y-12 px-4 py-8">
      <PageTitle title={t("title")} />
      <ContactContent data={data} />
    </div>
  );
}
