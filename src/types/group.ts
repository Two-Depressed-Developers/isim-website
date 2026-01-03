import type { SimpleLink } from "./common";
import type { MemberData } from "./member";
import type { StrapiCollectionResponse } from "./data";

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
};

export type GroupData = StrapiCollectionResponse<Group> & {
  error: boolean;
};
