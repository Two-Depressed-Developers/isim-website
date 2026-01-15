import HomepageBuilder from "@/components/custom/homepage/HomepageBuilder";
import { loadHomepageData } from "@/data/loaders/homepage";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const homepage = await loadHomepageData();

  if (!homepage) {
    return (
      <div className="flex grow flex-col items-center justify-center gap-y-2">
        <h1 className="max-w-3xl text-center text-6xl">{t("department")}</h1>
        <h3 className="text-xl text-gray-600">{t("AGHUniversity")}</h3>
        <h4 className="text-lg text-gray-400">{t("facultyOf")}</h4>
      </div>
    );
  }

  return (
    <div className="flex grow flex-col">
      <h1 className="sr-only">{t("department")}</h1>
      <HomepageBuilder homepage={homepage} />
    </div>
  );
}
