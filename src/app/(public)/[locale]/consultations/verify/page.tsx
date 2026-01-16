import { Suspense } from "react";
import { VerifyConsultationContent } from "./verify-content";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "VerifyConsultation" });

  return {
    title: t("verifying"),
  };
}

export default function VerifyConsultationPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex justify-center py-8">
          Loading...
        </div>
      }
    >
      <VerifyConsultationContent />
    </Suspense>
  );
}
