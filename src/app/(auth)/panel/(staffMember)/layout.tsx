import { requireStaffMember } from "@/lib/auth.utils";

export default async function StaffMemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStaffMember();

  return <>{children}</>;
}
