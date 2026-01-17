import { Group } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ExternalLink, Users } from "lucide-react";
import CustomLink from "@/components/CustomLink";
import { useTranslations } from "next-intl";

type Props = {
  group: Group;
  variant?: "default" | "compact";
};

export default function ResearchGroupTile({
  group,
  variant = "default",
}: Props) {
  const t = useTranslations("ResearchGroups");

  const membersCount = group.members?.length ?? 0;
  const keywords = group.keywords?.split(",").map((k) => k.trim()) ?? [];

  if (variant === "compact") {
    const content = (
      <>
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-1">
            <h3 className="text-md font-semibold">{group.name}</h3>
            {group.supervisor && (
              <p className="text-primary text-sm font-semibold">
                {t("leader")}: {group.supervisor.title}{" "}
                {group.supervisor.fullName}
              </p>
            )}
          </div>
          <p className="text-muted-foreground line-clamp-4 text-sm">
            {group.shortDescription}
          </p>
        </div>

        <div className="flex flex-col gap-y-4">
          <div className="h-[1px] bg-gray-100" />
          <div className="flex items-center gap-1 text-sm font-medium">
            <span className="text-primary font-bold">{membersCount}</span>{" "}
            {t("members")}
          </div>
        </div>
      </>
    );

    const styles =
      "group relative flex flex-col justify-between gap-y-4 border border-gray-200 bg-white p-6 transition-all hover:border-primary/50";

    if (group.siteLink) {
      return (
        <CustomLink
          href={group.siteLink.URL}
          isExternal={group.siteLink.isExternal}
          className={styles}
        >
          <ArrowUpRight className="group-hover:text-primary absolute top-4 right-4 h-5 w-5 text-gray-400 transition-colors" />
          {content}
        </CustomLink>
      );
    }

    return <div className={styles}>{content}</div>;
  }

  return (
    <div className="group border-l-primary/60 bg-card hover:from-primary/5 relative block rounded-lg border border-l-4 p-6 transition hover:bg-gradient-to-r hover:to-transparent">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-xl leading-snug font-semibold transition-colors">
            {group.name}
          </h2>

          {group.supervisor && (
            <p className="text-muted-foreground text-sm font-semibold">
              {t("leader")}: {group.supervisor.title}{" "}
              {group.supervisor.fullName}
            </p>
          )}
        </div>

        <div className="text-primary flex shrink-0 items-center gap-1 text-sm font-medium">
          <Users className="h-4 w-4" />
          <span>{membersCount}</span>
        </div>
      </div>

      {group.longDescription && (
        <p className="mt-4 max-w-5xl text-sm">{group.longDescription}</p>
      )}

      {keywords.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {keywords.slice(0, 6).map((keyword) => (
            <Badge
              key={keyword}
              variant="secondary"
              className="bg-primary/5 text-primary border-primary/30 px-5 py-1.5 text-xs"
            >
              {keyword}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-end gap-3 border-t pt-4">
        {group.siteLink && (
          <CustomLink
            href={group.siteLink.URL}
            isExternal={group.siteLink.isExternal}
            onClick={(e) => e.stopPropagation()}
            className="border-input bg-muted hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-center gap-3 rounded-md border px-4 py-1.5 text-center text-sm font-medium transition-colors"
          >
            {t("teamSite")}
            <ExternalLink className="h-3.5 w-3.5" />
          </CustomLink>
        )}

        {group.badapLink && (
          <CustomLink
            href={group.badapLink.URL}
            isExternal={group.badapLink.isExternal}
            onClick={(e) => e.stopPropagation()}
            className="border-input bg-muted hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-center gap-3 rounded-md border px-4 py-1.5 text-center text-sm font-medium transition-colors"
          >
            BADaP
            <ExternalLink className="h-3.5 w-3.5" />
          </CustomLink>
        )}
      </div>
    </div>
  );
}
