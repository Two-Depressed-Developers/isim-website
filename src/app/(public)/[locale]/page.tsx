import HomepageBuilder from "@/components/custom/homepage/HomepageBuilder";
import { loadHomepageData } from "@/data/loaders/homepage";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const homepage = await loadHomepageData();

  if (!homepage) {
    return (
      <div className="flex grow flex-col items-center justify-center">
        <p className="text-muted-foreground">{t("error")}</p>
      </div>
    );
  }

  return (
    <div className="flex grow flex-col">
      <HomepageBuilder homepage={homepage} />
    </div>
  );
}
