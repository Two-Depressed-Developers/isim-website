import { Group } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Database, ExternalLink, Users } from "lucide-react";
import CustomLink from "@/components/CustomLink";
import { useTranslations } from "next-intl";
import CardAsLinkWrapper from "../CardAsLinkWrapper";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    return (
      <CardAsLinkWrapper
        link={group.siteLink}
        className="group hover:border-primary/50 relative flex flex-col justify-between gap-y-4 border border-gray-200 bg-white p-6 transition-all"
      >
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
      </CardAsLinkWrapper>
    );
  }

  return (
    <Card className="hover:border-primary/50 group flex flex-col gap-4 p-6 transition-colors duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <h2 className="font-display text-xl font-bold">{group.name}</h2>
          {group.supervisor && (
            <p className="text-xs font-semibold text-gray-500">
              {t("leader")}: {group.supervisor.title}{" "}
              {group.supervisor.fullName}
            </p>
          )}
        </div>
        <div className="mt-1 flex items-center gap-1 text-sm font-medium text-gray-500">
          <Users className="size-4" />
          <span className="font-semibold">{membersCount}</span>{" "}
          <span className="hidden sm:block">{t("members")}</span>
        </div>
      </div>

      {group.longDescription && (
        <p className="text-sm leading-relaxed text-slate-600">
          {group.longDescription}
        </p>
      )}

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {keywords.map((keyword) => (
            <Badge
              variant="outline"
              key={keyword}
              className="bg-primary/10 text-primary border-0 text-xs font-medium capitalize"
            >
              {keyword}
            </Badge>
          ))}
        </div>
      )}

      {(group.siteLink || group.badapLink) && (
        <>
          <Separator className="bg-gray-accent/75" />

          <div className="text-primary flex gap-6 text-xs">
            {group.siteLink && (
              <CustomLink
                href={group.siteLink.URL}
                isExternal={group.siteLink.isExternal}
                className="flex items-center gap-2 underline-offset-4 hover:underline"
              >
                <ExternalLink size={12} />
                {t("teamSite")}
              </CustomLink>
            )}
            {group.badapLink && (
              <CustomLink
                href={group.badapLink.URL}
                isExternal={group.badapLink.isExternal}
                className="flex items-center gap-2 underline-offset-4 hover:underline"
              >
                <Database size={12} />
                BADaP
              </CustomLink>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
