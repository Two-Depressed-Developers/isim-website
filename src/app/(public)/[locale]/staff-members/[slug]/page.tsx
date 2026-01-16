import { BreadcrumbTitleSetter } from "@/components/custom/breadcrumb/BreadcrumbTitleSetter";
import MemberConsultations from "@/components/custom/member/MemberConsultations";
import MemberMainInfoCard from "@/components/custom/member/MemberMainInfoCard";
import MemberPublications from "@/components/custom/member/MemberPublications";
import MemberSections from "@/components/custom/member/MemberSections";
import { getMemberData } from "@/data/api/members";
import { getDataProposals } from "@/data/api/data-proposals";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const member = await getMemberData(slug);
  
  if (member.error) {
    const t = await getTranslations({ locale, namespace: "Staff" });
    return {
      title: t("memberNotFound"),
    };
  }

  return {
    title: member.fullName,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Staff");
  const member = await getMemberData(slug);
  const dataProposals = await getDataProposals(member.documentId);

  if (member.error) {
    return <div>{t("memberNotFound")}</div>;
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

        <MemberPublications dataProposals={dataProposals} />

        <MemberSections memberSections={member.sections} />
      </div>
    </div>
  );
}
