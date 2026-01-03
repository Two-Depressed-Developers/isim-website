import type { SimpleLink } from "./common";

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
