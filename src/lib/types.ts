export interface Link {
  URL: string;
  text: string;
  isExternal: boolean;
}

export interface MemberResearch {
  id: number;
  PublicationsLink: Link;
  ORCIDLink: Link;
  ResearchgateLink: Link;
  ReasercherIdLink: Link;
}

export interface Member {
  id: number;
  documentId: string;
  firstName: string;
  lastName: string;
  title: string;
  phone: string;
  email: string;
  position: string;
  room: string;
  photo: {
    url: string;
    alternativeText: string;
  };
  forStudents: string;
  USOSLink: Link;
  BADAPLink: Link;
  SKOSLink: Link;
  PortfolioLink: Link;
  Research: MemberResearch;
}

export interface Group {
  id: number;
  documentId: string;
  name: string;
  siteLink?: Link;
  supervisor?: Member;
  members: Member[];
}
