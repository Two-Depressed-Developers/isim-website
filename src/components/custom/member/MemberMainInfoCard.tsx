import { Member } from "@/lib/types";
import WhiteCard from "../WhiteCard";
import { StrapiImage } from "@/components/StrapiImage";
import MemberInfoLink, { InfoLinkTypes } from "../MemberInfoLink";
import { Button } from "@/components/ui/button";
import CustomLink from "@/components/CustomLink";
import { Earth } from "lucide-react";

interface MemberMainInfoCardProps {
  member: Member;
  className?: string;
}

const MemberMainInfoCard = ({member, className} : MemberMainInfoCardProps) => {

  const buttonLinks = [
    {
      data: member.PortfolioLink,
      altText: "Homepage",
      bgColor: "bg-[#0493dc]", 
    },
    {
      data: member.USOSLink,
      altText: "USOS",
      bgColor: "bg-gradient-to-r from-[#383556] to-[#444160]",
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
    <WhiteCard className={`flex flex-col gap-y-6 h-fit ${className}`}>
        <StrapiImage
          src={member.photo.url}
          alt={member.photo.alternativeText || "Member photo"}
          className="w-64 h-64 object-cover rounded-md shadow-md mx-auto"
          height={256}
          width={256}
        />
        <div className="flex flex-col gap-y-4">
          <h3 className="text-2xl font-bold">Contact</h3>
          <div className="flex flex-col gap-y-2">
            <MemberInfoLink type={InfoLinkTypes.Email} value={member.email} />
            <MemberInfoLink type={InfoLinkTypes.Phone} value={member.phone} />
            <MemberInfoLink type={InfoLinkTypes.Room} value={member.room} />
          </div>
          <div className="flex flex-col gap-y-2">
            {buttonLinks &&
              buttonLinks.map((buttonLink, index) =>
                buttonLink.data ? (
                  <Button
                    asChild
                    key={index}
                    className={`flex items-center gap-2 ${buttonLink.bgColor} text-white hover:opacity-90 shadow-sm`}
                  >
                    <CustomLink
                      href={buttonLink.data.URL}
                      isExternal={buttonLink.data.isExternal}
                    >
                      <Earth className="h-2 w-2" />
                      {buttonLink.data.text ?? buttonLink.altText}
                    </CustomLink>
                  </Button>
                ) : null
              )}
          </div>
        </div>
      </WhiteCard>
  )

}

export default MemberMainInfoCard;