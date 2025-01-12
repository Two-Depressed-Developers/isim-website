import { getMemberData } from "@/data/loaders";
import Member from "@/components/Member";

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

  return <Member member={member} />;
}
