"use client";

import { useMemo } from "react";
import { useUpdateMember } from "@/data/queries";
import { MemberData } from "@/lib/types";
import { Session } from "next-auth";
import { toast } from "sonner";

import DynamicForm from "../DynamicForm/DynamicForm";
import { FormSchema } from "../DynamicForm/DynamicForm.types";
import { mapStrapiFieldToFormField } from "../DynamicForm/DynamicForm.utils";
import {
  extractDefaultValues,
  prepareDataForSubmission,
} from "./Profile.utils";

type ProfileFormProps = {
  member: MemberData;
  schema: Record<string, unknown>;
  session: Session;
};

export default function Profile({ member, schema, session }: ProfileFormProps) {
  const updateMutation = useUpdateMember(member.slug);

  const onSubmit = async (data: Record<string, unknown>) => {
    if (!session?.accessToken) {
      toast.error("You must be authenticated to update your profile.");
      return;
    }

    const cleanedData = prepareDataForSubmission(data, member);

    try {
      await updateMutation.mutateAsync({
        documentId: member.documentId,
        data: cleanedData as Partial<MemberData>,
        accessToken: session.accessToken as string,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile.";
      toast.error(errorMessage);
      console.error("Error updating profile:", error);
    }
  };

  const transformedSchema: FormSchema = useMemo(
    () => ({
      fields: Object.entries(schema).map(([fieldName, fieldSchema]) =>
        mapStrapiFieldToFormField(fieldName, fieldSchema),
      ),
    }),
    [schema],
  );

  const transformedDefaultValues = useMemo(
    () => extractDefaultValues(transformedSchema.fields, member),
    [transformedSchema.fields, member],
  );

  return (
    <DynamicForm
      schema={transformedSchema}
      onSubmit={onSubmit}
      initialData={transformedDefaultValues}
      isLoading={updateMutation.isPending}
    />
  );
}
