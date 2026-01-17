"use client";

import CourseTile from "@/components/custom/courses/CourseTile";
import IconWithBackground from "@/components/custom/IconWithBackground";
import PageTitle from "@/components/PageTitle";
import { Separator } from "@/components/ui/separator";
import { getCourses } from "@/data/api/courses";
import { useCourses } from "@/data/queries/use-courses";
import { queryKeys } from "@/data/query-keys";
import { usePrefetchLocales } from "@/hooks/use-prefetch-locales";
import { GraduationCap } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

function CoursesList() {
  const t = useTranslations("Courses");
  const locale = useLocale();
  const { data: courses } = useCourses(locale);

  usePrefetchLocales(queryKeys.courses.all, getCourses);

  const firstDegreeCourses =
    courses.filter((c) => c.degreeType === "I stopień") || [];
  const secondDegreeCourses =
    courses.filter((c) => c.degreeType === "II stopień") || [];

  if (courses.length === 0) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        {t("noResults")}
      </div>
    );
  }

  return (
    <>
      {firstDegreeCourses.length > 0 && (
        <div className="flex flex-col space-y-6">
          <div className="flex items-center gap-4">
            <IconWithBackground icon={GraduationCap} />
            <h2 className="font-display text-xl font-semibold">
              {t("firstDegree")}
            </h2>
          </div>

          <Separator className="bg-gray-accent" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {firstDegreeCourses.map((course) => (
              <CourseTile key={course.documentId} course={course} />
            ))}
          </div>
        </div>
      )}

      {secondDegreeCourses.length > 0 && (
        <div className="flex flex-col space-y-6">
          <div className="flex items-center gap-4">
            <IconWithBackground icon={GraduationCap} />
            <h2 className="font-display text-xl font-semibold">
              {t("secondDegree")}
            </h2>
          </div>

          <Separator className="bg-gray-accent" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {secondDegreeCourses.map((course) => (
              <CourseTile key={course.documentId} course={course} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function CoursesContent() {
  const t = useTranslations("Courses");

  return (
    <div className="container mx-auto max-w-7xl space-y-10 px-4 pt-4 pb-8">
      <PageTitle
        title={t("title")}
        label={t("label")}
        description={t("description")}
      />
      <CoursesList />
    </div>
  );
}
