import { getTranslations } from "next-intl/server";
import ClassroomsContent from "./classrooms-content";
import { QueryWrapper } from "@/components/QueryWrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Classrooms" });

  return {
    title: t("title"),
  };
}

export default function ClassroomsPage() {
  return (
    <QueryWrapper>
      <ClassroomsContent />
    </QueryWrapper>
  );
}
