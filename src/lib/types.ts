export interface Link {
  URL: string;
  text: string;
  isExternal: boolean;
}

export interface Member {
  id: number;
  documentId: string;
  firstName: string;
  lastName: string;
  title: string;
  phone: string;
  email: string;
  photo: {
    url: string;
    alternativeText: string;
  };
  USOSLink: Link;
  BADAPLink: Link;
  SKOSLink: Link;
}

export interface Group {
  id: number;
  documentId: string;
  name: string;
  siteLink: Link;
  supervisor: Member;
  members: Member[];
}
