export type FormFieldType =
  | {
      shown: true;
      name: string;
      label: string;
      type: string;
      component: string;
      description?: string;
      validation?: any;
      options?: Array<{ label: string; value: string }>;
      multiple?: boolean;
      accept?: string;
      componentType?: string;
      repeatable?: boolean;
      components?: string[];
    }
  | {
      shown: false;
    };

export type FormSchema = {
  fields: FormFieldType[];
  title?: string;
}
