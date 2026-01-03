import type { SimpleLink } from "./common";

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
