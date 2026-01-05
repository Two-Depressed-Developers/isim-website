"use client";

import { ClassroomResourcesTable } from "@/components/custom/classrooms/ClassroomResourcesTable";
import { useClassroomResources } from "@/data/queries/use-classrooms";
import { useTranslations } from "next-intl";

export default function ClassesPage() {
  const t = useTranslations("Classrooms");
  const { data: classrooms, isPending, isError } = useClassroomResources();

  if (isPending) {
    return <div>{t("loading")}</div>;
  }

  if (isError) {
    return <div>{t("error")}</div>;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-2 py-8">
      <ClassroomResourcesTable classrooms={classrooms || []} />
    </div>
  );
}
