"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { FormFieldType, FormSchema } from "./ProfileForm.types";
import { Input } from "@/components/ui/input";

interface DynamicFormProps {
  schema: FormSchema;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  isLoading?: boolean;
}

export default function DynamicForm({
  schema,
  onSubmit,
  initialData,
  isLoading = false,
}: DynamicFormProps) {
  const zodSchema = generateZodSchema(schema.fields);

  const form = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: initialData || {},
  });

  const renderField = (field: FormFieldType) => {
    if (!field.shown) {
      return null;
    }

    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>{renderFormControl(field, formField)}</FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const renderFormControl = (field: FormFieldType, formField: any) => {
    if (!field.shown) {
      return null;
    }

    switch (field.component) {
      case "Input":
        return (
          <Input
            {...formField}
            type={field.type}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );

      // case "Select":
      //   return (
      //     <Select
      //       onValueChange={formField.onChange}
      //       defaultValue={formField.value}
      //       disabled={field.disabled || isLoading}
      //     >
      //       <SelectTrigger>
      //         <SelectValue
      //           placeholder={`Select ${field.label.toLowerCase()}`}
      //         />
      //       </SelectTrigger>
      //       <SelectContent>
      //         {field.options?.map((option) => (
      //           <SelectItem key={option.value} value={option.value}>
      //             {option.label}
      //           </SelectItem>
      //         ))}
      //       </SelectContent>
      //     </Select>
      //   );

      // case "FileUpload":
      //   return <FileUploadField field={field} formField={formField} />;
      //
      // case "ComponentField":
      //   return <ComponentField field={field} formField={formField} />;
      //
      // case "DynamicZone":
      //   return <DynamicZoneField field={field} formField={formField} />;

      default:
        return (
          <Input
            {...formField}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {schema.fields.map(renderField)}
        </div>

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
  );
}
