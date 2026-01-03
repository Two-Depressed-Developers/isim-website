"use client";

import { useMemberData, useMemberSchema } from "@/data/queries/use-members";
import Profile from "./Profile/Profile";
import { Session } from "next-auth";

type Props = {
  slug: string;
  session: Session;
};

export default function ProfilePageClient({ slug, session }: Props) {
  const {
    data: member,
    isPending: isMemberPending,
    isError: isMemberError,
  } = useMemberData(slug);
  const {
    data: memberSchema,
    isPending: isSchemaPending,
    isError: isSchemaError,
  } = useMemberSchema();

  if (isMemberPending || isSchemaPending) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="text-muted-foreground">Ładowanie profilu...</p>
        </div>
      </div>
    );
  }

  if (isMemberError || isSchemaError) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="mb-4 text-2xl font-bold">Nie znaleziono profilu</h1>
        <p className="text-muted-foreground">
          Nie udało się załadować danych profilu dla tego użytkownika.
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
