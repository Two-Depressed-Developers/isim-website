import { Course } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, GraduationCap } from "lucide-react";
import CustomLink from "@/components/CustomLink";
import { useTranslations } from "next-intl";

type Props = {
  course: Course;
  variant?: "default" | "compact";
};

export default function CourseTile({ course, variant = "default" }: Props) {
  const t = useTranslations("Courses");
  const isFirstDegree = course.degreeType === "I stopień";

  const theme = isFirstDegree
    ? {
        borderL: "border-l-blue-500",
        iconColor: "text-blue-500",
        hoverBorder: "group-hover:border-blue-500/30",
        badge: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
      }
    : {
        borderL: "border-l-purple-500",
        iconColor: "text-purple-500",
        hoverBorder: "group-hover:border-purple-500/30",
        badge:
          "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200",
      };

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "group bg-card relative flex items-center gap-4 overflow-hidden rounded-md border p-4 transition-all hover:shadow-md",
          "border-l-4",
          theme.borderL,
        )}
      >
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground group-hover:text-primary font-semibold transition-colors">
            {course.title}
          </h3>
          <p className="text-muted-foreground text-xs">
            {t(course.degreeType)} • {course.semesterCount} {t("semesters")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group bg-card relative flex flex-col justify-between overflow-hidden rounded-lg border border-l-4 p-6 transition-all duration-300 hover:shadow-lg",
        theme.borderL,
        theme.hoverBorder,
      )}
    >
      <div className="pointer-events-none absolute -top-8 -right-8 z-0 opacity-[0.07] transition-transform duration-500">
        <GraduationCap className={cn("h-48 w-48", theme.iconColor)} />
      </div>

      <div className="z-10 mb-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={cn("font-medium", theme.badge)}>
            {t(course.degreeType)}
          </Badge>
          <Badge
            variant="secondary"
            className={cn(
              "",
              course.format == "Stacjonarne"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-orange-200 bg-orange-50 text-orange-700",
            )}
          >
            {t(course.format)}
          </Badge>
        </div>

        <h3 className="text-foreground group-hover:text-primary text-xl leading-tight font-bold tracking-tight transition-colors">
          {course.title}
        </h3>

        {course.description && (
          <p className="text-muted-foreground mt-3 text-sm">
            {course.description}
          </p>
        )}
      </div>

      <div className="z-10 mt-auto flex items-center justify-between border-t pt-4">
        <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <Calendar className="h-4 w-4" />
          <span>
            {course.semesterCount} {t("semesters")}
          </span>
        </div>

        {course.syllabusLink && (
          <CustomLink
            href={course.syllabusLink.URL}
            isExternal={course.syllabusLink.isExternal}
            className="border-input bg-background hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-md border px-4 py-1.5 text-sm font-medium transition-colors"
          >
            {t("syllabus")}
            <ExternalLink className="h-3.5 w-3.5 opacity-75" />
          </CustomLink>
        )}
      </div>
    </div>
  );
}
