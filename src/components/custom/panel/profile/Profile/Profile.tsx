"use client";

import { useMemo, useState } from "react";
import { useUpdateMember } from "@/data/queries/use-members";
import { MemberData } from "@/lib/types";
import { Session } from "next-auth";
import { toast } from "sonner";
import { uploadFile } from "@/data/api/base";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/data/query-keys";
import axios from "axios";

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
  const queryClient = useQueryClient();

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

  const handleUpdateFromSkos = async (fullName: string) => {

    if (!fullName) return;

    try {
      const parts = fullName.trim().split(" ");
      const first_name = parts[0];
      const last_name = parts.slice(1).join(" ");

      if (!first_name || !last_name) {
        toast.error("Proszę podać pełne imię i nazwisko.");
        return;
      }

      await axios.post("/api/update-member-profile", {
        first_name,
        last_name,
        member_document_id: member.documentId,
      });

      toast.success("Zgłoszenie aktualizacji wysłane. Odświeżanie danych...");

      setTimeout(async () => {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.members.bySlug(member.slug),
        });
        toast.success("Dane odświeżone.");
      }, 5000);
    } catch (error) {
      console.error("Error updating from skos:", error);
      toast.error("Wystąpił błąd podczas aktualizacji danych ze Skos.");
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
      onUpdateFromSkos={handleUpdateFromSkos}
    />
  );
}
