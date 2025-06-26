"use client";

import { memberFormSchema } from "@/lib/schemas";
import { MemberData } from "@/lib/types";
import type * as z from "zod";

import { Session } from "next-auth";
import DynamicForm from "../DynamicForm/DynamicForm";
import { FormSchema, isVisibleField } from "../DynamicForm/DynamicForm.types";
import { mapStrapiFieldToFormField } from "../DynamicForm/DynamicForm.utils";

type ProfileFormProps = {
  member: MemberData;
  schema: Record<string, unknown>;
  session?: Session;
};

export default function Profile({ member, schema, session }: ProfileFormProps) {
  const onSubmit = async (data: z.infer<typeof memberFormSchema>) => {};
  //   console.log("Form submitted with data:", data);

  //   const res = await axios.put(
  //     `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/members/${member.documentId}`,
  //     {
  //       data: {
  //         ...data,
  //       },
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${session?.accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );

  //   if (res.status === 200) {
  //     console.log("Profile updated successfully:", res.data.data.phone);
  //     alert("Profil został zaktualizowany pomyślnie!");
  //     form.reset(res.data.data);
  //   } else {
  //     alert("Wystąpił błąd podczas aktualizacji profilu. Spróbuj ponownie.");
  //     console.error("Error updating profile:", res.data);
  //   }

  //   console.log("Response from server:", res.data);
  // };

  const transformedSchema: FormSchema = {
    fields: Object.entries(schema).map(([fieldName, fieldSchema]) =>
      mapStrapiFieldToFormField(fieldName, fieldSchema),
    ),
  };

  console.log(member);

  const transformedDefaultValues = transformedSchema.fields
    .filter(isVisibleField)
    .reduce(
      (acc, field) => {
        const fieldName = field.name;

        if (
          fieldName.endsWith("Link") &&
          member[fieldName as keyof MemberData]
        ) {
          const linkData = member[fieldName as keyof MemberData] as any;
          acc[fieldName] = linkData?.URL || "";
        } else if (fieldName === "photo" && member.photo) {
          const photoUrl =
            member.photo.url.startsWith("http") ||
            member.photo.url.startsWith("https")
              ? member.photo.url
              : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${member.photo.url}`;
          acc[fieldName] = photoUrl;
        } else if (
          member[fieldName as keyof MemberData] &&
          !fieldName.endsWith("Link")
        ) {
          acc[fieldName] = member[fieldName as keyof MemberData];
        } else {
          acc[fieldName] = "";
        }

        return acc;
      },
      {} as Record<string, any>,
    );

  return (
    <DynamicForm
      schema={transformedSchema}
      onSubmit={onSubmit}
      initialData={transformedDefaultValues}
    />
  );
}
