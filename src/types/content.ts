import type { Image, SimpleLink } from "./common";

export type SectionFeatureItem = {
  id: number;
  value?: string;
};

export type OfferSection = {
  id: number;
  sectionTitle: string;
  features?: SectionFeatureItem[];
};

export type ResearchOffer = {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  offerSections?: OfferSection[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};

export type Course = {
  id: number;
  documentId: string;
  title: string;
  degreeType: "I stopień" | "II stopień";
  format: "Stacjonarne" | "Niestacjonarne";
  semesterCount: number;
  description?: string;
  syllabusLink?: SimpleLink;
  image?: Image;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};

export type Conference = {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  eventType: "Cykliczne" | "Jednorazowe";
  conferenceLink?: SimpleLink;
  conferenceImage?: {
    url: string;
    alternativeText: string;
  };
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};

export type Journal = {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  journalLink?: SimpleLink;
  coverImage?: {
    url: string;
    alternativeText: string;
  };
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};
