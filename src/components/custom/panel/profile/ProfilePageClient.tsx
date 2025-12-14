"use client";

import { useMemberData, useMemberSchema } from "@/data/queries";
import Profile from "./Profile/Profile";
import { Session } from "next-auth";

type ProfilePageClientProps = {
  slug: string;
  session: Session;
};

export default function ProfilePageClient({
  slug,
  session,
}: ProfilePageClientProps) {
  const {
    data: member,
    isLoading: isMemberLoading,
    error: memberError,
  } = useMemberData(slug);
  const {
    data: memberSchema,
    isLoading: isSchemaLoading,
    error: schemaError,
  } = useMemberSchema();

  if (isMemberLoading || isSchemaLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (memberError || schemaError || member?.error || memberSchema?.error) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="mb-4 text-2xl font-bold">Profile not found</h1>
        <p className="text-muted-foreground">
          Failed to load profile data for this user.
        </p>
      </div>
    );
  }

  if (!member || !memberSchema) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="mb-4 text-2xl font-bold">Profile not found</h1>
        <p className="text-muted-foreground">
          No profile data available for this user.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Profile member={member} schema={memberSchema} session={session} />
    </div>
  );
}
