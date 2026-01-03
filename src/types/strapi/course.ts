import type { SimpleLink } from "./common";

export type Course = {
  id: number;
  documentId: string;
  title: string;
  degreeType: "I stopień" | "II stopień";
  format: "Stacjonarne" | "Niestacjonarne";
  semesterCount: number;
  description?: string;
  syllabusLink?: SimpleLink;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};
