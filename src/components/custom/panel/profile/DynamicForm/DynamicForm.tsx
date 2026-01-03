"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CategorySection from "./CategorySection";
import {
  getSortedCategories,
  groupFieldsByCategory,
} from "./DynamicForm.config";
import {
  FormSchema,
  isVisibleField,
  VisibleFormField,
} from "./DynamicForm.types";
import { generateZodSchema } from "./DynamicForm.utils";
import type { FieldValues } from "react-hook-form";

type DynamicFormProps = {
  schema: FormSchema;
  onSubmit: (data: FieldValues) => Promise<void>;
  initialData?: FieldValues;
  isLoading?: boolean;
  onPhotoUpload?: (file: File) => Promise<{ id: number; url: string }>;
  onUpdateFromSkos?: (fullName: string) => Promise<void>;
};

const SKIPPED_FIELDS = new Set([
  "sections",
  "slug",
  "consultationAvailability",
]);

const shouldShowField = (field: VisibleFormField): boolean => {
  return !SKIPPED_FIELDS.has(field.name);
};

export default function DynamicForm({
  schema,
  onSubmit,
  initialData,
  isLoading = false,
  onPhotoUpload,
  onUpdateFromSkos,
}: DynamicFormProps) {
  const visibleFields = schema.fields
    .filter(isVisibleField)
    .filter(shouldShowField);

  const zodSchema = generateZodSchema(visibleFields);

  const form = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  const fullName = useWatch({
    control: form.control,
    name: "fullName",
  });

  const categorizedFields = groupFieldsByCategory(visibleFields);
  const sortedCategories = getSortedCategories(categorizedFields);

  const isDirty = form.formState.isDirty;

  return (
    <div className="mx-auto w-full max-w-4xl px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Edycja Profilu
          </h1>
          <p className="text-gray-600">
            Zaktualizuj swoje dane zawodowe i kontaktowe
          </p>
        </div>
        {onUpdateFromSkos && (
          <Button
            type="button"
            variant="outline"
            onClick={() => onUpdateFromSkos(fullName)}
            disabled={!fullName || isLoading}
          >
            Uzupełnij dane ze Skos
          </Button>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {sortedCategories.map((categoryKey) => (
            <CategorySection
              key={categoryKey}
              categoryKey={categoryKey}
              fields={categorizedFields[categoryKey]}
              control={form.control}
              onPhotoUpload={onPhotoUpload}
            />
          ))}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isLoading || !isDirty}
            >
              Resetuj
            </Button>
            <Button type="submit" disabled={isLoading || !isDirty}>
              {isLoading ? "Zapisywanie..." : "Zapisz"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
