type Pagination = {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
};

export type Link = {
  URL: string;
  text?: string;
  isExternal: boolean;
};

export type MemberResearch = {
  id: number;
  PublicationsLink?: Link;
  ORCIDLink?: Link;
  ResearchgateLink?: Link;
  ReasercherIdLink?: Link;
};

type Member = {
  id: number;
  documentId: string;
  firstName: string;
  lastName: string;
  title: string;
  phone?: string;
  email?: string;
  position?: string;
  room?: string;
  photo?: {
    url: string;
    alternativeText: string;
  };
  forStudents?: string;
  USOSLink?: Link;
  BADAPLink?: Link;
  SKOSLink?: Link;
  PortfolioLink?: Link;
  Research?: MemberResearch;
};

export type MemberData = Member & {
  error: boolean;
};

export type Group = {
  id: number;
  documentId: string;
  name: string;
  siteLink?: Link;
  supervisor?: MemberData;
  members?: MemberData[];
};

export type GroupData = { data: Group[]; meta: Pagination } & {
  error: boolean;
};

// TODO: Add error for xxxData types
