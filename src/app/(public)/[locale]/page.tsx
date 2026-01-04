import HomepageBuilder from "@/components/custom/homepage/HomepageBuilder";
import { loadHomepageData } from "@/data/loaders/homepage";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
  };
}

export default async function Home() {
  const t = await getTranslations("HomePage");
  const homepage = await loadHomepageData();

  if (!homepage) {
    return (
      <div className="flex grow flex-col items-center justify-center">
        <p className="text-muted-foreground">
          {t("error")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex grow flex-col">
      <HomepageBuilder homepage={homepage} />
    </div>
  );
}
