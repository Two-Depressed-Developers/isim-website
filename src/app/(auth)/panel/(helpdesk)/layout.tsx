import { requireHelpdeskMember } from "@/lib/auth.utils";

export default async function Helpdeskayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireHelpdeskMember();

  return <>{children}</>;
}
