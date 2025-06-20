"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

interface DynamicFormProps {
  schema: FormSchema;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  isLoading?: boolean;
}

const SKIPPED_FIELDS = new Set(["sections", "slug"]);

const shouldShowField = (field: VisibleFormField): boolean => {
  return !SKIPPED_FIELDS.has(field.name);
};

export default function DynamicForm({
  schema,
  onSubmit,
  initialData,
  isLoading = false,
}: DynamicFormProps) {
  const visibleFields = schema.fields
    .filter(isVisibleField)
    .filter(shouldShowField);

  const zodSchema = generateZodSchema(visibleFields);

  const form = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: initialData || {},
  });

  const categorizedFields = groupFieldsByCategory(visibleFields);
  const sortedCategories = getSortedCategories(categorizedFields);

  return (
    <div className="mx-auto w-full max-w-4xl px-4">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-600">
          Update your professional information and contact details
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {sortedCategories.map((categoryKey) => (
            <CategorySection
              key={categoryKey}
              categoryKey={categoryKey}
              fields={categorizedFields[categoryKey]}
              control={form.control}
            />
          ))}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
