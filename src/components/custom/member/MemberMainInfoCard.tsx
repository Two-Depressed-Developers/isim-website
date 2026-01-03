import { Earth } from "lucide-react";

import WhiteCard from "../WhiteCard";
import MemberInfoLink from "../MemberInfoLink";
import { StrapiImage } from "@/components/StrapiImage";
import { Button } from "@/components/ui/button";
import CustomLink from "@/components/CustomLink";

import { cn } from "@/lib/utils";
import type { MemberData } from "@/types/strapi";

interface MemberMainInfoCardProps {
  member: MemberData;
  className?: string;
}

const MemberMainInfoCard = ({ member, className }: MemberMainInfoCardProps) => {
  const buttonLinks = [
    {
      data: member.PortfolioLink,
      altText: "Homepage",
      bgColor: "bg-[#0493dc]",
    },
    {
      data: member.USOSLink,
      altText: "USOS",
      bgColor: "bg-linear-to-r from-[#383556] to-[#444160]",
    },
    {
      data: member.BADAPLink,
      altText: "BADAP",
      bgColor: "bg-black",
    },
    {
      data: member.SKOSLink,
      altText: "SKOS",
      bgColor: "bg-[#00693c]",
    },
  ];

  return (
    <WhiteCard className={cn("flex h-fit flex-col gap-y-6", className)}>
      {member.photo?.url && (
        <StrapiImage
          src={member.photo?.url}
          alt={member.photo?.alternativeText || "Member photo"}
          className="mx-auto h-64 w-64 rounded-md object-cover shadow-md"
          height={256}
          width={256}
        />
      )}
      <div className="flex flex-col gap-y-4">
        <h3 className="text-2xl font-bold">Contact</h3>
        <div className="flex flex-col gap-y-2">
          {member.email && <MemberInfoLink type="Email" value={member.email} />}
          {member.phone && <MemberInfoLink type="Phone" value={member.phone} />}
          {member.room && <MemberInfoLink type="Room" value={member.room} />}
        </div>
        <div className="flex flex-col gap-y-2">
          {buttonLinks &&
            buttonLinks.map((buttonLink, index) =>
              buttonLink.data ? (
                <Button
                  asChild
                  key={index}
                  className={`flex items-center gap-2 ${buttonLink.bgColor} text-white shadow-xs hover:opacity-90`}
                >
                  <CustomLink
                    href={buttonLink.data.URL}
                    isExternal={buttonLink.data.isExternal}
                  >
                    <Earth className="h-2 w-2" />
                    {buttonLink.data.label ?? buttonLink.altText}
                  </CustomLink>
                </Button>
              ) : null,
            )}
        </div>
      </div>
    </WhiteCard>
  );
};

export default MemberMainInfoCard;
