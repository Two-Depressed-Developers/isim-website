"use client";

import { ClassroomResourcesTable } from "@/components/custom/classrooms/ClassroomResourcesTable";
import { useClassroomResources } from "@/data/queries";

export default function ClassesPage() {
  const { data: classrooms, isPending, isError } = useClassroomResources();

  if (isPending) {
    return <div>Ładowanie zasobów sal...</div>;
  }

  if (isError) {
    return <div>Wystąpił błąd podczas ładowania zasobów sal.</div>;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-2 py-8">
      <ClassroomResourcesTable classrooms={classrooms} />
    </div>
  );
}
