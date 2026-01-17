import { Course } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  Calendar,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import CustomLink from "@/components/CustomLink";
import { useTranslations } from "next-intl";
import { StrapiImage } from "@/components/StrapiImage";

type Props = {
  course: Course;
  preloadImg?: boolean;
  variant?: "default" | "compact";
};

export default function CourseTile({
  course,
  preloadImg,
  variant = "default",
}: Props) {
  const t = useTranslations("Courses");
  const isFirstDegree = course.degreeType === "I stopień";

  if (variant === "compact") {
    return (
      <div className="hover:border-primary/50 group border-gray-accent flex flex-col border bg-white transition-all">
        <div className="relative h-64 w-full overflow-hidden">
          {course.image ? (
            <StrapiImage
              imageLink={course.image.url}
              alt={course.image.alternativeText ?? ""}
              fill={true}
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              preload={preloadImg}
            />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>
        <div className="flex grow flex-col justify-between gap-y-6 p-6">
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{t(course.degreeType)}</Badge>
              <Badge variant="outline">{t(course.format)}</Badge>
            </div>
            <h3 className="text-lg font-bold">{course.title}</h3>
            {course.description && (
              <p className="line-clamp-3 text-sm text-gray-600">
                {course.description}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <CustomLink
              href={course.syllabusLink?.URL || "#"}
              isExternal={course.syllabusLink?.isExternal || false}
              className="text-primary flex items-center gap-x-1 text-base font-semibold underline-offset-4 hover:underline"
            >
              {t("syllabus")}
              <ArrowUpRight className="h-4 w-4" />
            </CustomLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group bg-card relative flex flex-col justify-between overflow-hidden rounded-lg border border-l-4 p-6 transition-all duration-300 hover:shadow-lg",
      )}
    >
      {/* <div className="pointer-events-none absolute -top-8 -right-8 z-0 opacity-[0.07] transition-transform duration-500">
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
      </div> */}
    </div>
  );
}
