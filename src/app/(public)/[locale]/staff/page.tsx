import { getTranslations } from "next-intl/server";
import StaffContent from "./staff-content";
import { QueryWrapper } from "@/components/QueryWrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Staff" });

  return {
    title: t("title"),
  };
}

export default async function StaffPage() {
  return (
    <QueryWrapper>
      <StaffContent />
    </QueryWrapper>
  );
}
