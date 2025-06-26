import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VisibleFormField } from "./DynamicForm.types";

export const getInputType = (field: VisibleFormField): string => {
  const typeMap: Record<string, string> = {
    email: "email",
    tel: "tel",
    url: "url",
    number: "number",
  };

  if (field.name === "phone") return "tel";
  if (field.name.toLowerCase().includes("link") || field.type === "url")
    return "url";

  return typeMap[field.type] || "text";
};

export const FieldComponents = {
  Input: ({
    field,
    formField,
  }: {
    field: VisibleFormField;
    formField: any;
  }) => (
    <Input
      {...formField}
      type={getInputType(field)}
      placeholder={`Enter ${field.label.toLowerCase()}`}
    />
  ),

  Select: ({
    field,
    formField,
  }: {
    field: VisibleFormField;
    formField: any;
  }) => (
    <Select onValueChange={formField.onChange} defaultValue={formField.value}>
      <SelectTrigger className="!h-10 w-full">
        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {field.options?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),

  FileUpload: ({
    field,
    formField,
  }: {
    field: VisibleFormField;
    formField: any;
  }) => (
    <div className="flex items-end gap-2">
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-200">
        {formField.value ? (
          <img
            src={formField.value}
            alt="Profile photo"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-end">
        <Button
          type="button"
          className="border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          📤 Upload Photo
        </Button>
        <p className="mt-1 text-xs text-gray-500">JPG, PNG up to 5MB</p>
      </div>
    </div>
  ),

  ComponentField: ({ field }: { field: VisibleFormField; formField: any }) => (
    <div className="text-muted-foreground">
      {field.label} component (coming soon...)
    </div>
  ),

  DynamicZone: ({ field }: { field: VisibleFormField; formField: any }) => (
    <div className="text-muted-foreground">
      {field.label} dynamic zone (coming soon...)
    </div>
  ),
};
