import { Page } from "@/types";
import { Separator } from "@/components/ui/separator";
import CustomLink from "@/components/CustomLink";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  eyebrow?: string;
  description?: string;
  page?: Page;
  className?: string;
};

export default function SectionHeader({
  title,
  eyebrow,
  description,
  page,
  className,
}: Props) {
  const t = useTranslations("HomePage");

  if (!title && !description) return null;

  return (
    <div className={cn("flex flex-col gap-y-6", className)}>
      <div className="flex flex-col justify-between gap-y-2 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-y-2">
          {eyebrow && (
            <p className="text-primary text-base font-medium uppercase">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="font-display text-3xl font-medium">{title}</h2>
          )}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
        {page && (
          <CustomLink
            href={page.slug ? `/${page.slug}` : "/"}
            isExternal={false}
            className="text-primary flex items-end"
          >
            <span className="flex items-center gap-1 hover:underline">
              {t("seeMore")} <ArrowUpRight className="inline-block h-4 w-4" />
            </span>
          </CustomLink>
        )}
      </div>
      <Separator className="bg-gray-accent w-full px-4" />
    </div>
  );
}
