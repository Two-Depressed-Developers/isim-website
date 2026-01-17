import { Course } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Clock } from "lucide-react";
import CustomLink from "@/components/CustomLink";
import { useTranslations } from "next-intl";
import { StrapiImage } from "@/components/StrapiImage";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Props = {
  course: Course;
  preloadImg?: boolean;
};

export default function CourseTile({ course, preloadImg }: Props) {
  const t = useTranslations("Courses");

  return (
    <Card className="hover:border-primary/50 group flex flex-col transition-all">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
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

        <div className="flex flex-col gap-4">
          <Separator className="bg-gray-accent" />

          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span className="text-sm text-gray-600">
                {course.semesterCount}{" "}
                {course.semesterCount < 5 ? t("semesters") : t("semesters_v2")}
              </span>
            </div>

            <CustomLink
              href={course.syllabusLink?.URL ?? "#"}
              isExternal={course.syllabusLink?.isExternal ?? false}
              className="text-primary flex items-center gap-x-1 text-sm font-semibold underline-offset-4 hover:underline"
            >
              {t("syllabus")}
              <ArrowUpRight size={16} />
            </CustomLink>
          </div>
        </div>
      </div>
    </Card>
  );
}
