"use client";

import { ClassroomResourcesTable } from "@/components/custom/classrooms/ClassroomResourcesTable";
import PageTitle from "@/components/PageTitle";
import { useClassroomResources } from "@/data/queries/use-classrooms";
import { useTranslations } from "next-intl";

export default function ClassroomsContent() {
  const t = useTranslations("Classrooms");
  const { data: classrooms } = useClassroomResources();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-8 px-2 py-8">
      <PageTitle title={t("title")} />
      <ClassroomResourcesTable classrooms={classrooms || []} />
    </div>
  );
}
