"use client";

import { useTranslations } from "next-intl";
import { MemberResearch as ResearchType } from "@/types";
import { Button } from "@/components/ui/button";
import CustomLink from "@/components/CustomLink";
import { StaffDetailsTile } from "../staff/StaffDetailsTile";
import { FlaskConical } from "lucide-react";

type Props = {
  researchData: ResearchType;
};

const MemberResearch = ({ researchData }: Props) => {
  const t = useTranslations("MemberDetails");

  const researchLinks = researchData
    ? [
        {
          data: researchData.PublicationsLink,
          altText: t("publicationsAlt"),
        },
        {
          data: researchData.ORCIDLink,
          altText: t("orcidAlt"),
        },
        {
          data: researchData.ResearchgateLink,
          altText: t("researchgateAlt"),
        },
        {
          data: researchData.ReasercherIdLink,
          altText: t("researcherIdAlt"),
        },
      ]
    : null;

  return (
    <StaffDetailsTile title={t("research")} icon={FlaskConical}>
      <div className="grid grid-cols-2 gap-2 pt-4">
        {researchLinks &&
          researchLinks.map((researchLink, index) => (
            <Button
              asChild
              variant="outline"
              key={index}
              className="border-accent-gray flex items-center gap-2 border text-black shadow-xs hover:opacity-90"
            >
              <CustomLink
                href={researchLink.data?.URL ?? "#"}
                isExternal={researchLink.data?.isExternal ?? false}
              >
                {researchLink.data?.label ?? researchLink.altText}
              </CustomLink>
            </Button>
          ))}
      </div>
    </StaffDetailsTile>
  );
};

export default MemberResearch;
