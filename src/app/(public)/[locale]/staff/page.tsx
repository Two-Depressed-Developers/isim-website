import { getTranslations } from "next-intl/server";
import StaffContent from "./staff-content";
import { QueryWrapper } from "@/components/QueryWrapper";
import PageTitle from "@/components/PageTitle";
import ActionBar from "@/components/ActionBar";
import { Suspense } from "react";

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

export default async function StaffPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Staff" });

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 pt-4 pb-8">
      <PageTitle
        title={t("title")}
        label={t("label")}
        description={t("description")}
      />
      <QueryWrapper>
        <ActionBar />
        <StaffContent />
      </QueryWrapper>
    </div>
  );
}
