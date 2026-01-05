import { Page } from "@/types";
import { Separator } from "@/components/ui/separator";
import CustomLink from "@/components/CustomLink";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  title?: string;
  description?: string;
  page?: Page;
  className?: string;
};

export default function SectionHeader({
  title,
  description,
  page,
  className,
}: Props) {
  const t = useTranslations("HomePage");

  if (!title && !description) return null;

  return (
    <div className={className}>
      {title && (
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold">{title}</h2>
          {page && (
            <>
              <Separator
                orientation="vertical"
                className="bg-primary h-8 w-1 rounded"
              />
              <CustomLink
                href={page.slug ? `/${page.slug}` : "/"}
                isExternal={false}
                className="text-primary flex items-center gap-2 hover:underline"
              >
                {t("seeMore")} <ExternalLink className="inline-block h-4 w-4" />
              </CustomLink>
            </>
          )}
        </div>
      )}
      {description && <p className="mt-4 text-gray-600">{description}</p>}
    </div>
  );
}
