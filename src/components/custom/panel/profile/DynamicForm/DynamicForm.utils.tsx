import { z } from "zod";
import { FormFieldType } from "./DynamicForm.types";

export const generateZodSchema = (fields: FormFieldType[]) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    if (!field.shown) {
      return;
    }

    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case "email":
        fieldSchema = z.string().email("Invalid email address");
        break;

      case "select":
      case "enumeration":
        const enumValues = field.options?.map((opt) => opt.value) || [];
        if (enumValues.length > 0) {
          fieldSchema = z.enum(enumValues as [string, ...string[]]);
        } else {
          fieldSchema = z.string();
        }
        break;

      case "file":
        fieldSchema = field.multiple ? z.array(z.any()) : z.any().optional();
        break;

      case "component":
      case "dynamiczone":
        fieldSchema = z.any().optional();
        break;

      default:
        fieldSchema = z.string();
    }

    if (field.validation?.pattern && fieldSchema instanceof z.ZodString) {
      fieldSchema = fieldSchema.regex(
        new RegExp(field.validation.pattern),
        "Invalid format",
      );
    }

    if (!field.validation?.required && fieldSchema instanceof z.ZodString) {
      fieldSchema = fieldSchema.optional();
    }

    schemaObject[field.name] = fieldSchema;
  });

  return z.object(schemaObject);
};

const FIELD_LABEL_MAP: Record<string, string> = {
  phone: "Phone Number",
  email: "Email Address",
  position: "Position",
  title: "Academic Title",
  photo: "Profile Photo",
};

const generateLabel = (fieldName: string): string => {
  if (FIELD_LABEL_MAP[fieldName]) {
    return FIELD_LABEL_MAP[fieldName];
  }

  if (fieldName.endsWith("Link")) {
    const baseName = fieldName.replace("Link", "");
    return baseName;
  }

  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export type StrapiFieldSchema = {
  type?: string;
  enum?: string[];
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  multiple?: boolean;
  allowedTypes?: string[];
  component?: string;
  repeatable?: boolean;
  components?: string[];
};

export const mapStrapiFieldToFormField = (
  fieldName: string,
  fieldSchema: StrapiFieldSchema,
): FormFieldType => {
  const baseField = {
    name: fieldName,
    label: generateLabel(fieldName),
  };

  if (fieldName.endsWith("Link")) {
    return {
      ...baseField,
      type: "url",
      component: "Input",
      shown: true,
    };
  }

  switch (fieldSchema.type) {
    case "string":
      return {
        ...baseField,
        type: "text",
        component: "Input",
        shown: true,
      };

    case "email":
      return {
        ...baseField,
        type: "email",
        component: "Input",
        shown: true,
      };

    case "enumeration":
      return {
        ...baseField,
        type: "select",
        component: "Select",
        options: (fieldSchema.enum ?? []).map((value: string) => ({
          label: value.replace(/([A-Z])/g, " $1").trim(),
          value,
        })),
        shown: true,
      };

    case "uid":
      return {
        shown: false,
      };

    case "media":
      return {
        ...baseField,
        type: "file",
        component: "FileUpload",
        multiple: fieldSchema.multiple || false,
        accept: fieldSchema.allowedTypes?.includes("images")
          ? "image/*"
          : "*/*",
        shown: true,
      };

    case "component":
      if (!fieldName.endsWith("Link")) {
        return {
          ...baseField,
          type: "component",
          component: "ComponentField",
          componentType: fieldSchema.component,
          repeatable: fieldSchema.repeatable || false,
          shown: true,
        };
      }

      return {
        ...baseField,
        type: "url",
        component: "Input",
        shown: true,
      };

    case "dynamiczone":
      return {
        ...baseField,
        type: "dynamiczone",
        component: "DynamicZone",
        components: fieldSchema.components || [],
        shown: true,
      };

    default:
      return {
        ...baseField,
        type: "text",
        component: "Input",
        shown: true,
      };
  }
};
