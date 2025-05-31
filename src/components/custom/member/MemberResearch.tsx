import { MemberResearch as ResearchType } from "@/lib/types";
import WhiteCard from "../WhiteCard";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import CustomLink from "@/components/CustomLink";

interface MemberResearchProps {
  researchData: ResearchType;
}

const MemberResearch = ({ researchData }: MemberResearchProps) => {
  const researchLinks = researchData
    ? [
        {
          data: researchData.PublicationsLink,
          altText: "Publications",
        },
        {
          data: researchData.ORCIDLink,
          altText: "ORCID",
        },
        {
          data: researchData.ResearchgateLink,
          altText: "Researchgate",
        },
        {
          data: researchData.ReasercherIdLink,
          altText: "Researcher ID",
        },
      ]
    : null;

  return (
    <WhiteCard className="flex flex-col gap-y-4">
      <h2 className="text-3xl font-bold">Research</h2>
      <Separator />
      <div className="grid grid-cols-2 gap-2">
        {researchLinks &&
          researchLinks.map((researchLink, index) => (
            <Button
              asChild
              key={index}
              className="flex items-center gap-2 bg-light-gray text-black shadow-sm hover:bg-inactive hover:opacity-90"
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
    </WhiteCard>
  );
};

export default MemberResearch;
