import type { Pagination, SimpleLink } from "./common";
import type { MemberData } from "./member";

export type Group = {
  id: number;
  documentId: string;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  siteLink?: SimpleLink;
  badapLink?: SimpleLink;
  keywords?: string;
  supervisor?: MemberData;
  members?: MemberData[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};

export type GroupData = { data: Group[]; meta: Pagination } & {
  error: boolean;
};
