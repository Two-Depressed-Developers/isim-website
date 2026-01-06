"use client";

import { QueryWrapper } from "@/components/QueryWrapper";
import { useMemberData, useMemberSchema } from "@/data/queries/use-members";
import { Session } from "next-auth";
import Profile from "./Profile/Profile";
import { Loader2 } from "lucide-react";

type Props = {
  slug: string;
  session: Session;
};

function ProfilePageContent({ slug, session }: Props) {
  const { data: member } = useMemberData(slug);
  const { data: memberSchema } = useMemberSchema();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Profile member={member} schema={memberSchema} session={session} />
    </div>
  );
}

export default function ProfilePageClient({ slug, session }: Props) {
  return (
    <QueryWrapper
      loadingFallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ProfilePageContent slug={slug} session={session} />
    </QueryWrapper>
  );
}
