import MemberMainInfoCard from "@/components/custom/member/MemberMainInfoCard";
import MemberConsultations from "@/components/custom/member/MemberConsultations";

import { getMemberData } from "@/data/loaders";
import MemberSections from "@/components/custom/member/MemberSections";
import { BreadcrumbTitleSetter } from "@/components/custom/breadcrumb/BreadcrumbTitleSetter";

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

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 md:flex-row md:p-8">
      <BreadcrumbTitleSetter title={member.fullName} />

      <div className="p-4 md:hidden">
        <h2 className="text-2xl font-medium">{member.title}</h2>
        <h1 className="text-4xl font-bold">{`${member.fullName}`}</h1>
      </div>

      <MemberMainInfoCard member={member} />

      <div className="flex grow flex-col gap-y-4">
        <div className="hidden p-4 md:block">
          <h2 className="text-2xl font-medium">{member.title}</h2>
          <h1 className="text-4xl font-bold">{`${member.fullName}`}</h1>
        </div>

        <MemberConsultations member={member} slug={slug} />

        <MemberSections memberSections={member.sections} />
      </div>
    </div>
  );
}
