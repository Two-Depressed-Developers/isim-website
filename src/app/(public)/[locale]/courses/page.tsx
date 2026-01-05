"use client";

import CourseTile from "@/components/custom/courses/CourseTile";
import PageTitle from "@/components/PageTitle";
import { getCourses } from "@/data/api/courses";
import { useCourses } from "@/data/queries/use-courses";
import { queryKeys } from "@/data/query-keys";
import { usePrefetchLocales } from "@/hooks/use-prefetch-locales";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function CoursesPage() {
  const t = useTranslations("Courses");
  const locale = useLocale();
  const { data: courses, isPending, isError } = useCourses(locale);

  usePrefetchLocales(queryKeys.courses.all, getCourses);

  if (isPending) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-muted-foreground text-center">{t("error")}</p>
      </div>
    );
  }

  const firstDegreeCourses =
    courses.filter((c) => c.degreeType === "I stopień") || [];
  const secondDegreeCourses =
    courses.filter((c) => c.degreeType === "II stopień") || [];

  return (
    <div className="container mx-auto max-w-7xl space-y-10 p-8">
      <PageTitle title={t("title")} />

      {courses.length === 0 && (
        <div className="text-muted-foreground py-12 text-center">
          {t("noResults")}
        </div>
      )}

      {firstDegreeCourses.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-foreground/90 border-b pb-2 text-2xl font-semibold tracking-tight">
            {t("firstDegree")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {firstDegreeCourses.map((course) => (
              <CourseTile key={course.documentId} course={course} />
            ))}
          </div>
        </div>
      )}

      {secondDegreeCourses.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-foreground/90 border-b pb-2 text-2xl font-semibold tracking-tight">
            {t("secondDegree")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {secondDegreeCourses.map((course) => (
              <CourseTile key={course.documentId} course={course} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
