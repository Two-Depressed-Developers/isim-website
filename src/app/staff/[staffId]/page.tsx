import { getMemberData } from "@/data/loaders";
import Member from "@/components/Member";
import { StrapiImage } from "@/components/StrapiImage";
import { Separator } from "@/components/ui/separator";
import WhiteCard from "@/components/custom/WhiteCard";
import MemberInfoLink, { InfoLinkTypes } from "@/components/custom/MemberInfoLink";
import { Button } from "@/components/ui/button";
import { Earth, Mail } from "lucide-react";
import CustomLink from "@/components/CustomLink";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function Page({
  params,
}: {
  params: Promise<{ staffId: string }>;
}) {
  const staffId = (await params).staffId;
  const member = await getMemberData(staffId);

  if (member.error) {
    return <div>Member not found</div>;
  }

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

  const researchLinks = member.Research ? [
    {
      data: member.Research.PublicationsLink,
      altText: "Publications"
    },
    {
      data: member.Research.ORCIDLink,
      altText: "ORCID"
    },
    {
      data: member.Research.ResearchgateLink,
      altText: "Researchgate"
    },
    {
      data: member.Research.ReasercherIdLink,
      altText: "Researcher ID"
    }
  ] : null;

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-row p-16 gap-x-6">
      <WhiteCard className="flex flex-col gap-y-6 h-fit">
        <StrapiImage
          src={member.photo.url}
          alt={member.photo.alternativeText || "Member photo"}
          className="w-64 h-64 object-cover rounded-md shadow-md"
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
      <div className="flex flex-col gap-y-4 flex-grow">
        <div className="p-4">
          <h2 className="text-2xl font-medium">{member.title}</h2>
          <h1 className="text-4xl font-bold">{`${member.firstName} ${member.lastName}`}</h1>
        </div>

        {member.Research && (
          <WhiteCard className="flex flex-col gap-y-4">
            <h2 className="text-3xl font-bold">Research</h2>
            <Separator />
            <div className="grid grid-cols-2 gap-2">
              {researchLinks && researchLinks.map((researchLink, index) => (
                <Button
                  asChild
                  key={index}
                  className="flex items-center gap-2 text-black bg-[#E9E9E9] hover:opacity-90 hover:bg-[#D1D1D1] shadow-sm"
                >
                  <CustomLink
                    href={researchLink.data.URL}
                    isExternal={researchLink.data.isExternal}
                  >
                    {researchLink.data.text ?? researchLink.altText}
                  </CustomLink>
                </Button>
              ))}
            </div>
          </WhiteCard>
        )}

        {member.forStudents && (
          <WhiteCard className="flex flex-col gap-y-4">
            <h2 className="text-3xl font-bold">For students</h2>
            <Separator />
            <div className="prose w-full max-w-none p-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {member.forStudents}
              </ReactMarkdown>
            </div>
          </WhiteCard>
        )}
      </div>
    </div>
  );
}
