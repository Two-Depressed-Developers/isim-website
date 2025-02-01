type Pagination = {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
};

export type Link = {
  id: number;
  URL: string;
  label: string;
  isExternal: boolean;
  openInNewWindow: boolean;
  subLinks?: Link[];
  page?: Page;
}

export type ImageLink = {
  id: number;
  alt: string;
  image: {
    url: string;
  }
  link: Link;
}

export type SimpleSection = {
  id: number;
  title: string;
  text: string;
  images: ImageLink[];
  cta: Link;
}

export type Page = {
  name: string;
  slug: string;
}

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

export type Footer = {
  copyrightText: string;
  universityLogo: ImageLink;
  sections: SimpleSection[];
}

export type FooterData = Footer & {
  error: boolean;
}

export type Header = {
  logo: ImageLink;
  links: Link[];
}

export type HeaderData = Header & {
  error: boolean;
}

// TODO: Add error for xxxData types
