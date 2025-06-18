"use client";

import { MemberData } from "@/lib/types";
import { memberFormSchema } from "@/lib/schemas";
import type * as z from "zod";
import axios from "axios";

import { Session } from "next-auth";
import DynamicForm from "./DynamicForm";

type ProfileFormProps = {
  member: MemberData;
  schema: Record<string, unknown>;
  session?: Session;
};

export default function ProfileForm({
  member,
  schema,
  session,
}: ProfileFormProps) {
  const onSubmit = async (data: z.infer<typeof memberFormSchema>) => {
    console.log("Form submitted with data:", data);

    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/members/${member.documentId}`,
      {
        data: {
          ...data,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 200) {
      console.log("Profile updated successfully:", res.data.data.phone);
      alert("Profil został zaktualizowany pomyślnie!");
      form.reset(res.data.data);
    } else {
      alert("Wystąpił błąd podczas aktualizacji profilu. Spróbuj ponownie.");
      console.error("Error updating profile:", res.data);
    }

    console.log("Response from server:", res.data);
  };

  return <DynamicForm schema={schema} onSubmit={onSubmit} />;
}
