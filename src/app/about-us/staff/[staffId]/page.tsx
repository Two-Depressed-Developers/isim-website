import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Separator } from "@/components/ui/separator";
import WhiteCard from "@/components/custom/WhiteCard";
import { Button } from "@/components/ui/button";
import CustomLink from "@/components/CustomLink";
import MemberMainInfoCard from "@/components/custom/member/MemberMainInfoCard";

import { getMemberData } from "@/data/loaders";

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

  const researchLinks = member.Research
    ? [
        {
          data: member.Research.PublicationsLink,
          altText: "Publications",
        },
        {
          data: member.Research.ORCIDLink,
          altText: "ORCID",
        },
        {
          data: member.Research.ResearchgateLink,
          altText: "Researchgate",
        },
        {
          data: member.Research.ReasercherIdLink,
          altText: "Researcher ID",
        },
      ]
    : null;

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 p-4 md:flex-row md:p-16">
      <div className="p-4 md:hidden">
        <h2 className="text-2xl font-medium">{member.title}</h2>
        <h1 className="text-4xl font-bold">{`${member.firstName} ${member.lastName}`}</h1>
      </div>

      <MemberMainInfoCard member={member} />

      <div className="flex flex-grow flex-col gap-y-4">
        <div className="hidden p-4 md:block">
          <h2 className="text-2xl font-medium">{member.title}</h2>
          <h1 className="text-4xl font-bold">{`${member.firstName} ${member.lastName}`}</h1>
        </div>

        {member.Research && (
          <WhiteCard className="flex flex-col gap-y-4">
            <h2 className="text-3xl font-bold">Research</h2>
            <Separator />
            <div className="grid grid-cols-2 gap-2">
              {researchLinks &&
                researchLinks.map((researchLink, index) => (
                  <Button
                    asChild
                    key={index}
                    className="flex items-center gap-2 bg-[#E9E9E9] text-black shadow-sm hover:bg-[#D1D1D1] hover:opacity-90"
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
