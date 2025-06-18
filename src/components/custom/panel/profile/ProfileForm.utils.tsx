import { FormFieldType } from "./ProfileForm.types";

export const mapStrapiFieldToFormField = (
  fieldName: string,
  fieldSchema: any,
): FormFieldType => {
  const baseField = {
    name: fieldName,
    label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
  };

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
        options: fieldSchema.enum.map((value: string) => ({
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
        accept: "image/*",
        shown: true,
      };

    case "component":
      return {
        ...baseField,
        type: "component",
        component: "ComponentField",
        componentType: fieldSchema.component,
        repeatable: fieldSchema.repeatable || false,
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
