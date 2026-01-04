"use client";

import CourseTile from "@/components/custom/courses/CourseTile";
import PageTitle from "@/components/PageTitle";
import { useCourses } from "@/data/queries/use-courses";
import { Loader2 } from "lucide-react";
import { QueryWrapper } from "@/components/QueryWrapper";

function CoursesList() {
  const { data: courses } = useCourses();

  const firstDegreeCourses =
    courses.filter((c) => c.degreeType === "I stopień") || [];
  const secondDegreeCourses =
    courses.filter((c) => c.degreeType === "II stopień") || [];

  if (courses.length === 0) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        Brak dostępnych kierunków.
      </div>
    );
  }

  return (
    <>
      {firstDegreeCourses.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-foreground/90 border-b pb-2 text-2xl font-semibold tracking-tight">
            Studia I stopnia (inżynierskie)
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
            Studia II stopnia (magisterskie)
          </h2>
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

export default function CoursesPage() {
  return (
    <div className="container mx-auto max-w-7xl space-y-10 p-8">
      <PageTitle title="Kierunki studiów" />
      <QueryWrapper
        loadingFallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        }
      >
        <CoursesList />
      </QueryWrapper>
    </div>
  );
}
