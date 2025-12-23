import { Control } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldComponents } from "./DynamicForm.components";
import { FIELD_CATEGORIES } from "./DynamicForm.config";
import { VisibleFormField } from "./DynamicForm.types";

type CategorySectionProps = {
  categoryKey: string;
  fields: VisibleFormField[];
  control: Control<any>;
  onPhotoUpload?: (file: File) => Promise<{ id: number; url: string }>;
};

export default function CategorySection({
  categoryKey,
  fields,
  control,
  onPhotoUpload,
}: CategorySectionProps) {
  const config = FIELD_CATEGORIES[categoryKey];

  if (!config || fields.length === 0) return null;

  const renderFormControl = (field: VisibleFormField, formField: any) => {
    const Component =
      FieldComponents[field.component as keyof typeof FieldComponents] ||
      FieldComponents.Input;

    return <Component field={field} formField={formField} />;
  };

  const renderField = (field: VisibleFormField) => {
    if (field.name.toLowerCase() === "photo" && categoryKey === "basic") {
      return (
        <FormField
          key={field.name}
          control={control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem className="col-span-full">
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <FieldComponents.FileUpload
                  field={field}
                  formField={formField}
                  onUpload={onPhotoUpload}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    return (
      <FormField
        key={field.name}
        control={control}
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {config.title}
        </CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {fields.map(renderField)}
        </div>
      </CardContent>
    </Card>
  );
}
