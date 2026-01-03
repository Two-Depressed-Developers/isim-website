import { VisibleFormField } from "./DynamicForm.types";

export type CategoryConfig = {
  title: string;
  description: string;
  order: number;
  fields: string[];
  patterns?: string[];
};

export const FIELD_CATEGORIES: Record<string, CategoryConfig> = {
  basic: {
    title: "Basic Information",
    description: "Your core profile details",
    order: 1,
    fields: ["photo", "fullName", "title", "position"],
    patterns: ["photo", "image", "name", "title", "position"],
  },
  contact: {
    title: "Contact Information",
    description: "How people can reach you",
    order: 2,
    fields: ["email", "phone", "room", "building"],
    patterns: ["email", "phone", "room", "building", "consultation", "office"],
  },
  links: {
    title: "Academic & Professional Links",
    description: "Your online presence and profiles",
    order: 3,
    fields: ["USOSLink", "SKOSLink", "BADAPLink", "PortfolioLink"],
    patterns: [
      "link",
      "usos",
      "skos",
      "badap",
      "portfolio",
      "orcid",
      "scholar",
      "researchgate",
      "linkedin",
    ],
  },
  research: {
    title: "Research & Publications",
    description: "Your academic work and interests",
    order: 4,
    fields: [],
    patterns: ["research", "publication", "interest", "expertise"],
  },
  additional: {
    title: "Additional Information",
    description: "Other profile details",
    order: 5,
    fields: [],
    patterns: [],
  },
};

export const categorizeField = (field: VisibleFormField): string => {
  const fieldName = field.name.toLowerCase();

  for (const [categoryKey, config] of Object.entries(FIELD_CATEGORIES)) {
    if (config.fields.some((f) => f.toLowerCase() === fieldName)) {
      return categoryKey;
    }
  }

  for (const [categoryKey, config] of Object.entries(FIELD_CATEGORIES)) {
    if (config.patterns?.some((pattern) => fieldName.includes(pattern))) {
      return categoryKey;
    }
  }

  if (field.type === "component" || field.type === "dynamiczone") {
    return "links";
  }

  return "additional";
};

export const groupFieldsByCategory = (
  fields: VisibleFormField[],
): Record<string, VisibleFormField[]> => {
  const categorized = fields.reduce(
    (acc, field) => {
      const category = categorizeField(field);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(field);
      return acc;
    },
    {} as Record<string, VisibleFormField[]>,
  );

  if (categorized.basic) {
    categorized.basic.sort((a, b) => {
      if (a.name.toLowerCase() === "photo") return -1;
      if (b.name.toLowerCase() === "photo") return 1;
      return 0;
    });
  }

  return categorized;
};

export const getSortedCategories = (
  categorizedFields: Record<string, VisibleFormField[]>,
): string[] => {
  return Object.keys(categorizedFields)
    .filter((categoryKey) => categorizedFields[categoryKey].length > 0)
    .sort((a, b) => {
      const orderA = FIELD_CATEGORIES[a]?.order ?? 999;
      const orderB = FIELD_CATEGORIES[b]?.order ?? 999;
      return orderA - orderB;
    });
};
