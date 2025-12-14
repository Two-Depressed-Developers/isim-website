import { MemberData } from "@/lib/types";
import { FormSchema, isVisibleField } from "../DynamicForm/DynamicForm.types";

const EXCLUDED_FIELDS = new Set([
  "id",
  "documentId",
  "slug",
  "sections",
  "photo",
  "createdAt",
  "updatedAt",
  "publishedAt",
]);

const extractLabelFromFieldName = (fieldName: string): string => {
  return fieldName.replace("Link", "");
};

const transformLinkField = (
  fieldName: string,
  value: string,
  member: MemberData,
) => {
  const originalLinkData = member[fieldName as keyof MemberData] as {
    id?: number;
    URL?: string;
    label?: string;
    isExternal?: boolean;
    openInNewWindow?: boolean;
  } | null;

  if (!value) {
    return null;
  }

  return {
    id: originalLinkData?.id,
    URL: value,
    label: originalLinkData?.label || extractLabelFromFieldName(fieldName),
    isExternal: originalLinkData?.isExternal ?? false,
    openInNewWindow: originalLinkData?.openInNewWindow ?? false,
  };
};

export const prepareDataForSubmission = (
  data: Record<string, unknown>,
  member: MemberData,
): Record<string, unknown> => {
  return Object.entries(data).reduce(
    (acc, [key, value]) => {
      if (EXCLUDED_FIELDS.has(key)) {
        return acc;
      }

      if (key.endsWith("Link") && typeof value === "string") {
        acc[key] = transformLinkField(key, value, member);
      } else {
        acc[key] = value;
      }

      return acc;
    },
    {} as Record<string, unknown>,
  );
};

export const extractDefaultValues = (
  fields: FormSchema["fields"],
  member: MemberData,
): Record<string, unknown> => {
  return fields.filter(isVisibleField).reduce(
    (acc, field) => {
      const fieldName = field.name;
      const memberValue = member[fieldName as keyof MemberData];

      if (fieldName.endsWith("Link") && memberValue) {
        const linkData = memberValue as { URL?: string };
        acc[fieldName] = linkData?.URL || "";
      } else if (fieldName === "photo" && member.photo) {
        const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "";
        const photoUrl =
          member.photo.url.startsWith("http") ||
          member.photo.url.startsWith("https")
            ? member.photo.url
            : `${baseUrl}${member.photo.url}`;
        acc[fieldName] = photoUrl;
      } else if (memberValue && !fieldName.endsWith("Link")) {
        acc[fieldName] = memberValue;
      } else {
        acc[fieldName] = "";
      }

      return acc;
    },
    {} as Record<string, unknown>,
  );
};
