import { ComponentHomepageSupervisorCard } from "@/types";
import { StrapiImage } from "@/components/StrapiImage";
import CustomLink from "@/components/CustomLink";
import { useTranslations } from "next-intl";
import SupervisorInfo from "./SupervisorInfo";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";

type Props = {
  supervisor: ComponentHomepageSupervisorCard;
  preloadImg: boolean;
};

export default function SupervisorCard({ supervisor, preloadImg }: Props) {
  const t = useTranslations("HomePage.supervisor");

  return (
    <Card className="hover:border-primary/50 group relative flex flex-col transition-all sm:max-h-64 sm:flex-row">
      {supervisor.member && (
        <CustomLink
          href={`/staff-members/${supervisor.member.slug}`}
          isExternal={false}
          className="absolute inset-0 z-20"
          aria-label={`${t("viewProfileOf")} ${supervisor.member.fullName}`}
        >
          <span className="sr-only">{t("viewProfile")}</span>
          <ArrowUpRight className="group-hover:text-primary absolute top-4 right-4 z-30 hidden h-5 w-5 text-gray-400 transition-colors sm:block" />
        </CustomLink>
      )}

      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-gray-100 sm:h-64 sm:w-64">
        {supervisor.member.photo?.url && (
          <StrapiImage
            imageLink={supervisor.member.photo.url}
            alt={supervisor.member.photo.alternativeText || t("photoAlt")}
            fill
            preload={preloadImg}
            sizes="(max-width: 640px) 100vw, 256px"
            loading={!preloadImg ? "lazy" : "eager"}
            className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
          />
        )}
      </div>

      <div className="relative flex flex-1 flex-col justify-between p-6">
        <ArrowUpRight className="group-hover:text-primary absolute top-4 right-4 z-30 block h-5 w-5 text-gray-400 transition-colors sm:hidden" />

        <div className="mb-6 flex flex-col">
          {supervisor.role && (
            <p className="text-primary mb-2 text-xs font-bold tracking-widest uppercase">
              {supervisor.role}
            </p>
          )}
          {supervisor.member.fullName && (
            <h3 className="font-display text-2xl leading-tight font-semibold sm:text-3xl">
              {supervisor.member.fullName}
            </h3>
          )}
          {(supervisor.member.title || supervisor.member.position) && (
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              <span className="block font-medium">
                {supervisor.member.title} {supervisor.member.position ?? ""}
              </span>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-3 border-t border-gray-100 pt-4 text-gray-500 sm:border-none sm:pt-0">
          {supervisor.member.phone && (
            <SupervisorInfo type="phone" value={supervisor.member.phone} />
          )}
          {supervisor.member.email && (
            <SupervisorInfo type="mail" value={supervisor.member.email} />
          )}
          {supervisor.member.room && (
            <SupervisorInfo type="room" value={supervisor.member.room} />
          )}
        </div>
      </div>
    </Card>
  );
}
