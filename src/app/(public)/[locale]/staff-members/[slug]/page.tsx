import { BreadcrumbTitleSetter } from "@/components/custom/breadcrumb/BreadcrumbTitleSetter";
import StaffConsultations from "@/components/custom/staff/StaffConsultations";
import MemberMainInfoCard from "@/components/custom/member/MemberMainInfoCard";
import StaffPublications from "@/components/custom/staff/StaffPublications";
import MemberSections from "@/components/custom/member/MemberSections";
import { getMemberData } from "@/data/api/members";
import { getDataProposals } from "@/data/api/data-proposals";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageTitle from "@/components/PageTitle";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    <div className="w-screen">
      <div className="mx-auto max-w-7xl p-8">
        <Link
          href="/staff"
          className="hover:text-primary mb-8 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors"
        >
          <ArrowLeft size="16" />
          {t("backToDirectory")}
        </Link>
        <BreadcrumbTitleSetter title={member.fullName} />
        <PageTitle
          title={member.fullName}
          description={member.title}
          label={member.position}
        />
        <div className="flex flex-col gap-8 pb-8 md:flex-row">
          <div className="w-full shrink-0 md:w-[320px]">
            <MemberMainInfoCard member={member} />
          </div>

          <div className="flex w-full min-w-0 flex-1 flex-col gap-y-4">
            <StaffConsultations member={member} slug={slug} />
            <StaffPublications dataProposals={dataProposals} />
            <MemberSections memberSections={member.sections} />
          </div>
        </div>
      </div>
    </div>
  );
}
