import React from "react";
import type { ControllerRenderProps } from "react-hook-form";
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
import Image from "next/image";
import { env } from "@ryankshaw/next-runtime-env";

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
    formField: ControllerRenderProps;
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
    formField: ControllerRenderProps;
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
    formField,
    onUpload,
  }: {
    field: VisibleFormField;
    formField: ControllerRenderProps;
    onUpload?: (file: File) => Promise<{ id: number; url: string }>;
  }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = React.useState(false);
    const [previewUrl, setPreviewUrl] = React.useState<string>(
      formField.value || "",
    );

    const handleFileChange = async (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file = event.target.files?.[0];
      if (!file || !onUpload) return;

      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
      setIsUploading(true);

      try {
        const uploadedFile = await onUpload(file);
        const fullUrl = uploadedFile.url.startsWith("http")
          ? uploadedFile.url
          : `${env("NEXT_PUBLIC_STRAPI_API_URL")}${uploadedFile.url}`;
        setPreviewUrl(fullUrl);
        formField.onChange(fullUrl);
      } catch (error) {
        setPreviewUrl(formField.value || "");
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
        URL.revokeObjectURL(localPreview);
      }
    };

    return (
      <div className="flex items-end gap-2">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-200">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Profile photo"
              className="h-full w-full object-cover"
              width={80}
              height={80}
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {isUploading ? "⏳ Uploading..." : "📤 Upload Photo"}
          </Button>
          <p className="mt-1 text-xs text-gray-500">JPG, PNG up to 5MB</p>
        </div>
      </div>
    );
  },

  ComponentField: ({
    field,
  }: {
    field: VisibleFormField;
    formField: ControllerRenderProps;
  }) => <div className="text-muted-foreground">{field.label}</div>,

  DynamicZone: ({
    field,
  }: {
    field: VisibleFormField;
    formField: ControllerRenderProps;
  }) => <div className="text-muted-foreground">{field.label}</div>,
};
