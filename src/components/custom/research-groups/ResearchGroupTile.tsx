import { Group } from "@/types/strapi";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink, Microscope, Users } from "lucide-react";
import Link from "next/link";
import CustomLink from "@/components/CustomLink";

type Props = {
  group: Group;
  variant?: "default" | "compact";
};

export default function ResearchGroupTile({
  group,
  variant = "default",
}: Props) {
  const membersCount = group.members?.length ?? 0;
  const keywords = group.keywords?.split(",").map((k) => k.trim()) ?? [];

  if (variant === "compact") {
    return (
      <div className="group border-l-primary/60 bg-card hover:from-primary/5 relative flex h-full flex-col justify-between rounded-md border border-l-4 p-4 transition hover:bg-gradient-to-r hover:to-transparent">
        <div className="space-y-1">
          <h3 className="group-hover:text-primary text-sm leading-snug font-semibold transition-colors">
            {group.name}
          </h3>

          {group.shortDescription && (
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {group.shortDescription}
            </p>
          )}
        </div>

        <div className="text-primary mt-3 text-xs font-medium">
          {membersCount} członków
        </div>
      </div>
    );
  }

  return (
    <div className="group border-l-primary/60 bg-card hover:from-primary/5 relative block rounded-lg border border-l-4 p-6 transition hover:bg-gradient-to-r hover:to-transparent">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-xl leading-snug font-semibold transition-colors">
            {group.name}
          </h3>

          {group.supervisor && (
            <p className="text-muted-foreground text-sm font-semibold">
              Kierownik: {group.supervisor.title} {group.supervisor.fullName}
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
            Strona zespołu
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
