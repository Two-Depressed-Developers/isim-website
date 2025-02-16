import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Separator } from "@/components/ui/separator";
import WhiteCard from "@/components/custom/WhiteCard";
import { Button } from "@/components/ui/button";
import CustomLink from "@/components/CustomLink";
import MemberMainInfoCard from "@/components/custom/member/MemberMainInfoCard";

import { getMemberData } from "@/data/loaders";
import MemberSections from "@/components/custom/member/MemberSections";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const member = await getMemberData(slug);

  if (member.error) {
    return <div>Member not found</div>;
  }

  console.log(member);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4 md:flex-row md:p-8">
      <div className="p-4 md:hidden">
        <h2 className="text-2xl font-medium">{member.title}</h2>
        <h1 className="text-4xl font-bold">{`${member.fullName}`}</h1>
      </div>

      <MemberMainInfoCard member={member} />

      <div className="flex flex-grow flex-col gap-y-4">
        <div className="hidden p-4 md:block">
          <h2 className="text-2xl font-medium">{member.title}</h2>
          <h1 className="text-4xl font-bold">{`${member.fullName}`}</h1>
        </div>

        <MemberSections memberSections={member.sections} />
      </div>
    </div>
  );
}
