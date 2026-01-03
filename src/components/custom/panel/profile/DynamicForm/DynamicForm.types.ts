type ValidationRules = {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
};

export type BaseFormField = {
  name: string;
  label: string;
  type: string;
  component: string;
  description?: string;
  validation?: ValidationRules;
  options?: Array<{ label: string; value: string }>;
  multiple?: boolean;
  accept?: string;
  componentType?: string;
  repeatable?: boolean;
  components?: string[];
};

export type VisibleFormField = BaseFormField & {
  shown: true;
};

export type HiddenFormField = {
  shown: false;
  name?: string;
};

export type FormFieldType = VisibleFormField | HiddenFormField;

export type FormSchema = {
  fields: FormFieldType[];
  title?: string;
};

export const isVisibleField = (
  field: FormFieldType,
): field is VisibleFormField => {
  return field.shown === true;
};

export const isHiddenField = (
  field: FormFieldType,
): field is HiddenFormField => {
  return field.shown === false;
};
