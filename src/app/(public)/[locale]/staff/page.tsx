import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import StaffContent from "./staff-content";

export default async function StaffPage() {
  const t = await getTranslations("Staff");
  return (
    <Suspense fallback={<div>{t("loading")}</div>}>
      <StaffContent />
    </Suspense>
  )
}