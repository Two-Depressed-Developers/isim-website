import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

import CustomLink from "@/components/CustomLink";
import { StrapiImage } from "@/components/StrapiImage";
import { Button } from "@/components/ui/button";
import type { MemberData } from "@/types";
import { useTranslations } from "next-intl";

type Props = {
  member: MemberData;
};

const MemberMainInfoCard = ({ member }: Props) => {
  const t = useTranslations("MemberDetails");

  const links = {
    PortfolioLink: {
      label: t("homepage"),
    } as const,
    USOSLink: {
      label: t("USOS"),
    } as const,
    BADAPLink: {
      label: t("BADAP"),
    } as const,
    SKOSLink: {
      label: t("SKOS"),
    } as const,
  } as const;

  return (
    <div className="mx-auto flex h-fit w-full max-w-[320px] flex-col space-y-4 md:mx-0">
      {member.photo?.url && (
        <div className="relative aspect-3/4 w-full overflow-hidden bg-slate-100">
          <StrapiImage
            imageLink={member.photo?.url}
            alt={member.photo?.alternativeText || t("memberPhotoAlt")}
            className="object-cover"
            fill
          />
        </div>
      )}
      <div className="space-y-3 border-t border-slate-200 pt-4">
        <div className="flex items-center gap-3 text-sm">
          <MapPin size="16" className="shrink-0 text-slate-400" />
          <span className="text-slate-600">{member.room}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Phone size="16" className="shrink-0 text-slate-400" />
          <a
            href={`tel:${member.phone}`}
            className="hover:text-primary text-slate-600"
          >
            {member.phone}
          </a>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Mail size="16" className="shrink-0 text-slate-400" />
          <a
            href={`mailto:${member.email}`}
            className="hover:text-primary text-slate-600"
          >
            {member.email}
          </a>
        </div>
      </div>
      <div className="border-t border-slate-200 pt-4">
        <div className="flex flex-col gap-y-2">
          {Object.entries(links).map(([key, value], index) => {
            const link = member[key as keyof typeof links];
            const label = link?.label ?? value.label;

            return link ? (
              <Button
                asChild
                variant="outline"
                key={index}
                className="border-primary text-primary hover:text-primary flex items-center gap-2"
              >
                <CustomLink
                  className="relative"
                  href={link.URL}
                  isExternal={link.isExternal}
                >
                  {label}
                  <ArrowUpRight
                    size="16"
                    className="absolute top-1/2 right-2 -translate-y-1/2"
                  />
                </CustomLink>
              </Button>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};

export default MemberMainInfoCard;
