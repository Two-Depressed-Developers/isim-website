"use client";

import { useMemo, useState } from "react";
import { useUpdateMember } from "@/data/queries/use-members";
import { MemberData } from "@/lib/types";
import { Session } from "next-auth";
import { toast } from "sonner";
import { uploadFile } from "@/data/api/base";

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
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const onSubmit = async (data: Record<string, unknown>) => {
    if (!session?.accessToken) {
      toast.error("You must be authenticated to update your profile.");
      return;
    }

    const { photo, ...dataWithoutPhoto } = data;

    const cleanedData = prepareDataForSubmission(dataWithoutPhoto, member);

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

  const handlePhotoUpload = async (
    file: File,
  ): Promise<{ id: number; url: string }> => {
    if (!session?.accessToken) {
      toast.error("You must be authenticated to upload files.");
      throw new Error("Not authenticated");
    }

    setIsUploadingPhoto(true);
    try {
      const uploadedFile = await uploadFile(file, session.accessToken, {
        ref: "api::member.member",
        refId: String(member.id),
        field: "photo",
      });
      toast.success("Photo uploaded and linked successfully!");
      return uploadedFile;
    } catch (error) {
      toast.error("Failed to upload photo.");
      throw error;
    } finally {
      setIsUploadingPhoto(false);
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
      isLoading={updateMutation.isPending || isUploadingPhoto}
      onPhotoUpload={handlePhotoUpload}
    />
  );
}
