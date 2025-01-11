export interface ILink {
  URL: string;
  text: string;
  isExternal: boolean;
}

export interface IMember {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  phone: string;
  email: string;
  photo: {
    url: string;
    alternativeText: string;
  };
  USOSLink: ILink;
  BADAPLink: ILink;
  SKOSLink: ILink;
}

export interface IGroup {
  id: number;
  name: string;
  siteLink: ILink;
  supervisor: IMember;
  members: IMember[];
}
